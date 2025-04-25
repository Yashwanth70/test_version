import React, { useState, useEffect } from 'react';
import './Notes.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/notes');
      const data = await response.json();
      
      if (data.success) {
        setNotes(data.notes);
      } else {
        setError('Failed to fetch notes');
      }
    } catch (error) {
      setError('Error fetching notes');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content) {
      return;
    }

    try {
      const url = editMode ? `/api/v1/notes/${currentNoteId}` : '/api/v1/notes';
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
      });
      
      const data = await response.json();
      
      if (data.success) {
        resetForm();
        fetchNotes();
      } else {
        setError(`Failed to ${editMode ? 'update' : 'create'} note`);
      }
    } catch (error) {
      setError(`Error ${editMode ? 'updating' : 'creating'} note`);
      console.error(`Error ${editMode ? 'updating' : 'creating'} note:`, error);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setCurrentNoteId(note.id);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`/api/v1/notes/${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          fetchNotes();
        } else {
          setError('Failed to delete note');
        }
      } catch (error) {
        setError('Error deleting note');
        console.error('Error deleting note:', error);
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCurrentNoteId(null);
    setEditMode(false);
  };

  return (
    <div className="notes-container">
      <div className="notes-content">
        <h1 className="notes-title">Notes</h1>
        
        {error && <div className="notes-error">{error}</div>}
        
        <form className="notes-form" onSubmit={handleSubmit}>
          <h2>{editMode ? 'Edit Note' : 'Create New Note'}</h2>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter content"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editMode ? 'Update Note' : 'Save Note'}
            </button>
            {editMode && (
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        
        <div className="notes-list">
          <h2>Your Notes</h2>
          
          {loading ? (
            <p>Loading notes...</p>
          ) : notes.length === 0 ? (
            <p>No notes yet. Create one!</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="note-card">
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <div className="note-actions">
                  <button 
                    className="btn-edit" 
                    onClick={() => handleEdit(note)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDelete(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes; 
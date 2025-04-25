// In-memory data store for notes
let notes = [];
let nextId = 1;

// Create a new note
exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Please provide both title and content"
            });
        }
        
        const note = {
            id: nextId++,
            title,
            content,
            createdAt: new Date()
        };
        
        notes.push(note);
        
        res.status(201).json({
            success: true,
            note
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all notes
exports.getAllNotes = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            count: notes.length,
            notes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single note by ID
exports.getNoteById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const note = notes.find(note => note.id === id);
        
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }
        
        res.status(200).json({
            success: true,
            note
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a note
exports.updateNote = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, content } = req.body;
        
        let noteIndex = notes.findIndex(note => note.id === id);
        
        if (noteIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }
        
        // Update only provided fields
        if (title) notes[noteIndex].title = title;
        if (content) notes[noteIndex].content = content;
        notes[noteIndex].updatedAt = new Date();
        
        res.status(200).json({
            success: true,
            note: notes[noteIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a note
exports.deleteNote = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const noteIndex = notes.findIndex(note => note.id === id);
        
        if (noteIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }
        
        const deletedNote = notes.splice(noteIndex, 1)[0];
        
        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
            note: deletedNote
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 
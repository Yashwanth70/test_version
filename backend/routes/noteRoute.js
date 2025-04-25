const express = require('express');
const { createNote, getAllNotes, getNoteById, updateNote, deleteNote } = require('../controllers/noteController');

const router = express.Router();

// Note routes
router.route('/notes').get(getAllNotes).post(createNote);
router.route('/notes/:id').get(getNoteById).put(updateNote).delete(deleteNote);

module.exports = router; 
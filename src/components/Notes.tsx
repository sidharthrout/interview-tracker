'use client'

import { useState, useEffect } from 'react'
import { FaStickyNote, FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import { useToast } from './Toast'

interface Note {
  id: string
  content: string
  createdAt: string
  userId: string
}

interface NotesProps {
  userId: string
}

export default function Notes({ userId }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    fetchNotes()
  }, [userId])

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/notes?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      showToast('Failed to load notes', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newNote }),
      })

      if (!response.ok) {
        throw new Error('Failed to create note')
      }

      const createdNote = await response.json()
      setNotes([...notes, createdNote])
      setNewNote('')
      showToast('Note created successfully', 'success')
    } catch (error) {
      showToast('Failed to create note', 'error')
    }
  }

  const handleDelete = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete note')
      }

      setNotes(notes.filter(note => note.id !== noteId))
      showToast('Note deleted successfully', 'success')
    } catch (error) {
      showToast('Failed to delete note', 'error')
    }
  }

  const handleUpdate = async (noteId: string, content: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error('Failed to update note')
      }

      setNotes(notes.map(note => 
        note.id === noteId ? { ...note, content } : note
      ))
      setEditingNote(null)
      showToast('Note updated successfully', 'success')
    } catch (error) {
      showToast('Failed to update note', 'error')
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <FaStickyNote className="text-blue-500" />
          <span>Quick Notes</span>
        </h2>
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a new note..."
            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            disabled={!newNote.trim()}
          >
            <FaPlus />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No notes yet. Add your first note above.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-blue-50 rounded-lg p-4 hover-card relative group"
            >
              {editingNote?.id === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingNote(null)}
                      className="text-gray-600 hover:text-gray-800 p-2"
                    >
                      <FaTimes />
                    </button>
                    <button
                      onClick={() => handleUpdate(note.id, editingNote.content)}
                      className="text-green-600 hover:text-green-800 p-2"
                    >
                      <FaSave />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <button
                      onClick={() => setEditingNote(note)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit note"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete note"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
              <div className="mt-2 text-xs text-gray-500">
                {new Date(note.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
// Hooks
const { useState, useEffect, useRef } = React
const { Link, useSearchParams } = ReactRouterDOM

// Services
import { showErrorMsg, showSuccessMsg, showUserMsg } from '../../../services/event-bus.service.js'
import { noteService } from '../../../apps/note/services/note.service.js'
import { getTruthyValues } from '../../../services/util.service.js'

// Cmps
import { NoteList } from '../../../apps/note/cmps/NoteList.jsx'
import { PinnedNoteList } from '../../../apps/note/cmps/PinnedNoteList.jsx'
import { NoteDisplay } from '../../../apps/note/cmps/NoteDisplay.jsx'
import { AppLoader } from '../../../cmps/AppLoader.jsx'
import { AddNote } from '../../../apps/note/cmps/AddNote.jsx'

//Pages
import { NotesFilter } from '../../../apps/note/pages/NotesFilter.jsx'

export function NoteIndex() {
  const [notes, setNotes] = useState(null)
  const [searchPrms, setSearchPrms] = useSearchParams()
  const [filterBy, setFilterBy] = useState(noteService.getFilterFromSearchParams(searchPrms))
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    loadNotes()
    setSearchPrms(getTruthyValues(filterBy))
  }, [filterBy])

  function loadNotes() {
    noteService
      .query(filterBy)
      .then(setNotes)
      .catch((err) => {
        console.log('Problems getting note:', err)
      })
  }

  function handleAddNote(newNote) {
    setNotes((prevNotes) => [...prevNotes, newNote])
  }

  function onRemoveNote(noteId) {
    noteService
      .remove(noteId)
      .then(() => {
        setNotes((notes) => notes.filter((note) => note.id !== noteId))
        showSuccessMsg(`Note removed successfully!`)
      })
      .catch((err) => {
        console.log('Problems removing note:', err)
        showErrorMsg(`Problems removing note (${noteId})`)
      })
  }

  function onPinnedNote(noteId) {
    const noteIdx = notes.find((note) => note.id === noteId)

    if (!noteIdx) {
      showErrorMsg(`Note not found (${noteId})`)
      return
    }
    const updatedNote = { ...noteIdx, isPinned: !noteIdx.isPinned }

    noteService
      .save(updatedNote)
      .then(() => {
        setNotes((Notes) => Notes.map((note) => (note.id === noteId ? updatedNote : note)))
        showSuccessMsg(`Note ${updatedNote.isPinned ? 'pinned' : 'unpinned'} successfully!`)
      })
      .catch((err) => {
        console.log('Problems pinning the note:', err)
        showErrorMsg(`Problems pinning the note (${noteId})`)
      })
  }

  function onSetFilterBy(filterBy) {
    setFilterBy((preFilter) => ({ ...preFilter, ...filterBy }))
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen)
  }

  if (!notes) return <AppLoader />

  return (
    <main className='notes-index'>
      {/* Hamburger Icon */}
      <header className='notes-nav-bar'>
        <div className='notes-header-left'>
          <div className='hamburger-icon' onClick={toggleMenu}>
            &#9776; {/* hamburger icon */}
          </div>
          <div className='notes-logo'></div>
        </div>
        <section className='notes-filter'>
          <NotesFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        </section>
      </header>

      {/* Side Menu */}
      {isMenuOpen && (
        <section className='notes-menu-container'>
          <div className='hamburger-icon-close' onClick={toggleMenu}>
            &#9776; {/* hamburger icon */}
          </div>
          <ul className='notes-menu'>
            <li className='notes'>
              <Link to='/'>Home</Link>
            </li>
            <li className='notes-home'>
              <Link to='/note'>Notes</Link>
            </li>
          </ul>
        </section>
      )}

      {/* Notes Body */}
      <section className='notes-body'>
        <AddNote handleAddNote={handleAddNote} />
        <NoteDisplay notes={notes} onRemoveNote={onRemoveNote} onPinnedNote={onPinnedNote} />
      </section>
    </main>
  )
}

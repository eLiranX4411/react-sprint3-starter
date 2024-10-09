import { NoteTxt } from '../../../apps/note/cmps/NoteTxt.jsx'
import { NoteImg } from '../../../apps/note/cmps/NoteImg.jsx'
import { NoteTodos } from '../../../apps/note/cmps/NoteTodos.jsx'
import { NoteVideo } from '../../../apps/note/cmps/NoteVideo.jsx'
import { ColorInput } from '../../../apps/note/cmps/ColorInput.jsx'

const { useState } = React
const { Link } = ReactRouterDOM

export function NotePreview({
  note,
  handleTodoCheck,
  onDuplicateNote,
  onRemoveNote,
  onPinnedNote,
  onSetNewColor
}) {
  const [cmpType, setCmpType] = useState(note.type)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)

  function onColorSelect(color) {
    onSetNewColor(note.id, color)
    setIsColorPickerOpen(false)
  }

  const noteStyle = {
    backgroundColor: note.style.backgroundColor || 'white' // Default to white if no color is set
  }

  return (
    <section style={noteStyle} className='notes-preview'>
      <DynamicCmp
        cmpType={cmpType}
        note={note}
        handleTodoCheck={handleTodoCheck}
        onRemoveNote={onRemoveNote}
      />
      <div className='notes-actions'>
        <button onClick={() => onRemoveNote(note.id)}>Remove</button>
        <button onClick={() => onPinnedNote(note.id)}>{note.isPinned ? 'Unpin' : 'Pin'}</button>
        <button onClick={() => onDuplicateNote(note.id)}>Duplicate</button>
        <button onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}>Change Color</button>
        <Link to={`/note/edit/${note.id}`}>
          <button>Edit</button>
        </Link>
      </div>
      {isColorPickerOpen && <ColorInput onColorSelect={onColorSelect} />}
    </section>
  )
}

function DynamicCmp(props) {
  switch (props.cmpType) {
    case 'NoteTxt':
      return <NoteTxt {...props} />

    case 'NoteImg':
      return <NoteImg {...props} />

    case 'NoteTodos':
      return <NoteTodos {...props} />

    case 'NoteVideo':
      return <NoteVideo {...props} />
  }
}

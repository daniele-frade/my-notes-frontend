import { useState, useEffect } from 'react' 
import { Button } from 'react-bootstrap'
import { useOktaAuth } from '@okta/okta-react'
import { useHistory } from 'react-router-dom'
import { WithContext as ReactTags } from 'react-tag-input'

const apiURL = 'http://localhost:3003/notes'
const KeyCodes = {
  comma: 188,
  enter: [10, 13],
}
const delimiters = [...KeyCodes.enter, KeyCodes.comma]

const SingleNote = (props) => {

  const [state, setState] = useState({
    id: '',
    title: '',
    body: '',
    date: '',
    editTitle: '',
    editBody: '',
    tags: [],
    suggestions: [],
    isEditing: null
  })

  const { oktaAuth, authState } = useOktaAuth()
  const history = useHistory()

  useEffect(() => {
    getSingleNote(props.noteId)
  }, [])

  const getSingleNote = (id) => {
    fetch(apiURL + '/' + id, {
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        authorization: `Bearer ${oktaAuth.getAccessToken()}`,
      }
    })
    .then(data => { return data.json()}, err => console.log(err))
    .then(retrievedNote => {
      props.setBreadcrumbs(retrievedNote.title)
      for (let i=0; i < retrievedNote.tags.length; i++) {
        retrievedNote.tags[i]['id'] = retrievedNote.tags[i]['_id']
      }
      setState({
        ...state,
        'id': retrievedNote._id,
        'title': retrievedNote.title,
        'date': retrievedNote.date,
        'body': retrievedNote.body,
        'tags': retrievedNote.tags
      })
    })
    .catch( error => console.log(error) )
  }

  const handleChange = (e) => {
    const newValue = e.target.value
    setState({
      ...state,
      [e.target.id]: newValue
    })
  }

  const handleDelete = () => {
    fetch(`${apiURL}/${state.id}`, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          authorization: `Bearer ${oktaAuth.getAccessToken()}`,
        }
    })
    .then(res => {
        if(res.status !== 200) {
            console.log('Unable to delete note.')
        }
    })
    props.onDelete(state.id);
    history.push('/');
  }

  const handleEdit = () => {
    setState({
      ...state,
      'isEditing': true,
      'editTitle': state.title,
      'editBody': state.body
    })
  }

  const handleSave = () => {
    const newDate = Date.now()
    setState({
      ...state,
      'isEditing': false,
      'title': state.editTitle,
      'body': state.editBody,
      'date': newDate
    })

    fetch(apiURL + '/' + state.id, {
        method: 'PUT',
        body: JSON.stringify({ title: state.editTitle, body: state.editBody, tags: state.tags }),
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          authorization: `Bearer ${oktaAuth.getAccessToken()}`,
        }
    }).then(res => res.json())
    .then(updatedNote => {
        props.onUpdate(updatedNote)
    })
    .catch(error => console.log({ 'Error': error }))
  }

  const handleTagDelete = (i) => {
      setState({
        ...state,
        'tags': state.tags.filter((tag, index) => index !== i)
      })
  }

  const handleTagAddition = (tag) => {
      setState({
        ...state,
        'tags': [...state.tags, tag]
      })
  }
  
  const handleCancel = () => {
    setState({
      ...state,
      'isEditing': false
    })
  }
 
  if (!state.isEditing) {
      return (
          <div key="view" className="showView">
              <h2>{state.title}</h2> 
              <div className="date">{new Date(state.date).toLocaleDateString(undefined, {
                      day:    'numeric',
                      month:  'numeric',
                      year:   'numeric',
                      hour:   '2-digit',
                      minute: '2-digit',
                  })}
              </div>
              <p className="tags-wrapper">
                {state.tags.map(tag => {
                    return (<span key={props.noteId + tag._id} className="tag">{tag.name}</span>)
                })}
              </p>
              <p>{state.body}</p>
              <p>
                <span className="action" onClick={ handleEdit }>Edit</span>
                <span className="action" onClick={ handleDelete }>Delete</span>
              </p>
          </div>
      )
  } else {
      return (
          <div key="edit" className="editView">
              <form>
                <p><input type="text" onChange={ e => handleChange(e) } id="editTitle" placeholder="Enter note title" name="title" value={state.editTitle} /></p>
                <div>
                <ReactTags 
                    inputFieldPosition="inline" 
                    labelField='name'
                    tags={state.tags}
                    autofocus={false}
                    allowDragDrop={false}
                    placeholder="New tag..."
                    suggestions={state.suggestions}
                    handleDelete={handleTagDelete}
                    handleAddition={handleTagAddition}
                    delimiters={delimiters} />
              </div>
                <p><textarea onChange={ e => handleChange(e) } id="editBody" placeholder="Write your note here" name="body" value={state.editBody} /></p>
                <p>
                  <Button onClick={handleCancel} variant="light">Cancel</Button>
                  <Button onClick={handleSave} variant="success">Save</Button>
                </p>
              </form>
          </div>
      )
  }
}

export default SingleNote

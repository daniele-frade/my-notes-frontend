import { useState, useEffect } from 'react' 
import { Redirect } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useOktaAuth } from '@okta/okta-react'
import { WithContext as ReactTags } from 'react-tag-input'

const baseURL = 'http://localhost:3003'
const KeyCodes = {
  comma: 188,
  enter: [10, 13],
}
const delimiters = [...KeyCodes.enter, KeyCodes.comma]

const NewForm = (props) => {
  
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [redirect, setRedirect] = useState(null)
  const [tags, setTags] = useState([])
  const [suggestions, setSuggestions] = useState([])

  const { oktaAuth, authState } = useOktaAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch(baseURL + '/notes', {
      method: 'POST',
      body: JSON.stringify({ title: title, body: body, tags: tags }),
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        authorization: `Bearer ${oktaAuth.getAccessToken()}`,
      }
    }).then(res => res.json())
      .then(resJson => {
        props.addNote(resJson)
        setTitle('')
        setBody('')
        setTags([])
        setRedirect('/')
      })
      .catch(error => console.log({ 'Error': error }))
  }

  const handleCancel = () => {
    setTitle('')
    setBody('')
    setRedirect('/')
  }

  const handleTagDelete = (i) =>{
      setTags(tags.filter((tag, index) => index !== i))
  }

  const handleTagAddition = (tag) => {
      setTags([...tags, tag])
  }

  useEffect(() => {
    props.setBreadcrumbs('Add new note')
  }, [])
  
  if (redirect) {
      return <Redirect to={redirect} />
  } else {
      return (
          <form>
              <p>
                <input onChange={ e => setTitle(e.target.value) } type="text" placeholder="Note Title" id="title" name="title" value={ title } />
              </p>
              <p>
                <ReactTags 
                    inputFieldPosition="inline" 
                    labelField='name'
                    tags={tags}
                    autofocus={false}
                    allowDragDrop={false}
                    placeholder="New tag..."
                    suggestions={suggestions}
                    handleDelete={handleTagDelete}
                    handleAddition={handleTagAddition}
                    delimiters={delimiters} />
              </p>
              <p>
                <textarea onChange={ e => setBody(e.target.value) } type="textarea" placeholder="Type your body content here" id="body" name="body" value={ body }></textarea>
              </p>
              <p>
                <Button onClick={handleCancel} variant="light">Cancel</Button>
                <Button onClick={ handleSubmit } variant="success">Add</Button>
              </p>
          </form>
      )
  } 
}

export default NewForm

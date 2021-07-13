import { useState, useEffect } from 'react' 
import { Redirect } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useOktaAuth } from '@okta/okta-react'

const baseURL = 'http://localhost:3003'

const NewForm = (props) => {
  
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [redirect, setRedirect] = useState(null)

  const { oktaAuth, authState } = useOktaAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch(baseURL + '/my-notes', {
      method: 'POST',
      body: JSON.stringify({ title: title, body: body }),
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
        setRedirect('/')
      })
      .catch(error => console.log({ 'Error': error }))
  }

  const handleCancel = () => {
    setTitle('')
    setBody('')
    setRedirect('/')
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

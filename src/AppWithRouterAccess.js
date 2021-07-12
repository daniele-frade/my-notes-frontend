import { useState, useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react'
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js'

import 'react-pro-sidebar/dist/css/styles.css'

import Header from './components/Header'
import AllNotes from './components/AllNotes'
import SingleNote from './components/SingleNote'
import NewForm from './components/NewForm'
import Sidebar from './components/Sidebar';
import Breadcrumbs from './components/Breadcrumbs'
import Login from './components/Login'

const apiURL = 'http://localhost:3003/my-notes'

const oktaAuth = new OktaAuth({
  issuer: 'https://dev-68864381.okta.com/oauth2/default',
  clientId: '0oa17cxnn4No03oAI5d7',
  redirectUri: 'http://localhost:3000/callback'
});

const AppWithRouterAccess = () => {

  const [subpageTitle, setSubpageTitle] = useState(null)

  const [notes, setNotes] = useState([])

  const history = useHistory()
  
  const customRestoreOriginalUri = async (_oktaAuth, originalUri) => {
      console.log('============== dani')
    history.replace(toRelativeUrl(originalUri, window.location.origin))
  }
  
  const onAuthRequired = function() {
    history.push('/login')
  }

  const getNotes = () => {
    fetch(apiURL)
    .then(data => { return data.json()}, err => console.log(err))
    .then(notesFromServer => setNotes(notesFromServer), err => console.log(err))
  }

  const updateBreadCrumbs = (newSubpageTitle) => {
    setSubpageTitle(newSubpageTitle)
  }

  const addNote = (note) => {
    const copyNotes = [...notes]
    copyNotes.unshift(note)
    setNotes(copyNotes)
  }

  const onNoteUpdate = (updatedNote) => {
    const findIndex = notes.findIndex(note => note._id === updatedNote._id)
    const copyNotes = [...notes]
    copyNotes[findIndex].title = updatedNote.title
    copyNotes[findIndex].date = updatedNote.date
    copyNotes[findIndex].body = updatedNote.body
    setNotes(copyNotes)
  }

  const deleteNoteFromView = (id) => {
    const findIndex = notes.findIndex(note => note._id === id)
    const copyNotes = [...notes]
    copyNotes.splice(findIndex, 1)

    setNotes(copyNotes)

    fetch(`${apiURL}/${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        if(res.status !== 200) {
            console.log('Unable to delete note.')
        }
    })
  }

  useEffect(() => {
    getNotes()
  }, [])
    
  return (
    <Security 
      oktaAuth={oktaAuth}
      restoreOriginalUri={ customRestoreOriginalUri }
      onAuthRequired={onAuthRequired}>
      <div className="app">
        <Sidebar />
        <main>
            <Header />
            <div className="mainContent">
              <Breadcrumbs subpageTitle={ subpageTitle }/>
              <Switch>
                <SecureRoute exact path="/" render={(props) => (
                    <AllNotes {...props} notes={notes} onNoteLoad={ updateBreadCrumbs} />
                )} />
                <SecureRoute path="/new-note">
                  <NewForm onNoteLoad={ updateBreadCrumbs} addNote={ addNote } />
                </SecureRoute>
                <SecureRoute path="/note/:id" render={(props) => 
                    <SingleNote {...props} noteId={props.match.params.id} onNoteLoad={ updateBreadCrumbs} onUpdate={ onNoteUpdate } onDelete={ deleteNoteFromView }/>
                } />
                <Route path='/login' exact={true} component={Login}/>
                <Route path='/callback' component={LoginCallback}/>
              </Switch>
            </div>
        </main>
        
      </div>
    </Security>
  )
  
}

export default AppWithRouterAccess
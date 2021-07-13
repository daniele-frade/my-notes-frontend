import { useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { LoginCallback, SecureRoute, Security, useOktaAuth } from '@okta/okta-react'
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js'

import 'react-pro-sidebar/dist/css/styles.css'

import Header from './components/Header'
import AllNotes from './components/AllNotes'
import SingleNote from './components/SingleNote'
import NewForm from './components/NewForm'
import Sidebar from './components/Sidebar';
import Breadcrumbs from './components/Breadcrumbs'
import Login from './components/Login'

const apiURL = 'https://secure-plains-54293.herokuapp.com/'
//const apiURL = 'http://localhost:3003/my-notes'

const oktaAuth = new OktaAuth({
  issuer: 'https://dev-68864381.okta.com/oauth2/default',
  clientId: '0oa17cxnn4No03oAI5d7',
  redirectUri: 'http://localhost:3000/callback'
});

const AppWithRouterAccess = () => {

  const [subpageTitle, setSubpageTitle] = useState(null)

  const [notes, setNotes] = useState([])
  const [user, setUser] = useState(null)

  const history = useHistory()
  
  const customRestoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri, window.location.origin))
  }
  
  const onAuthRequired = function() {
    history.push('/login')
  }

  const setLoggedInUser = (user) => {
    setUser(user)
  }

  const updateBreadCrumbs = (newSubpageTitle) => {
    setSubpageTitle(newSubpageTitle)
  }

  const addNote = (note) => {
    const copyNotes = [...notes]
    copyNotes.unshift(note)
    setNotes(copyNotes)
  }

  const onNotesLoaded = (loadedNotes) => {
    setNotes(loadedNotes)
  }

  const onNoteUpdate = (updatedNote) => {
    updateBreadCrumbs(updatedNote.title)
    const copyNotes = [...notes]
    const findIndex = copyNotes.findIndex(note => note._id === updatedNote._id)
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
  }
    
  return (
    <Security 
      oktaAuth={oktaAuth}
      restoreOriginalUri={ customRestoreOriginalUri }
      onAuthRequired={onAuthRequired}>
      <div className="app">
        <Sidebar />
        <main>
            <Header loggedInUser={ user } setLoggedInUser={ setLoggedInUser } />
            <div className="mainContent">
              <Breadcrumbs subpageTitle={ subpageTitle }/>
              <Switch>
                <SecureRoute exact path="/" render={(props) => (
                    <AllNotes {...props} notes={notes} onNotesLoaded={ onNotesLoaded } setBreadcrumbs={ updateBreadCrumbs} />
                )} />
                <SecureRoute path="/new-note">
                  <NewForm setBreadcrumbs={ updateBreadCrumbs } addNote={ addNote } />
                </SecureRoute>
                <SecureRoute path="/note/:id" render={(props) => 
                    <SingleNote {...props} noteId={props.match.params.id} setBreadcrumbs={ updateBreadCrumbs } onUpdate={ onNoteUpdate } onDelete={ deleteNoteFromView }/>
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
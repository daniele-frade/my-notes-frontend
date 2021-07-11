import { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import 'react-pro-sidebar/dist/css/styles.css'

import Header from './components/Header'
import AllNotes from './components/AllNotes'
import SingleNote from './components/SingleNote'
import NewForm from './components/NewForm'
import Sidebar from './components/Sidebar';
import Breadcrumbs from './components/Breadcrumbs'

const apiURL = 'http://localhost:3003/my-notes'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [],
      subpageTitle: null
    }
    this.getNotes = this.getNotes.bind(this)
    this.addNote = this.addNote.bind(this)
    this.deleteNoteFromView = this.deleteNoteFromView.bind(this)
    this.onNoteUpdate = this.onNoteUpdate.bind(this)
    this.updateBreadCrumbs = this.updateBreadCrumbs.bind(this)
  }

  componentDidMount() {
    this.getNotes()
  } 

  getNotes() {
    fetch(apiURL)
    .then(data => { return data.json()}, err => console.log(err))
    .then(notesFromServer => this.setState({notes: notesFromServer}), err => console.log(err))
  }

  updateBreadCrumbs(newSubpageTitle) {
    this.setState({
      subpageTitle: newSubpageTitle
    })
  }

  addNote(note) {
    const copyNotes = [...this.state.notes]
    copyNotes.unshift(note)
    this.setState({
      notes: copyNotes
    })
  }

  onNoteUpdate(updatedNote) {
    const findIndex = this.state.notes.findIndex(note => note._id === updatedNote._id)
    const copyNotes = [...this.state.notes]
    copyNotes[findIndex].title = updatedNote.title
    copyNotes[findIndex].date = updatedNote.date
    copyNotes[findIndex].body = updatedNote.body
    this.setState({
      notes: copyNotes
    })
  }

  deleteNoteFromView(id) {
    const findIndex = this.state.notes.findIndex(note => note._id === id)
    const copyNotes = [...this.state.notes]
    copyNotes.splice(findIndex, 1)

    this.setState({
      notes: copyNotes
    })

    fetch(`${apiURL}/${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        if(res.status !== 200) {
            console.log('Unable to delete note.')
        }
    })
  }
 
  render() {
    return (
      <Router>
        <div className="app">
          <Sidebar />
          <main>
              <Header />
              <div className="mainContent">
                <Breadcrumbs subpageTitle={ this.state.subpageTitle }/>
                <Switch>
                  <Route exact path="/" render={(props) => (
                      <AllNotes {...props} notes={this.state.notes} onNoteLoad={ this.updateBreadCrumbs} />
                  )} />
                  <Route path="/new-note">
                    <NewForm onNoteLoad={ this.updateBreadCrumbs} addNote={ this.addNote } />
                  </Route>
                  <Route path="/note/:id" render={(props) => 
                      <SingleNote {...props} noteId={props.match.params.id} onNoteLoad={ this.updateBreadCrumbs} onUpdate={ this.onNoteUpdate } onDelete={ this.deleteNoteFromView }/>
                  } />
                </Switch>
              </div>
          </main>
          
        </div>
      </Router>
    )
  }
}

export default App

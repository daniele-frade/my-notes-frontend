import { Component } from 'react'
import NewForm from './components/NewForm'
import AllNotes from './components/AllNotes'
import { BrowserRouter as Router, Route, Switch, Link, useParams } from 'react-router-dom'
import SingleNote from './components/SingleNote'

const apiURL = 'http://localhost:3003/my-notes'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: []
    }
    this.getNotes = this.getNotes.bind(this)
    this.addNote = this.addNote.bind(this)
    this.deleteNoteFromView = this.deleteNoteFromView.bind(this)
    this.onNoteUpdate = this.onNoteUpdate.bind(this)
  }

  componentDidMount() {
    this.getNotes()
  } 

  getNotes() {
    fetch(apiURL)
    .then(data => { return data.json()}, err => console.log(err))
    .then(notesFromServer => this.setState({notes: notesFromServer}), err => console.log(err))
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
        <div className='app'>
          <header>
          <Link to="/"><h1>My Notes</h1></Link>
          </header>
          <div>
            <Switch>
              <Route exact path="/" render={(props) => (
                  <AllNotes {...props} notes={this.state.notes} />
              )} />
              <Route path="/new-note">
                <NewForm addNote={ this.addNote } />
              </Route>
              <Route path="/note/:id" render={(props) => 
                  <SingleNote {...props} noteId={props.match.params.id} onUpdate={ this.onNoteUpdate } onDelete={ this.deleteNoteFromView }/>
              } />
            
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App

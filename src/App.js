import { Component } from 'react'
import NewForm from './components/NewForm'
import EditForm from './components/EditForm'
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom'
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
  }

  componentDidMount() {
    this.getNotes()
  } 

  getNotes() {
    fetch(apiURL)
    .then(data => { return data.json()}, err => console.log(err))
    .then(notesInJson => this.setState({notes: notesInJson}), err => console.log(err))
  }

  addNote(note) {
    const copyNotes = [...this.state.notes]
    copyNotes.unshift(note)
    this.setState({
      notes: copyNotes
    })
  }

  deleteNote(id) {

    fetch(`${apiURL}/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if(res.status === 200) {
          const findIndex = this.state.notes.findIndex(note => note._id === id)
          const copyNotes = [...this.state.notes]
          copyNotes.splice(findIndex, 1)

          this.setState({
            notes: copyNotes
          })
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
              <Route exact path="/">
                <div>
                  <Link to="/new-note">Add New</Link>
                  { this.state.notes.map(note => {
                      return(
                        <Link to={"/note/" + note._id} >
                          <div key={note._id}>
                            <p>{note.title}</p> 
                            <p>{note.date}</p>
                            <p>{note.body}</p>
                            <p className="deleteBtn" onClick={() => this.deleteNote(note._id)}>x</p>
                          </div>
                        </Link>
                      )
                    })
                  }
                </div>
              </Route>
              <Route path="/new-note">
                <NewForm addNote={ this.addNote } />
              </Route>
              <Route path="/note/:id">
                <SingleNote />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App

import { Component } from 'react';
import NewForm from './components/NewForm';

const baseURL = 'http://localhost:3003'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: []
    }
    this.getNotes = this.getNotes.bind(this)
    this.handleAddNotes = this.getNotes.bind(this)
  }

  componentDidMount() {
    this.getNotes()
  }


  getNotes() {
    fetch(baseURL + '/my-notes')
    .then(data => { return data.json()}, err => console.log(err))
    .then(notesInJson => this.setState({notes: notesInJson}), err => console.log(err))
  }

  handleAddNotes(note) {
    const copyNotes = [...this.state.notes]
    copyNotes.unshift(note)
    this.setState({
      notes: copyNotes,
      title: '',
      date: '',
      body: ''
    })
  }

  deleteNote(id) {

    fetch(`${baseURL}/my-notes/${id}`, {
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
      <div className='container'>
        <header>
          <h1>My Notes</h1>
        </header>
        <NewForm handleAddNotes={ this.handleAddNotes } />
        <div>
          { this.state.notes.map(note => {
              return(
                <div>
                  <p>{note.title}</p> 
                  <p>{note.date}</p>
                  <p>{note.body}</p>
                  <p className="deleteBtn" onClick={() => this.deleteNote(note._id)}>x</p>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default App

import { Component } from 'react'

const baseURL = 'http://localhost:3003'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [
        {title: 'First Title', date: '12/12/2021', body: 'This is just the body of the note'},
        {title: 'Second Title', date: '12/12/2021', body: 'This is just the body of the note'},
      ]
    }
  }
 
  render() {
    return (
      <div className='container'>
        <header>
          <h1>My Notes</h1>
        </header>
        <div>
          { this.state.notes.map(note => {
              return(
                <div>
                  <p>{note.title}</p> 
                  <p>{note.date}</p>
                  <p>{note.body}</p>
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

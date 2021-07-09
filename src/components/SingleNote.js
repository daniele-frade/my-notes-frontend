import { Component } from 'react'
import { BrowserRouter as Router, withRouter } from 'react-router-dom'

const apiURL = 'http://localhost:3003/my-notes'

class SingleNote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      title: '',
      body: 'Some body',
      date: '12/12/2020'
    }
  }

  componentDidMount() {
    const noteId = this.props.match.params.id
    this.getSingleNote(noteId)
  } 

  getSingleNote(id) {
    fetch(apiURL + '/' + id)
    .then(data => { return data.json()}, err => console.log(err))
    .then(retrievedNote => this.setState({
        id: retrievedNote._id,
        title: retrievedNote.title,
        date: retrievedNote.date,
        body: retrievedNote.body
    }), err => console.log(err))
  }
 
  render() {
    return (
        <div key="test">
            <h2>{this.state.title}</h2> 
            <p>{this.state.date}</p>
            <p>{this.state.body}</p>
        </div>
    )
  }
}

export default withRouter(SingleNote)

import { Component } from 'react'
import { Redirect } from 'react-router-dom'

const apiURL = 'http://localhost:3003/my-notes'

class SingleNote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      title: '',
      body: '',
      date: ''
    }
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount() {
    console.log(this.props)
    console.log(this.props.match.params)
    const noteId = this.props.noteId
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

  handleDelete() {
    const { match, history } = this.props
    const id = match.params.id;
    this.props.onDelete(id);
    history.push('/');
  }
 
  render() {
    if (this.state.redirect) {
        return <Redirect to={this.state.redirect} />
    } else {
        return (
            <div key="test">
                <h2>{this.state.title}</h2> 
                <p>{this.state.date}</p>
                <p>{this.state.body}</p>
                <p className="deleteBtn" onClick={ this.handleDelete }>x</p>
            </div>
        )
    }
  }
}

export default SingleNote

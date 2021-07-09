import { Component } from 'react'

const apiURL = 'http://localhost:3003/my-notes'

class SingleNote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      title: '',
      body: '',
      date: '',
      isEditing: false
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value })
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

  handleEdit() {
    this.setState({
        isEditing: true
    })
  }

  handleSave() {
    this.setState({
        isEditing: false,
        date: Date.now()
    })
    
    fetch(apiURL + '/' + this.state.id, {
        method: 'PUT',
        body: JSON.stringify({ title: this.state.title, body: this.state.body }),
        headers: {
          'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .then(updatedNote => {
        this.props.onUpdate(updatedNote)
    })
    .catch(error => console.log({ 'Error': error }))
  }
 
  render() {
    if (!this.state.isEditing) {
        return (
            <div key="add">
                <h2>{this.state.title}</h2> 
                <p>{new Date(this.state.date).toLocaleDateString(undefined, {
                        day:    'numeric',
                        month:  'numeric',
                        year:   'numeric',
                        hour:   '2-digit',
                        minute: '2-digit',
                    })}
                </p>
                <p>{this.state.body}</p>
                <p className="deleteBtn" onClick={ this.handleDelete }>x</p>
                <p className="edit" onClick={ this.handleEdit }>Edit</p>
            </div>
        )
    } else {
        return (
            <div key="edit">
                <h2>Edit Note</h2> 
                <p> <input onChange={ this.handleChange } id="title" placeholder="Enter note title" name="title" value={this.state.title} /></p>
                <p> <textarea onChange={ this.handleChange } id="body" placeholder="Write your note here" name="body" value={this.state.body} /></p>
                <p><button onClick={this.handleSave}>Save</button></p>
            </div>
        )
    }
  }
}

export default SingleNote

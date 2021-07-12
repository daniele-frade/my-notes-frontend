import { Component } from 'react'
import { Button } from 'react-bootstrap'


const apiURL = 'http://localhost:3003/my-notes'

class SingleNote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      title: '',
      editTitle: '',
      body: '',
      editBody: '',
      date: '',
      isEditing: false
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleChange(event) {
    this.setState({ [event.currentTarget.id]: event.currentTarget.value })
  }

  componentDidMount() {
    const noteId = this.props.noteId
    this.getSingleNote(noteId)
  } 

  getSingleNote(id) {
    fetch(apiURL + '/' + id)
    .then(data => { return data.json()}, err => console.log(err))
    .then(retrievedNote => {
      this.props.onNoteLoad(retrievedNote.title)
      this.setState({
          id: retrievedNote._id,
          title: retrievedNote.title,
          date: retrievedNote.date,
          body: retrievedNote.body
      })
    })
    .catch( error => console.log(error) )
  }

  handleDelete() {
    const { match, history } = this.props
    const id = match.params.id;
    this.props.onDelete(id);
    history.push('/');
  }

  handleEdit() {
    this.setState({
        isEditing: true,
        editTitle: this.state.title,
        editBody: this.state.body
    })
  }

  handleSave() {
    this.setState({
        isEditing: false,
        date: Date.now(),
        title: this.state.editTitle,
        body: this.state.editBody
    }, function() {
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
    })
    
  }

  
  handleCancel() {
    this.setState({
        isEditing: false
    })
  }
 
  render() {
    if (!this.state.isEditing) {
        return (
            <div key="view" className="showView">
                <h2>{this.state.title}</h2> 
                <div className="date">{new Date(this.state.date).toLocaleDateString(undefined, {
                        day:    'numeric',
                        month:  'numeric',
                        year:   'numeric',
                        hour:   '2-digit',
                        minute: '2-digit',
                    })}
                </div>
                <p>{this.state.body}</p>
                <p>
                  <span className="action" onClick={ this.handleEdit }>Edit</span>
                  <span className="action" onClick={ this.handleDelete }>Delete</span>
                </p>
            </div>
        )
    } else {
        return (
            <div key="edit" className="editView">
                <form>
                  <p><input type="text" onChange={ this.handleChange } id="editTitle" placeholder="Enter note title" name="title" value={this.state.editTitle} /></p>
                  <p><textarea onChange={ this.handleChange } id="editBody" placeholder="Write your note here" name="body" value={this.state.editBody} /></p>
                  <p>
                    <Button onClick={this.handleCancel} variant="light">Cancel</Button>
                    <Button onClick={this.handleSave} variant="success">Save</Button>
                  </p>
                </form>
            </div>
        )
    }
  }
}

export default SingleNote

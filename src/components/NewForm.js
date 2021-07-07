import { Component } from 'react' 

const baseURL = 'http://localhost:3003'

class NewForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      date: '',
      body: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    console.log(event.currentTarget.id)
    this.setState({ [event.currentTarget.id]: event.currentTarget.value })
  }
  handleSubmit(event) {
    event.preventDefault()
    fetch(baseURL + '/my-notes', {
      method: 'POST',
      body: JSON.stringify({ title: this.state.title, date: this.state.date, body: this.state.body }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(resJson => {
        this.props.handleAddNote(resJson)
        this.setState({
          title: '',
          date: '',
          body: ''
        })
      })
      .catch(error => console.log({ 'Error': error }))
  }

  render() {
    return (
      <form onSubmit={ this.handleSubmit }>
        <label>Add a new note</label>
        <input onChange={ this.handleChange } type="text" placeholder="title" id="title" name="title" value={ this.state.title } />
        <input onChange={ this.handleChange } type="date" placeholder="date" id="date" name="date" value={ this.state.date } />
        <textarea onChange={ this.handleChange } type="textarea" placeholder="text body" id="body" name="body" value={ this.state.body }></textarea>
        <input type="submit" value="Add!" />
      </form>
       )
    }
  }
  
  export default NewForm

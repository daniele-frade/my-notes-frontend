import { Component } from 'react'
import {Link } from 'react-router-dom'
import { CardDeck, Card,  } from 'react-bootstrap'

class AllNotes extends Component {
    constructor(props) {
        super(props)
        this.props.onNoteLoad(null)
      }
    
    render () {
        const { notes } = this.props
        return (
            <div>
                <CardDeck>
                { notes.map(note => {
                    return(
                        <Card key={note._id}>
                            <Link key={note._id} to={"/note/" + note._id} >
                            <Card.Body>
                                <small className="text-muted">
                                    {new Date(note.date).toLocaleDateString(undefined, {
                                        day:    'numeric',
                                        month:  'numeric',
                                        year:   'numeric',
                                        hour:   '2-digit',
                                        minute: '2-digit',
                                    })}
                                </small>
                                <Card.Title>{note.title}</Card.Title>
                                <Card.Text>
                                    {note.body_preview}
                                </Card.Text>
                            </Card.Body>
                            </Link>
                        </Card>
                    )
                })
                }
                
                </CardDeck>
            </div>
        )
    }
}

export default AllNotes
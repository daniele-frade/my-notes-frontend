import { useState, useEffect } from 'react'
import {Link, useHistory } from 'react-router-dom'
import { CardDeck, Card, Jumbotron, Button } from 'react-bootstrap'
import { useOktaAuth } from '@okta/okta-react'

const apiURL = 'http://localhost:3003/notes'

const AllNotes = (props) => {

    const { oktaAuth, authState } = useOktaAuth()
    const history = useHistory()

    useEffect(() => {
        props.setBreadcrumbs(null)
        getNotes()
    }, [])

    const addNewNote = () => {
        history.push('/new-note')
    }

    const getNotes = () => {
        fetch(apiURL, {
          headers: {
            'content-type': 'application/json',
            accept: 'application/json',
            authorization: `Bearer ${oktaAuth.getAccessToken()}`,
          }
        })
        .then(data => { return data.json()}, err => console.log(err))
        .then(notesFromServer => {
            props.onNotesLoaded(notesFromServer) 
        })
        .catch((err) =>  {
            console.log(err)
        })
    }
    
    if (props.notes.length === 0 ) {
        return (
            <Jumbotron>
                <h1>Welcome to My Notes!</h1>
                <p>
                    It seems like your note stack is empty. Click on the button below to get started with 
                    adding your first note and beyond. 
                </p>
                <p>
                    <Button onClick={ addNewNote } variant="success">Add New Note</Button>
                </p>
            </Jumbotron>
        )
    }

    return (
        <div>
            <CardDeck>
            { props.notes.map(note => {
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

export default AllNotes
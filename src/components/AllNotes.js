import { Component } from 'react'
import {Link } from 'react-router-dom'

class AllNotes extends Component {
    constructor(props) {
        super(props)
        this.props.onNoteLoad(null)
      }
    
    render () {
        const { notes } = this.props
        return (
            <div>
                { notes.map(note => {
                    return(
                    <Link key={note._id} to={"/note/" + note._id} >
                        <div >
                        <p>{note.title}</p> 
                        <p>{new Date(note.date).toLocaleDateString(undefined, {
                                day:    'numeric',
                                month:  'numeric',
                                year:   'numeric',
                                hour:   '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                        <p>{note.body}</p>
                        </div>
                    </Link>
                    )
                })
                }
            </div>
        )
    }
}

export default AllNotes
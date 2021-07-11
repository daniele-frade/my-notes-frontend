import { Component } from "react"
import { Link, withRouter } from 'react-router-dom'

class Breadcrumbs extends Component {

    getPageTitleFromPathname(currentLocation) {
        switch (currentLocation.pathname) {
            case "/":
                return null
                break
            case "/new-note":
                return "Add New Note"    
            default:
                return null
                break
        }
    }

    render() {
        const title = this.getPageTitleFromPathname(this.props.location)
        if (title) {
            return (
                <div className="breadcrumbs">
                    <Link to="/">All Notes</Link>
                    <span className="separator">&raquo;</span>
                    <span className="currentPage">{ title }</span>
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
        
    }
}

export default withRouter(Breadcrumbs)
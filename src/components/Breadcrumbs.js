import { Component } from "react"
import { Link, withRouter } from 'react-router-dom'

class Breadcrumbs extends Component {

    constructor(props) {
        super(props)
    }

    // getPageTitleFromPathname(currentLocation) {
    //     switch (currentLocation.pathname) {
    //         case "/":
    //             return null
    //             break
    //         case "/new-note":
    //             return "Add New Note"    
    //         default:
    //             return null
    //             break
    //     }
    // }

    render() {
        console.log(this.props.subpageTitle)
        if (this.props.subpageTitle) {
            return (
                <div className="breadcrumbs">
                    <Link to="/">All Notes</Link>
                    <span className="separator">&raquo;</span>
                    <span className="currentPage">{ this.props.subpageTitle }</span>
                </div>
            )
        } else {
            return (
                <div className="breadcrumbs">
                    <span>All Notes</span>
                </div>
            )
        }
        
    }
}

export default withRouter(Breadcrumbs)
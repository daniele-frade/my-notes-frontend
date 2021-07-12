import { Component } from "react"
import { Link } from 'react-router-dom'
import { useOktaAuth } from '@okta/okta-react';

const Breadcrumbs = (props) => {

    const { oktaAuth, authState } = useOktaAuth()
    
    // Don't show sidebar if not authenticated
    if (!authState || !authState.isAuthenticated) {
        return ''
    }
    
    if (props.subpageTitle) {
        return (
            <div className="breadcrumbs">
                <Link to="/">All Notes</Link>
                <span className="separator">&raquo;</span>
                <span className="currentPage">{ props.subpageTitle }</span>
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

export default Breadcrumbs
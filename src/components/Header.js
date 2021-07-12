import { Component } from "react"
import { useOktaAuth } from '@okta/okta-react';
import { IoMdLogOut } from 'react-icons/io'

const Header = () => {

    const { oktaAuth, authState } = useOktaAuth()
    
    // Don't show sidebar if not authenticated
    if (!authState || !authState.isAuthenticated) {
        return null
    }

    const logout = async () => oktaAuth.signOut()

    return (
        <header>
            <input type="text" placeholder="Search" />
            <div className="userActions">
                <span className="action" onClick={logout}>
                    <span>Logout</span> <IoMdLogOut />
                </span>
            </div>
        </header>
    )
}

export default Header
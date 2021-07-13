import { useEffect } from "react"
import { useOktaAuth } from '@okta/okta-react';
import { IoMdLogOut } from 'react-icons/io'

const Header = (props) => {

    const { oktaAuth, authState } = useOktaAuth()
    const baseURL = 'http://localhost:3003'
    
    const updateUserInDB = () => {
        if (authState && authState.isAuthenticated) {
            oktaAuth.getUser().then(info => {
                let oktaUser = {
                    first: info.given_name,
                    last: info.family_name,
                    oktaUID: info.sub
                }
                props.setLoggedInUser(oktaUser)
                fetch(baseURL + '/users', {
                    method: 'POST',
                    body: JSON.stringify(oktaUser),
                    headers: {
                        'Content-Type': 'application/json',
                        accept: 'application/json',
                        authorization: `Bearer ${oktaAuth.getAccessToken()}`,
                    }
                })
                .then(res => res.json())
                .then(userJson => {
                    oktaUser['_id'] = userJson._id
                    oktaUser['tags'] = userJson.tags
                    props.setLoggedInUser(oktaUser)
                    console.log("updated okta user")
                    console.log(oktaUser)
                })
                .catch(error => console.log({ 'Error': error }))
            })
        }
    }

    useEffect(() => {
        updateUserInDB()
    }, [authState])
    
    // Don't show sidebar if not authenticated
    if (!authState || !authState.isAuthenticated) {
        return null
    }

    const logout = async () => oktaAuth.signOut()

    return (
        <header>
            <input type="text" placeholder="Search" />
            <div className="userActions">
                <span className="user">{props.loggedInUser ? props.loggedInUser.first : ''}</span>
                <span className="action" onClick={logout}>
                    <span>Logout</span> <IoMdLogOut />
                </span>
            </div>
        </header>
    )
}

export default Header
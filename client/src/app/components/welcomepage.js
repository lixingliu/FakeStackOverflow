import React from 'react'
import { Link } from 'react-router-dom'

export default class WelcomePage extends React.Component {
    render() {
        return (
            <div className='centerDiv'>
                <button onClick={this.guestButton}>
                    <Link to='/guest/homePage:questions:AllQuestions:page:0'>Guest Login</Link>
                </button>
                <button onClick={this.userButton}>
                    <Link to='/user$user/loginPage'>Login</Link>
                </button>
                <button onClick={this.newUserButton}>
                    <Link to='/newUser'>New User</Link>
                </button>
            </div>
        )
    }
}
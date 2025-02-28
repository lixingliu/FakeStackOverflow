import axios from 'axios';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
function withParams(Component) {
    return props => <Component {...props} params={useNavigate()}/>
}
class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state ={ 
            username: '',
            email: '',
            password: '',
            password_copy: '',
            warning: ''
        }
        this.createUser=this.createUser.bind(this)
        this.handleChange=this.handleChange.bind(this)
    }
    createUser(event) {
        event.preventDefault()
        this.setState({warning: ''})
        if (
            this.state.username.length === 0 ||
            this.state.email.length === 0 ||
            this.state.password.length === 0 ||
            this.state.password_copy !== this.state.password ||
            this.state.password.includes(this.state.email.substring(0, this.state.email.indexOf('@'))) ||
            this.state.password.includes(this.state.username)
               ) {
            this.setState({warning: 'You did not meet the requierments'})
            return (
                <CreateUser />
            )
        }
        else {
            var mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
            if (this.state.email.match(mailformat)) {
                axios.get(`http://localhost:8000/getUser/${this.state.email}`)
                    .then(res => {
                        if (res.data !== '') {
                            this.setState({warning: 'This email already exist'})
                            return (
                                <CreateUser />
                            )
                        }
                        else {
                            const newUser = {
                                username: this.state.username,
                                email: this.state.email,
                                password: this.state.password
                            }
                            axios.post('http://localhost:8000/createUser', newUser)
                                .then(res => {
                                    this.props.params(`/user$user/loginPage`)
                                })                                
                        }
                    })
                    .catch(function (error) {
                        window.alert('An ERROR has been deteched on the server, please restart the server\nPlease Press the Return Button')
                    })
            }
            else {
                this.setState({warning: 'Invalid Email Address'})
            }
    }
    }
    handleChange(event){
        this.setState({
            [event.target.name] : event.target.value
        })
    }
    render() {
        return (
            <div>
                <form onSubmit={this.createUser}>
                    <div className='centerDiv'>
                        <div className='formFormat'>
                            <p>{this.state.warning}</p>
                            <h1>Enter Username</h1>
                            <textarea className='createUserTextBox' name='username' onChange={this.handleChange}></textarea>

                            <h1>Enter Email</h1>
                            <textarea className='createUserTextBox' name='email' onChange={this.handleChange}></textarea>

                            <h1>Enter Password</h1>
                            <textarea className='createUserTextBox' name='password' onChange={this.handleChange}></textarea>

                            <h1>Verify Password</h1>
                            <textarea className='createUserTextBox' name='password_copy' onChange={this.handleChange}></textarea>

                            <div style={{textAlign:'center'}}>
                                <button>
                                    Create User
                                </button>
                                <button onClick={this.return}>
                                    <Link to='/'>Return</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
export default withParams(CreateUser)
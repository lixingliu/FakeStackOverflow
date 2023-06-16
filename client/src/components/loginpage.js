import axios from 'axios';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
function withParams(Component) {
    return props => <Component {...props} params={useNavigate()}/>
}
class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            warning: ''
        }
        this.checkUser=this.checkUser.bind(this)
        this.handleChange=this.handleChange.bind(this)
    }
    checkUser(event) {
        event.preventDefault()
        this.setState({warning: ''})
        const user = `${this.state.email}~${this.state.password}`
        axios.get(`http://localhost:8000/checkUser/${user}`)
            .then(res => {
                if (typeof res.data === 'string') {
                    this.setState({warning:res.data})
                }
                else {
                    this.props.params(`/user$${res.data.username}$${res.data._id}/homePage:questions:AllQuestions:page:0`)
                }
            })
            .catch(function (error) {
                window.alert('An ERROR has been deteched on the server, please restart the server\nPlease Press the Return Button')
            })
    }
    handleChange(event){
        this.setState({
            [event.target.name] : event.target.value
        })
    }
    render() {
        return (
            <form onSubmit={this.checkUser}>
                <div className='centerDiv'>
                    <div className='formFormat'>
                        <p>{this.state.warning}</p>
                        <h1 style={{color:'red'}}>login page</h1>
                        <h1>Email</h1>
                        <textarea name='email' onChange={this.handleChange}></textarea>
                        <h1>Password</h1>
                        <textarea name='password' onChange={this.handleChange}></textarea>
                        <div style={{textAlign:'center'}}>
                            <button>Login</button>
                            <button><Link to='/'>Return</Link></button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}
export default withParams(LoginPage)
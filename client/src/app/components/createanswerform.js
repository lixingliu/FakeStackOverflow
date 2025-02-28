import React from 'react'
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom'
function withParams(Component) {
    return props => <Component {...props} params={useNavigate()} x={useLocation()}/>
}
class CreateAnswerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            x: null,
            answerText: '',
            Username: this.props.location.substring(5, this.props.dollar),
            warning1: '',
            warning2: '',
            userID: this.props.location.substring(this.props.dollar + 1, ),
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit(event) {
        event.preventDefault()
        this.setState ({
            warning1: '',
            warning2: '',
        })
        if (this.state.answerText.length === 0) {
            if (this.state.answerText.length === 0) {
                this.setState ({
                    warning1: 'Answer cannot be empty!'
                })
            }
            return (
                <CreateAnswerForm
                    admin={this.props.admin}
                    results={this.props.results}
                />
            )
        }
        const newAnswer = {
            ans_by: this.state.Username,
            text: this.state.answerText,
            userID: this.state.userID
        }
        const data = []
        axios.post('http://localhost:8000/newAnswer', newAnswer)
            .then(res => {
                const x = ({
                    ID: res.data,
                    question: this.props.results[0]._id,
                })
                axios.post('http://localhost:8000/updateQuestion', x)
                    .then(res => {
                        data.push(res.data)
                        console.log(this.props)
                        this.props.admin(data,this.props.results[0].title)
                        this.props.params(`/${this.props.location}/homePage:${this.props.results[0].title}:answers:${this.props.results[0]._id}:page:0commentp0a0`)
                    })
            })
    }
    handleChange(event){
        this.setState({
            [event.target.name] : event.target.value
        })
    }
    render() {
        if (!this.props.handle.includes('Aform')) {
            return null
        }
        return (
            <div id='new_answer_page'>
                <form onSubmit={this.handleSubmit}>
                    <p id="warning">{this.state.warning1}</p>
                    <p id="warning">{this.state.warning2}</p>
                    <h1>Answer Text</h1>
                    <textarea id="answer_input" className='input' name='answerText' onChange={this.handleChange}></textarea>
                    <div>
                        <button id='post_answer_button' className='post_answer_button'>Post Answer</button>
                    </div>
                </form>
            </div>
        )
    }
}
export default withParams(CreateAnswerForm)
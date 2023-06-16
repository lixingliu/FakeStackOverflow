import axios from 'axios'
import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
function withParams(Component) {
    return props => <Component {...props} params={useNavigate()} x={useLocation()}/>
}
class CreatingQuestionForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            questionTitle: '',
            questionText: '',
            tags: '',
            questionSummary: '',
            username: this.props.location.substring(5, this.props.dollar),
            userID: this.props.location.substring(this.props.dollar + 1, ),
            warning1: '',
            warning3: '',
            warning4: '',
            warning5: '',
        }
        this.link=this.link.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    link() {
        this.props.params('/')
    }
    handleSubmit(event) {
        event.preventDefault()
        this.setState({
            warning1: '',
            warning3: '',
            warning4: '',
            warning5: '',
        })
        if (this.state.questionTitle.length === 0 || this.state.questionTitle.length > 50 || this.state.questionText.length === 0 || this.state.tags.length === 0) {
            if (this.state.questionTitle.length === 0) {
                this.setState({
                    warning1: 'Title cannot be empty!'
                })
            }
            if (this.state.questionTitle.length > 50) {
                this.setState({
                    warning1: 'Title cannot be more than 50 characters!'
                })
            }
            if (this.state.questionText.length === 0) {
                this.setState({
                    warning3: 'Text cannot be empty!'
                })
            }
            if (this.state.tags.length === 0) {
                this.setState({
                    warning5: 'Tags cannot be empty!'
                })
            }
            return (
                <CreatingQuestionForm
                    admin={this.props.admin}
                    results={this.props.results}
                />
            )
        }
        const a = this.state.tags.split(' ')
        const b = []
        for (let i = 0; i < a.length; i++) {
            if (a[i] === '') {
                continue
            }
            else {
                b.push(a[i])
            }
        }
        const arrayOfTags = [...new Set(b)]
        const x = []
        for (let i = 0; i < arrayOfTags.length; i++) {
            const y = {
                name: arrayOfTags[i]
            }
            x.push(y)
        }
        const list = {
            list: x,
            userID: this.state.userID
        }
        const p = []
        axios.post('http://localhost:8000/newTag', list)
            .then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    p.push(res.data[i]._id)
                }
                const newQuestion = {
                    title: this.state.questionTitle,
                    text: this.state.questionText,
                    summary: this.state.questionSummary,
                    tags: p,
                    asked_by: this.state.username,
                    userID: this.state.userID
                }
                axios.post('http://localhost:8000/newQuestion', newQuestion)
                    .then(res => {
                        this.props.admin(res.data, "All Questions")
                        this.props.params(`/${this.props.location}/homePage:questions:AllQuestions:page:0`)
                    })
            })

    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    render() {
        if (!this.props.handle.includes('Qform')) {
            return null
        }
        return (
            <form onSubmit={this.handleSubmit}>
                <div className='new_question_page'>
        
                    <p id='warning'>{this.state.warning1}</p>
                    <p id='warning'>{this.state.warning3}</p>
                    <p id='warning'>{this.state.warning4}</p>
                    <p id='warning'>{this.state.warning5}</p>

                    <h1>Question Title</h1>
                    <p id='notes'>This should not be more than 50 characters</p>
                    <textarea id='title_input' className='input' name='questionTitle' onChange={this.handleChange}></textarea>

                    <h1>Question Summary</h1>
                    <p id='notes'>This should not be more than 140 characters</p>
                    <textarea id='summary_input' className='input' name='questionSummary' onChange={this.handleChange}></textarea> 
                    
                    <h1>Question Text</h1>
                    <p id='notes'>Add Details</p>
                    <textarea id='detail_input' className='input' name='questionText' onChange={this.handleChange}></textarea>

                    <h1>Tags</h1>
                    <p id='notes'>Add keywords seperated by whitespace</p>
                    <textarea id='tag_input' className='input' name='tags' onChange={this.handleChange}></textarea>

                    <div>
                        <button id='post_question_button'>Post Question</button>
                        <button id='post_question_button' onClick={this.link}>Return</button>
                    </div>
                </div>
            </form>
        )
    }
}
export default withParams(CreatingQuestionForm)
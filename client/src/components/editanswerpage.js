import React from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
function withParams(Component) {
    return props => <Component {...props} params={useNavigate()}/>
}

class EditAnswerPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            answer: this.props.results,
            text: this.props.results.text
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
        this.delete=this.delete.bind(this)
    }
    async delete(event) {
        event.preventDefault()
        await axios.delete(`http://localhost:8000/deleteAnswer/${this.state.answer._id}`)
        this.props.params(`/${this.props.location}/homePage:userPage`)
        window.location.reload()
    }
    async componentDidMount() {
        const index = this.props.handle.lastIndexOf(':')
        const id = this.props.handle.substring(index + 1, )
        const x = await axios.get(`http://localhost:8000/main/answer/${id}`)
        this.setState({
            answer: x.data[0],
            text: x.data[0].text
        })
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    async handleSubmit(event) {
        event.preventDefault()
        const answer = {
            original: this.state.answer._id,
            text: this.state.text
        }
        axios.post(`http://localhost:8000/updateAnswer`, answer)
            .then(res => {
            })
        const dollar = this.props.location.lastIndexOf('$')
        const x = await axios.get(`http://localhost:8000/answersRelatedToName/${this.props.location.substring(5, dollar)}`)
        this.props.admin(x.data.reverse(), this.props.title)
        this.props.params(`/${this.props.location}/homePage:userPage`)
        window.location.reload()
    }
    render() {
        return(
            <div>
                <form style={{paddingLeft:'100px'}}>
                    <button style={{fontSize: '30px'}} onClick={this.delete}>Delete Entire Question</button>
                    
                    <h1>Text</h1>
                    <textarea name='text' className='editText' value={this.state.text} onChange={this.handleChange}></textarea>
                    <br/>
                    <button onClick={this.handleSubmit}>Save</button>
                </form>
            </div>
        )
    }
}
export default withParams(EditAnswerPage)
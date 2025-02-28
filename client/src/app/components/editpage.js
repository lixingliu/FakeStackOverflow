import axios from 'axios'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
function withParams(Component) {
    return props => <Component {...props} params={useNavigate()}/>
}
class EditPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            question: this.props.results,
            title: this.props.results.title,
            text: this.props.results.text,
            summary: this.props.results.summary,
            tags: this.props.results.tags,

        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
        this.delete=this.delete.bind(this)
    }
    async delete(event) {
        event.preventDefault()
        await axios.delete(`http://localhost:8000/deleteQuestion/${this.state.question._id}`)
        const dollar = this.props.location.lastIndexOf('$')
        const x = await axios.get(`http://localhost:8000/questionsRelatedToName/${this.props.location.substring(5, dollar)}`)
        this.props.admin(x.data.reverse(), this.props.title)
        this.props.params(`/${this.props.location}/homePage:userPage`)
        window.location.reload()
    }
    async componentDidMount() {
        const index = this.props.handle.lastIndexOf(':')
        const id = this.props.handle.substring(index + 1, )
        const x = await axios.get(`http://localhost:8000/main/question${id}`)
        const y = x.data[0].tags
        const list = await axios.get(`http://localhost:8000/getTagName/${y}`)
        this.setState({ 
            question:x.data[0],
            title: x.data[0].title,
            text: x.data[0].text,
            summary: x.data[0].summary,
            tags: list.data.toString().replace(/,/g, ' ')
        })
    }
    async handleSubmit(event) {
        const dollar = this.props.location.lastIndexOf('$')
        event.preventDefault()
        const question = {
            original: this.state.question._id,
            title: this.state.title,
            text: this.state.text,
            summary: this.state.summary,
            tags: this.state.tags,
            userID: this.props.location.substring(dollar + 1, )
        }
        axios.post(`http://localhost:8000/update`, question)
            .then(res => {
            })
        const x = await axios.get(`http://localhost:8000/questionsRelatedToName/${this.props.location.substring(5, dollar)}`)
        this.props.admin(x.data.reverse(), this.props.title)
        this.props.params(`/${this.props.location}/homePage:userPage`)
        window.location.reload()
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        if (this.state.tags === undefined) {
            return null
        }
        return (
            <div>
                <form style={{paddingLeft:'100px'}}>
                    <button style={{fontSize: '30px'}} onClick={this.delete}>Delete Entire Question</button>

                    <h1>Title</h1>
                    <textarea name='title' className='editText' value={this.state.title} onChange={this.handleChange}></textarea>
                    <br/>
                    <button onClick={this.handleSubmit}>Save</button>

                    <h1>Text</h1>
                    <textarea name='text' className='editText' value ={this.state.text} onChange={this.handleChange}></textarea>
                    <br/>
                    <button onClick={this.handleSubmit}>Save</button>

                    <h1>Summary</h1>
                    <textarea name='summary' className='editText' value={this.state.summary} onChange={this.handleChange}></textarea>
                    <br/>
                    <button onClick={this.handleSubmit}>Save</button>

                    <h1>Tags</h1>
                    <textarea name='tags' className='editText' value={String(this.state.tags).replace(/,/g, ' ')} onChange={this.handleChange}></textarea>
                    <br/>
                    <button onClick={this.handleSubmit}>Save</button>
                </form>
            </div>
        )
    }
}
export default withParams(EditPage)
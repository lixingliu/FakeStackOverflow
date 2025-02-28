import axios from 'axios'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
function withParams(Component) {
    return props => <Component {...props} params={useNavigate()}/>
}
class EditTagPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tag: this.props.results,
            name: this.props.results.name
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
        this.delete=this.delete.bind(this)
    }
    async delete(event) {
        event.preventDefault()
        await axios.delete(`http://localhost:8000/deleteTag/${this.state.tag._id}`)
        this.props.params(`/${this.props.location}/homePage:userPage`)
        window.location.reload()
        return
    }
    async componentDidMount() {
        const index = this.props.handle.lastIndexOf(':')
        const id = this.props.handle.substring(index + 1, )
        const x = await axios.get(`http://localhost:8000/main/tag/${id}`)
        this.setState({
            tag: x.data[0],
            name: x.data[0].name
        })
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    async handleSubmit(event) {
        event.preventDefault()
        const dollar = this.props.location.lastIndexOf('$')
        const newTag = {
            original: this.state.tag._id,
            name: this.state.name.replace(/ /g, ''),
            userID: this.props.location.substring(dollar + 1, )
        }
        axios.post('http://localhost:8000/updateTag', newTag)
        const x = await axios.get(`http://localhost:8000/tagsRelatedToName/${this.props.location.substring(5, dollar)}`)
        this.props.admin(x.data.reverse(), this.props.title)
        this.props.params(`/${this.props.location}/homePage:userPage`)
        window.location.reload()
    }
    render() {
        return (
            <div>
                <form style={{paddingLeft:'100px'}}>
                    <button style={{fontSize: '30px'}} onClick={this.delete}>Delete Entire Question</button>
                    <h1>Tags</h1>
                    <textarea name='name' className='editText' value={this.state.name} onChange={this.handleChange}></textarea>
                    <br/>
                    <button onClick={this.handleSubmit}>Save</button>
                </form>
            </div>
        )
    }
}
export default withParams(EditTagPage)
import axios from 'axios';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
function withParams(Component) {
    return props => <Component {...props} params={useNavigate()}/>
}
class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.questions=this.questions.bind(this)
        this.answers=this.answers.bind(this)
        this.tags=this.tags.bind(this)
    }
    async componentDidMount() {
        const dollar = this.props.location.lastIndexOf('$')
        const x = await axios.get(`http://localhost:8000/questionsRelatedToName/${this.props.location.substring(dollar + 1, )}`)
        this.props.admin(x.data.reverse(), 'Q')
    }
    async questions() {
        const dollar = this.props.location.lastIndexOf('$')
        const x = await axios.get(`http://localhost:8000/questionsRelatedToName/${this.props.location.substring(dollar + 1, )}`)
        this.props.admin(x.data.reverse(), 'Q')
        this.props.params(`/${this.props.location}/homePage:userPage`)
    }
    async answers() {
        const dollar = this.props.location.lastIndexOf('$')
        const x = await axios.get(`http://localhost:8000/answersRelatedToName/${this.props.location.substring(dollar + 1, )}`)
        this.props.admin(x.data, 'A')
        this.props.params(`/${this.props.location}/homePage:userPage`)
    }
    async tags() {
        const dollar = this.props.location.lastIndexOf('$')
        const x = await axios.get(`http://localhost:8000/tagsRelatedToName/${this.props.location.substring(dollar + 1, )}`)
        this.props.admin(x.data, 'T')
        this.props.params(`/${this.props.location}/homePage:userPage`)

    }
    render() {
        return (
            <div className='column'>
                <table className='sideBar'>
                    <tbody>
                        <tr><td onClick={this.questions} className='sideQuestionButton'>Questions</td></tr>
                        <tr><td onClick={this.answers} className='sideAnswerButton'>Answers</td></tr>
                        <tr><td onClick={this.tags} className='sideTagButton'>Tags</td></tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
export default withParams(Sidebar)
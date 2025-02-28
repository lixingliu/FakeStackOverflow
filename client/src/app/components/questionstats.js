import React from 'react'
import axios from 'axios'
import Tags from './tags'
import { useNavigate } from 'react-router-dom'
function withParams(Component) {
    return props => <Component {...props} params={useNavigate()} />
}
function UserInfoStatistics(props) {
    const today = new Date(props.ask_date_time)
    const month = today.toLocaleDateString('default', { month: 'short' })
    const date = today.getDate()
    const year = today.getFullYear()
    const asked_on = `${month} ${date}, ${year}`
    const asked_at = `${today.getHours()}:${String(today.getMinutes()).padStart(2, '0')}`
    return (
        <div>
            <div>Asked By <span style={{ color: 'blue' }}>{props.asked_by}</span></div>
            <div>On <span style={{ color: 'green' }}>{asked_on}</span></div>
            <div>At <span style={{ color: '#03a5fc' }}>{asked_at}</span></div>
        </div>
    )
}
class QuestionStats extends React.Component {
    constructor(props) {
        super(props)
        this.state = { AllTags: this.props.AllTags }
        this.x = this.x.bind(this)
    }
    async x() {
        // this.props.params(`/${this.props.location}/homePage:${this.props.question.title}:answers:${this.props.question._id}:page:0commentp0a0`)
        // const x = await axios.get(`http://localhost:8000/main/question/answer/${this.props.question._id}`)
        // const title = { _id: this.props.question._id }
        // await axios.post('http://localhost:8000/main/question/updateViews', title)
        // this.props.admin(x.data, this.props.question.title)
        // console.log('hi')
        // console.log(this.props)
        // this.props.admin(this.props.question, 'QE')
    }
    async componentDidMount() {
        const x = await axios.get('http://localhost:8000/main/tag')
        this.setState({ AllTags: x.data })
    }
    render() {
        let list = []
        let max = 4;
        let start = 0
        for (let i = 0; i < Math.ceil((this.props.question.tags.length) / 4); i++) {
            let innerList = []
            for (let j = 0; j < this.state.AllTags.length; j++) {
                for (let k = start; k < max; k++) {
                    if (this.props.question.tags[k] === this.state.AllTags[j]._id) {
                        innerList.push(this.state.AllTags[j])
                    }
                }
            }
            start = max
            max += 4
            list.push(innerList)
        }
        let tag_names = []
        max = 4;
        start = 0;
        for (let i = 0; i < list.length; i++) {
            tag_names.push(<Tags key={i} x={this.state.AllTags} y={this.props.question.tags} max={max} start={start} />)
            start = max
            max += 4
        }
        return (
            <tr className='question_details'>
                <td className='statisticsStyle'>
                    <div>{this.props.question.views} Views</div>
                    <div>{this.props.question.answers.length} Answers</div>
                </td>
                <td className='information'>
                    <div className='titleStyle' onClick={this.x}>{this.props.question.title}</div>
                    <div>{tag_names}</div>
                    <div className='summary'><p>Summary: {this.props.question.summary}</p></div>
                </td>
                <td className='time'>{UserInfoStatistics(this.props.question)}</td>
            </tr>
        )
    }
}
export default withParams(QuestionStats)
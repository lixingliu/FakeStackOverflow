import axios from 'axios'
import React from 'react'
import Comments from './comments'
import { Link, useNavigate } from 'react-router-dom'
function withParams(Component) {
    return props => <Component {...props} params={useNavigate()}/>
}
function UserInfoStatistics(props) {
    const today = new Date(props.ans_date_time)
    const ansOn = `${today.toLocaleDateString('default', { month: 'short' })} ${today.getDate()}, ${today.getFullYear()}`
    const ansAt = `${today.getHours()}:${String(today.getMinutes()).padStart(2, '0')}:${String(today.getSeconds()).padStart(2, '0')}`
    return (
        <td className='time'>
            <div>Ans By <span style={{ color: 'blue' }}>{props.ans_by}</span></div>
            <div>On <span style={{ color: 'green' }}>{ansOn}</span></div>
            <div>At <span style={{ color: '#03a5fc' }}>{ansAt}</span></div>
        </td>
    )
}
function EnterKeyWasPressed(props, input, index) {
    let comment = {
        answer: props.answer,
        input: input
    }
    axios.post('http://localhost:8000/main/answer/comment', comment)
        .then(res => {
            window.location.reload()
        })
}
async function like(answer, user) {
    const x = await axios.get(`http://localhost:8000/getCreator/${user}`)
    if (x.data.reputation >= 100) {
        await axios.post(`http://localhost:8000/increaseAnswerVote`, {answer: answer})
        window.location.reload()
    }
    else {
        return
    }
}
async function dislike(answer, user) {
    const x = await axios.get(`http://localhost:8000/getCreator/${user}`)
    if (x.data.reputation >= 100) {
        await axios.post(`http://localhost:8000/decreaseAnswerVote`, {answer: answer})
        window.location.reload()
    }
    else {
        return
    }

}
class AnswerRow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            x: '',
            num: 0,
        }
        this.prev=this.prev.bind(this)
        this.next=this.next.bind(this)
        this.x=this.x.bind(this)
    }
    async componentDidMount() {
        const x = await axios.get(`http://localhost:8000/main/question/answer/responses/${this.props.answer}`)
        this.setState({ x: x.data[0] })
    }
    x(admin, params) {
        if (this.props.title === 'A') {
            admin(this.state.x, 'A')
            return (
                params(`/${this.props.location}/homePage:userPage:editPageA:${this.props.answer}`)
            )
        }
        else {
            return
        }
    }
    prev(num) {
        if (num - 1 < 0) {return}
        else {this.setState({num:num - 1})}
    }
    next(num, max) {
        if (num + 1 >= max) {return null}
        else {this.setState({num:num + 1})}
    }
    render() {
        const dollar = this.props.location.lastIndexOf('$')
        if (this.state.x.length === 0) {
            return null
        }
        const comments = []
        for (let i = 0; i < this.state.x.comments.length; i++) {
            comments.push(<Comments key={i} comment={this.state.x.comments[i]} />)
        }
        const list = []
        for (let i = 0; i < comments.length; i+=3) {
            const chunk = comments.slice(i , i + 3)
            list.push(chunk)
        }
        return (
            <table>
                <tbody>
                    <tr className='question_details' style={{width:'100%'}}>
                        {this.props.title !== 'A' && <td className='votes'>
                            <div>
                                {this.state.x.votes} Votes
                            </div>
                            {this.props.location !== 'guest' && <div>
                                <button onClick={() => like(this.state.x, this.props.location.substring(dollar + 1, ))}>Like</button>
                                <button onClick={() => dislike(this.state.x, this.props.location.substring(dollar + 1, ))}>Dislike</button>
                            </div>}
                        </td>}
                        <td className='responseStyle' onClick={() => this.x(this.props.admin, this.props.params)}>
                            {this.state.x.text}
                        </td>
                        {UserInfoStatistics(this.state.x)}
                    </tr>
                    {this.props.title !== 'A' && <tr>
                        <td className='comments'>
                            comments:<br/>
                            {list[this.state.num]}
                        </td>
                    </tr>}
                    {this.props.title !== 'A' && <tr>
                        {this.props.location !== 'guest' && <td>
                            <button onClick={() => this.prev(this.state.num)}>Prev</button>
                            <button onClick={() => this.next(this.state.num, list.length)}>Next</button>
                        </td>}
                    </tr>}
                    {this.props.title !== 'A' && <tr>
                        {this.props.location !== 'guest' && <td className='answer_comment'>
                            <textarea className='answer_text' onKeyPress={(ev) => { if (ev.key === 'Enter') { EnterKeyWasPressed(this.props, ev.target.value)}} } />
                        </td>}
                        {this.props.location !== 'guest' && <td style={{borderBottom:'2px solid black'}}/>}
                        {this.props.location !== 'guest' && <td style={{borderBottom:'2px solid black'}}/>}
                    </tr>}
                </tbody>
            </table>
        )
    }
}
export default withParams(AnswerRow)
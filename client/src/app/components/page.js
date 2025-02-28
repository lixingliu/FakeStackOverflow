import axios from 'axios';
import React from 'react'
import QuestionRow from './questionrow'
import TagRow from './tagrow'
import AnswerRow from './answerrow'
import Comments from './comments'
import Tags from './tags'
import Sidebar from './sidebar';
import Stats from './stats';
import EditPage from './editpage';
import EditAnswerPage from './editanswerpage'
import EditTagPage from './edittagpage'
import { Link, useNavigate } from 'react-router-dom'
function withParams(Component) {
    return props => <Component {...props} params={useNavigate()}/>
}
function EnterKeyWasPressed(props, input, index, indexA) {
    let comment = {
        question: props.results[0],
        input: input
    }
    axios.post('http://localhost:8000/main/question/comment', comment)
        .then(res => {
            if (res.data.length !== 0 && parseInt(props.handle.substring(index + 1, indexA)) !== res.data.length/3) {
                if (res.data.length % 3 === 0) {
                    props.params(`/${props.location}/homePage${props.handle.substring(0, index)}${props.handle.substring(index, indexA - 1)}${Math.floor(res.data.length/3) - 1}${props.handle.substring(indexA, )}`)
                }
                else {
                    props.params(`/${props.location}/homePage${props.handle.substring(0, index)}${props.handle.substring(index, indexA - 1)}${Math.floor(res.data.length/3)}${props.handle.substring(indexA, )}`)
                }
            }
            else if (res.data.length % 3 === 1 && res.data.length !== 1) {
                props.params(`/${props.location}/homePage${props.handle.substring(0, index + 1)}${parseInt(props.handle.substring(index + 1, indexA)) + 1}${props.handle.substring(indexA, )}`)
            }
            else {
                props.params(`/${props.location}/homePage${props.handle}`)
            }
            window.location.reload()
        })
}
function UserInfoStatistics(props) {
    const today = new Date(props.ask_date_time)
    const asked_on = `${today.toLocaleDateString('default', { month: 'short' })} ${today.getDate()}, ${today.getFullYear()}`
    const asked_at = `${today.getHours()}:${String(today.getMinutes()).padStart(2, '0')}:${String(today.getSeconds()).padStart(2, '0')}`
    return (
        <div>
            <div>Asked By <span style={{ color: 'blue' }}>{props.asked_by}</span></div>
            <div>On <span style={{ color: 'green' }}>{asked_on}</span></div>
            <div>At <span style={{ color: '#03a5fc' }}>{asked_at}</span></div>
        </div>
    )
}
async function like(question, user) {
    const x = await axios.get(`http://localhost:8000/getCreator/${user}`)
    if (x.data.reputation >= 100) {
        await axios.post(`http://localhost:8000/increaseQuestionVote`, {question: question})
        window.location.reload()
    }
    else {
        return
    }
}
async function dislike(question, user) {
    const x = await axios.get(`http://localhost:8000/getCreator/${user}`)
    if (x.data.reputation >= 100) {
        await axios.post(`http://localhost:8000/decreaseQuestionVote`, {question: question})
        window.location.reload()
    }
    else {
        return
    }
}
function question_details(props, AllTags) {
    let w = []
    for (let i = 0; i < props.results[0].tags.length; i++) {
        for (let j = 0; j < AllTags.length; j++) {
            if (props.results[0].tags[i] === AllTags[j]._id) {
                w.push(AllTags[j])
            }
        }
    }
    let p = []
    for (let i = 0; i < w.length; i++) {
        p.push(<Tags key={i} x={AllTags} y={props.results[0].tags} max={w.length} start={0} /> )
    }
    const comments = []
    for (let i = 0; i < props.results[0].comments.length; i++) {
        comments.push(<Comments key={i} comment={props.results[0].comments[i]} />)
    }
    const list = []
    for (let i = 0; i < comments.length; i += 3) {
        const chunk = comments.slice(i, i + 3)
        list.push(chunk)
    }
    const index = props.handle.lastIndexOf('p')
    const indexA = props.handle.lastIndexOf('a')
    const dollar = props.location.lastIndexOf('$')
    return (
        <table>
            <tbody>
                <tr className='question_details'>
                    <td className='statisticsStyle'>
                        <div>{props.results[0].views} Views</div>
                        <div>{props.results[0].votes} Votes</div>
                        {props.location !== 'guest' && <button onClick={() => like(props.results[0], props.location.substring(dollar + 1, ))}>Like</button>}
                        {props.location !== 'guest' && <button onClick={() => dislike(props.results[0], props.location.substring(dollar + 1, ))}>Dislike</button>}
                    </td>
                    <td className='information'>
                        <div>
                            Text:<br/>
                            <span style={{ fontSize: '22px' }}>
                                {props.results[0].text}
                            </span>
                        </div>
                        <div>
                            Tags: {p[w.length-1]}
                        </div>
                        <div>
                            Comments:<br/>
                            {list[props.handle.substring(index + 1, indexA)]}
                        </div>
                        <button onClick={() => prev(props.handle, props.params, props.location, index,0 ,indexA)}>Prev</button>
                        <button onClick={() => next(props.handle, props.params, list.length, props.location, index,0 ,indexA)}>Next</button>
                        {(props.location !== 'guest') && <textarea className='comment_text' onKeyPress={(ev) => { if (ev.key === 'Enter') { EnterKeyWasPressed(props, ev.target.value, index, indexA)}} }/>}
                    </td>
                    <td className='time'>{UserInfoStatistics(props.results[0])}</td>
                </tr>
            </tbody>
        </table>
    )
}
function next(handle, params, max, location, colon, index, indexA) {
    if (parseInt(handle.substring(colon + 1, indexA)) + 1 < max) {
        params(`/${location}/homePage${handle.substring(0, colon + 1)}${parseInt(handle.substring(colon + 1, indexA)) + 1}${handle.substring(indexA, )}`)
    }
    else {
        params(`/${location}/homePage${handle}`)
    }
}
function prev(handle, params, location, colon, index, indexA) {
    if (parseInt(handle.substring(colon + 1, indexA)) === 0) {
        params(`/${location}/homePage${handle}`)
    }
    else {
        params(`/${location}/homePage${handle.substring(0, colon + 1)}${parseInt(handle.substring(colon + 1, indexA)) - 1}${handle.substring(indexA, )}`)
    }
}
function nextAnswer(handle, params, max, location, colon, index, indexA) {
    if (parseInt(handle.substring(colon + 1, index)) + 1 < max) {
        params(`/${location}/homePage${handle.substring(0, colon + 1)}${parseInt(handle.substring(colon + 1, index)) + 1}${handle.substring(index, )}`)
    }
    else {
        params(`/${location}/homePage${handle}`)
    }
}
function prevAnswer(handle, params, location, colon, index, indexA) {
    if (parseInt(handle.substring(colon + 1, index)) === 0) {
        params(`/${location}/homePage${handle}`)
    }
    else {
        params(`/${location}/homePage${handle.substring(0, colon + 1)}${parseInt(handle.substring(colon + 1, index)) - 1}${handle.substring(index, )}`)
    }
}
class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            tags: [],
            answers: [],
            AllQuestions: [],
            AllTags: [],
            AllAnswers: [],
        }
        this.z=this.z.bind(this)
    }
    z() {
        this.props.params(`/${this.props.location}/answerForm:Aform`, {state:{id:this.props.results[0]._id}})
    }
    async componentDidMount() {
        try {
            const x = await axios.get('http://localhost:8000/main/question')
            const y = await axios.get('http://localhost:8000/main/tag')
            const z = await axios.get('http://localhost:8000/main/answer')
            this.setState({
                AllQuestions: x.data,
                AllTags: y.data,
                AllAnswers: z.data,
                status: false
            })
        }
        catch(e) {
            window.alert('CONNECT ERROR PLEASE RESTART THE SERVER')
        }
    }
    render() {
        if (this.props.handle.includes(':questions')) {
            this.state.questions = []
            if (this.props.results === null) {return null}
            else {
                for (let i = 0; i < this.props.results.length; i++) {
                    this.state.questions.push(
                        <QuestionRow
                            question={this.props.results[i]}
                            key={this.props.results[i]._id}
                            admin={this.props.admin}
                            AllTags={this.state.AllTags}
                            location={this.props.location}
                            title={this.props.title}
                        />
                    )
                }
            }
            const list = []
            for (let i = 0; i < this.state.questions.length; i += 5) {
                const chunk = this.state.questions.slice(i, i + 5)
                list.push(chunk)
            }
            if (list.length == 0) { 
                return null 
            }
            else {
                list.reverse()
                let colon = this.props.handle.lastIndexOf(':')
                return (
                    <div>
                        <table><tbody>{list[this.props.handle.substring(colon + 1, )].reverse()}</tbody></table>
                        <button onClick={() => prev(this.props.handle, this.props.params, this.props.location, colon, this.props.handle.length, this.props.handle.length)}>Prev</button>
                        <button onClick={() => next(this.props.handle, this.props.params, list.length, this.props.location, colon, this.props.handle.length, this.props.handle.length)}>Next</button>
                    </div>
                )
            }
        }
        if (this.props.handle.includes(':tags')) {
            this.state.tags = []
            this.props.results.forEach((tag) => {
                this.state.tags.push(
                    <TagRow
                        tag={tag}
                        key={tag._id}
                        AllQuestions={this.state.AllQuestions}
                        admin={this.props.admin}
                        location={this.props.location}
                    />)
            })
            return (
                <div className='box'>{this.state.tags}</div>
            )
        }
        if (this.props.handle.includes(':answers') || this.props.handle.includes(' ')) {
            this.state.answers = []
            if (this.props.results[0] === undefined) {return null}
            this.props.results[0].answers.forEach((answer) => {
                this.state.answers.push(
                    <AnswerRow
                        answer={answer}
                        key={answer}
                        AllAnswers={this.state.AllAnswers}
                        handle={this.props.handle}
                        location={this.props.location}
                    />
                )
            })
            this.state.answers.reverse()
            const list = []
            for (let i = 0; i < this.state.answers.length; i += 5) {
                const chunk = this.state.answers.slice(i, i + 5)
                list.push(chunk)
            }
            list.reverse()
            let colon = this.props.handle.lastIndexOf(':')
            let index = this.props.handle.lastIndexOf('c')
            let indexA = this.props.handle.lastIndexOf('a')
            return (
                <div>
                    {question_details(this.props, this.state.AllTags)}
                    {list.length !== 0 && list[this.props.handle.substring(colon +  1, index)].reverse()}
                    <button onClick={() => prevAnswer(this.props.handle, this.props.params, this.props.location, colon, index, indexA)}>Prev</button>
                    <button onClick={() => nextAnswer(this.props.handle, this.props.params, list.length, this.props.location, colon, index, indexA)}>Next</button>
                    {(this.props.location !== 'guest') && <table style={{ width: '100%' }}>
                        <tbody>
                            <tr>
                                <td className='post_answer_button'>
                                    <button id='post_answer_button' className='post_answer_button' onClick={this.z}>
                                        Answer Question
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    }
                </div>
            )
        }
        if (this.props.handle.includes(':userPage')) {
            if (this.props.handle.includes(':editPageQ')) {
                return (
                    <div className='row'>
                        <Sidebar admin={this.props.admin} location={this.props.location}/>
                        <EditPage 
                            results={this.props.results}
                            admin={this.props.admin}
                            location={this.props.location}
                            handle={this.props.handle}
                            title={this.props.title}
                        />
                    </div>
                )
            }
            if (this.props.handle.includes(':editPageA')) {
                return (
                    <div className='row'>
                        <Sidebar admin={this.props.admin} location={this.props.location} title={this.props.title}/>
                        <EditAnswerPage
                            results={this.props.results}
                            admin={this.props.admin}
                            location={this.props.location}
                            handle={this.props.handle}
                            title={this.props.title}
                        />
                    </div>
                )
            }
            if (this.props.handle.includes(':editPageT')) {
                return (
                    <div className='row'>
                        <Sidebar admin={this.props.admin} location={this.props.location} title={this.props.title}/>
                        <EditTagPage
                            results={this.props.results}
                            admin={this.props.admin}
                            location={this.props.location}
                            handle={this.props.handle}
                            title={this.props.title}
                        />
                    </div>
                )
            }
            else {
                return (
                    <div className='row'>
                        <Sidebar admin={this.props.admin} location={this.props.location} title={this.props.title}/>
                        <Stats 
                            results={this.props.results}
                            admin={this.props.admin}
                            AllTags={this.state.AllTags}
                            AllQuestions={this.state.AllQuestions}
                            location={this.props.location}
                            title={this.props.title}
                        />
                    </div>
                )
            }
        }
    }
}
export default withParams(Page)
import React from 'react'
import Questionrow from './questionrow'
import AnswerRow from './answerrow'
import Tagrow from './tagrow'
import axios from 'axios'

export default class Stats extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            creation: undefined
        }
    }
    async componentDidMount() {
        const dollar = this.props.location.lastIndexOf('$')
        const x = await axios.get(`http://localhost:8000/getCreationDate/${this.props.location.substring(dollar + 1, )}`)
        const today = new Date(x.data)
        this.setState({
            creation:today.toString()
        })
    }
    render() {
        if (this.props.results === null) {
            return null
        }
        let list = []
        if (this.props.title === 'Q') {
            if (this.props.results.length === 0) {
                return (<div><h1>NO QUESTIONS CREATED BY USER</h1></div>)
            }
            for (let i = 0; i < this.props.results.length; i++) {
                list.push(
                    <Questionrow
                        question={this.props.results[i]}
                        key={this.props.results[i]._id}
                        admin={this.props.admin}
                        AllTags={this.props.AllTags}
                        location={this.props.location}
                        title={this.props.title}
                    />
                )
            }
            return (
                <div style={{width: '100%'}}>
                    <h1 style={{textAlign:'center'}}>Member Since {this.state.creation}</h1>
                    <table><tbody>{list}</tbody></table>
                </div>
            )
        }
        if (this.props.title === 'A') {
            if (this.props.results.length === 0) {
                return (<div><h1>NO ANSWERS CREATED BY USER</h1></div>)
            }
            this.props.results.forEach((answer) => {
                 list.push(
                    <AnswerRow
                        answer={answer._id}
                        key={answer._id}
                        AllAnswers={this.props.AllAnswers}
                        handle={this.props.handle}
                        location={this.props.location}
                        title={this.props.title}
                        admin={this.props.admin}
                    />
                )
            })
            return (
                <div className='userAnswers'>
                    <h1 style={{textAlign:'center'}}>Member Since {this.state.creation}</h1>
                    {list}
                </div>
            )
        }
        if (this.props.title === 'T') {
            if (this.props.results.length === 0) {
                return (<div><h1>NO TAGS CREATED BY USER</h1></div>)
            }
            this.props.results.forEach((tag) => {
                list.push(
                    <Tagrow
                        tag={tag}
                        key={tag._id}
                        ALLQuestions={this.props.ALLQuestions}
                        admin={this.props.admin}
                        location={this.props.location}
                        title={this.props.title}
                    />
                )
            })
            return (
                <div style={{width:'100%'}}>
                    <h1 style={{textAlign:'center'}}>Member Since {this.state.creation}</h1>
                    <div className='box' style={{paddingLeft: '100px'}}>
                        {list}
                    </div>
                </div>
            )
        }
    }
}
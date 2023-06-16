import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
function withParams(Component) {
    return props => <Component {...props} params={useNavigate()}/>
}
function amountOfQuestionsWithThisTag(tag, question) {
    let list = []
    for (let i = 0; i < question.length; i++) {
        if (question[i].tags.includes(tag._id)) { list.push(question[i]) }
    }
    if (list.length <= 1) { return (`${list.length} Questions`) }
    else { return `${list.length} Questions` }
}
class TagRow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            allQuestions: this.props.AllQuestions,
            questionRelatedToTag: []
        }
        this.y = this.y.bind(this)
    }
    async componentDidMount() {
        try {
            const x = await axios.get('http://localhost:8000/main/question')
            this.setState({allQuestions:x.data})
        }
        catch(e) {
            window.alert('CONNECTION ERROR PLEASE RESTART THE ERROR')
        }
    }
    async y() {
        if (this.props.title === 'T') {
            this.props.admin(this.props.tag, 'T')
            return (
                this.props.params(`/${this.props.location}/homePage:userPage:editPageT:${this.props.tag._id}`)
            )
        }
        else {
            axios.get('http://localhost:8000/main/question')
                .then(res => {
                    for (let i = 0; i < res.data.length; i++) {
                        if ((res.data[i].tags).includes(this.props.tag._id)) {
                            this.state.questionRelatedToTag.push(res.data[i])
                        }
                    }
                    this.props.admin(this.state.questionRelatedToTag, `Questions Tagged [${this.props.tag.name}]`)
                    this.props.params(`/${this.props.location}/homePage:questions:tagname:${this.props.tag.name}:${this.props.tag._id}:page:0`)
                })
        }
    }
    render() {
        return (
            <div className='insideDiv'>
                <div className='inside'>
                    <div className='insideinside'>
                        <div className='insideinsideinside' onClick={this.y}>{this.props.tag.name}</div>
                        {this.props.title !== 'T' && <p style={{fontweight: 'solid'}}>{amountOfQuestionsWithThisTag(this.props.tag, this.state.allQuestions)}</p>}
                    </div>
                </div>
            </div>
        )
    }
}
export default withParams(TagRow)
import axios from 'axios';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
function withParams(Component) {
    return props => <Component {...props} params={useNavigate()}/>
}
async function EnterKeyWasPressed(props, input){
    const original_original_search = input.toLowerCase().split(' ')
    const original_serach = [...new Set(original_original_search)]
    const search = []
    for (let i = 0; i < original_serach.length; i++) {
        if (original_serach[i] === '') { continue }
        else { search.push(original_serach[i]) }
    }
    const searchTags = []
    const searchTitle = []
    const results = []
    const xy = []
    const xyz = []
    for (let i = 0; i < search.length; i++) {
        if (search[i].startsWith('[') && search[i].endsWith(']')){ searchTags.push(search[i].replace('[', '').replace(']', '')) }
        else { searchTitle.push(search[i]) }
    }
    for (let i = 0; i < searchTitle.length; i++) {
        const x = await axios.get(`http://localhost:8000/main/question/title/${searchTitle[i]}`)
        if (x.data.length === 0) { continue }
        else { results.push(x.data) }
    }
    for (let i = 0; i < searchTags.length; i++) {
        const x = await axios.get(`http://localhost:8000/main/question/tag/${searchTags[i]}`)
        if (x.data.length === 0) { continue }
        else { results.push(x.data) }
    }
    for (let i = 0; i < results.length; i++) {
        for (let j = 0; j < results[i].length; j++) { xy.push(results[i][j]) }
    }
    for (let i = 0; i < xy.length; i++) {
        if (xyz.includes(xy[i]._id)) { xy.splice(i,1) }
        else { xyz.push(xy[i]._id) }
    }
    xy.sort(function (a, b) {
        var dateA = new Date(a.ask_date_time)
        var dateB = new Date(b.ask_date_time)
        return dateA - dateB;
    });
    props.admin(xy, "Search Results")
    props.params(`/${props.location}/homePage:questions:searchResults:page:0`, { state: { search: xy } })
}
class Banner extends React.Component {
    constructor(props) {
        super(props);
        this.questionButton=this.questionButton.bind(this)
        this.tagButton=this.tagButton.bind(this)
        this.usernameClicked=this.usernameClicked.bind(this)
        this.createQuestion=this.createQuestion.bind(this)
    }
    async questionButton() {
        axios.get('http://localhost:8000/main/question')
            .then(res => {
                this.props.admin(res.data, 'All Questions')
                this.props.params(`/${this.props.location}/homePage:questions:AllQuestions:page:0`)
            })
    }
    async tagButton() {
        axios.get('http://localhost:8000/main/tag')
            .then(res => {
                this.props.params(`/${this.props.location}/homePage:tags:AllTags`)
                this.props.admin(res.data, 'All Tags')
            })
    }
    async usernameClicked() {
        if (this.props.location === 'guest') {
            return
        }
        this.props.params(`/${this.props.location}/homepage:userPage`)
    }
    async createQuestion() {
        this.props.params(`/${this.props.location}/questionForm:Qform`)
    }
    render() {
        const dollar = this.props.location.lastIndexOf('$')
        const username = this.props.location.substring(5, dollar)
        return(
            <div className='banner'>
                <ul className='nav'>
                    <li className='title'>Fake StackOverFlow</li>
                    <li className='liBox'>
                        <input 
                            className='search_bar' 
                            type='text' 
                            placeholder='Search...' 
                            onKeyPress={(ev) => { if (ev.key === 'Enter') { EnterKeyWasPressed(this.props, ev.target.value) } }}
                        />
                    </li>
                    <li className='liBox question_button' onClick={ this.questionButton }>Questions</li>
                    <li className='liBox tag_button' onClick={ this.tagButton }>Tags</li>


                    {(this.props.location !== 'guest') && <li id='add_question_button' onClick={this.createQuestion}>
                        {this.props.location !== 'guest' && <div className='ask_question'>Ask A Question</div>}
                    </li>}
                    {(this.props.location === 'guest') && <li style={{width:'2%'}}></li>}  


                    <li className='liBox username_link' onClick={this.usernameClicked}>
                        {(this.props.location !== 'guest') && <div>
                            {username}
                        </div>}
                    </li>
                    <li className='liBox logOut_button'><Link to='/'>Exit</Link></li>
                </ul>
            </div>
        )
    }
}
export default withParams(Banner)
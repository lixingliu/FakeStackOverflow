import axios from 'axios';
import React from 'react'
import { useParams, useLocation } from 'react-router-dom';
import Banner from './banner.js'
import CreateAnswerForm from './createanswerform.js';
import Creatingquestionform from './creatingquestionform.js';
import Main from './main.js'
function withParams(Component) {
    return props => <Component {...props} params={useParams()} x={useLocation()} />
}
class FakeStackOverflow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            title: null,
        }
        this.admin = this.admin.bind(this)
    }
    async componentDidMount() {
        if (this.props.x.pathname.includes('AllQuestions')) {
            const x = await axios.get('http://localhost:8000/main/question')
            this.setState({ 
                results: x.data,
                title: 'All Questions'
            })
        }
        if (this.props.x.pathname.includes('AllTags')) {
            const x = await axios.get('http://localhost:8000/main/tag')
            this.setState({ 
                results: x.data ,
                title: 'All Tags'
            })
        }
        if (this.props.x.pathname.includes('answers')) {
            const x = await axios.get(`http://localhost:8000/main/question/answer/${this.props.x.pathname.split(':')[3]}`)
            this.setState({ 
                results: x.data,
                title: this.props.x.pathname.split(':')[1].replace(/%20/g, ' ')
            })
        }
        if (this.props.x.pathname.includes('tagname')) {
            const list = []
            axios.get('http://localhost:8000/main/question')
                .then(res => {
                    for (let i = 0; i < res.data.length; i++) {
                        if ((res.data[i].tags).includes(this.props.x.pathname.split(':')[4])) {
                            list.push(res.data[i])
                        }
                    }
                    this.setState({
                        results: list,
                        title: `Questions Tagged ${this.props.x.pathname.split(':')[3]}`
                    })
                })
        }
        if (this.props.x.pathname.includes('searchResults')) {
            this.setState({
                results: this.props.x.state.search,
                title: 'Search Results'
            })
        }
        if (this.props.x.pathname.includes('Aform')) {
            console.log(this.props.x.state.id)
            const x = await axios.get(`http://localhost:8000/main/x/${this.props.x.state.id}`)
            this.setState({
                results: x.data
            })
        }
        // if (this.props.x.pathname.includes('editPageQ')) {
        //     this.setState({
        //         title: 'Q'
        //     })
        // } 
        // if (this.props.x.pathname.includes('editPageA')) {
        //     const colon = this.props.x.pathname.lastIndexOf(':')
        //     const id = this.props.x.pathname.substring(colon + 1, )
        //     const list = await axios.get(`http://localhost:8000/main/answer/${id}`)
        //     console.log(list.data[0])
        //     this.setState({
        //         title: 'A',
        //         results: list.data[0]
        //     })
        // }
    }
    admin(results, title) {
        this.setState({
            results: results,
            title: title,
        })
    }
    render() {
        let { handle } = this.props.params
        return (
            <div className='god'>
                <Banner
                    admin={this.admin}
                    location={this.props.x.pathname.substring(1).split('/').splice(0, 1).join('/')}
                    handle={handle}
                />
                <Main
                    handle={handle}
                    admin={this.admin}
                    results={this.state.results}
                    title={this.state.title}
                    location={this.props.x.pathname.substring(1).split('/').splice(0, 1).join('/')}
                />
                <Creatingquestionform
                    admin={this.admin}
                    handle={handle}
                    location={this.props.x.pathname.substring(1).split('/').splice(0, 1).join('/')}
                    dollar={this.props.x.pathname.substring(1).split('/').splice(0, 1).join('/').lastIndexOf('$')}
                />
                <CreateAnswerForm
                    admin={this.admin}
                    handle={handle}
                    results={this.state.results}
                    location={this.props.x.pathname.substring(1).split('/').splice(0, 1).join('/')}
                    dollar={this.props.x.pathname.substring(1).split('/').splice(0, 1).join('/').lastIndexOf('$')}
                />
            </div>
        )
    }
}
export default withParams(FakeStackOverflow)

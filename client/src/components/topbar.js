import React from 'react'
import { Link, useLocation } from 'react-router-dom'
function withParams(Component) {
    return props => <Component {...props} x={useLocation()} />
}
class TopBar extends React.Component {
    render() {
        if (this.props.x.pathname.includes('userPage')) { return null }
        let amount = this.props.results.length + ' Questions'
        let title = this.props.title
        if (this.props.x.pathname.includes('questions')) {
            if (this.props.results.length === 0) {
                amount = '0 Questions'
                title = 'No Results Found'
            }
            else { amount = this.props.results.length + ' Questions' }
        }
        if (this.props.x.pathname.includes('tags')) {
            amount = this.props.results.length + ' Tags'
            title = 'All Tags'
        }
        if (this.props.x.pathname.includes('answers')) {
            if (this.props.results[0] === undefined) { return null }
            amount = this.props.results[0].answers.length + ' Answers '
        }
        if (this.props.x.pathname.includes('form')) { return null }
        return (
            <div id='all_questions'>
                <table id='question_page_header'>
                    <thead>
                        <tr>
                            <th id='number_of_questions'>{amount}</th>
                            <th id='page'>{title}</th>
                            <th style={{width: '15%'}}></th>
                        </tr>
                    </thead>
                </table>
            </div>
        )
    }
}
export default withParams(TopBar)
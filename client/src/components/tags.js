import React from 'react'
import TagName from './tagname'
export default class Tags extends React.Component {
    render() {
        let tag_names = []
        for (let i = 0; i < this.props.x.length; i++) {
            for (let j = this.props.start; j < this.props.max; j++) {
                if (this.props.y[j] === this.props.x[i]._id) {
                tag_names.push(<TagName name={this.props.x[i].name} key={this.props.x[i]._id}/>)
            }
        }
    }
        return (
            <table><tbody><tr>{tag_names}</tr></tbody></table>
        )
    }
}
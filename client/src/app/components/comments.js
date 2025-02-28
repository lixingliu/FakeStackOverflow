import React from 'react'
import reactDom from 'react-dom';

export default class Comments extends React.Component {
    render() {
        return (
            <div>
                <li>{this.props.comment}</li>
            </div>
        )
    }
}
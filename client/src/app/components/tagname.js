import React from 'react'
export default class TagName extends React.Component {
    render() {
        return (
            <td><span className='smallTagStyle'>{this.props.name}</span></td>
        )
    }
}
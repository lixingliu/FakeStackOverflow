import React from 'react'
import TopBar from './topbar'
import Page from './page'
export default class Main extends React.Component {
    render() {
        return(
            <div>
                <TopBar
                    results={this.props.results}
                    title={this.props.title}
                    location={this.props.location}
                    admin={this.props.admin}
                />
                <Page
                    admin={this.props.admin}
                    results={this.props.results}
                    handle={this.props.handle}
                    location={this.props.location}
                    title={this.props.title}
                />
            </div>
        )
    }
}
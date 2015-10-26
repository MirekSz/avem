import React, { Component } from 'react';

export default class TableColumn extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <td>
                {this.props.value}
            </td>
        );
    }
}

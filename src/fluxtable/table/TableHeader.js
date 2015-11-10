import React, { Component } from 'react';
//a jak

export default class TableHeader extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var headersElements = this.props.headers.map((column)=> {
            if (column.visible == undefined || column.visible) {
                return <td key={column.name}>{column.name}</td>
            }
        });
        var actions = '';
        if (this.props.actions) {
            actions = <td key="action" className="col-xs-3">Actions</td>;
        }

        return (
            <thead>
            {headersElements}
            {actions}
            </thead>
        );
    }
}

import React, { Component } from 'react';
//a jak

export default class TableHeader extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var headersElements = this.props.headers.map((column)=> {
            if (column.visible == undefined || column.visible) {
                return <th key={column.name}>{column.name}</th>
            }
        });
        var actions = '';
        if (this.props.actions) {
            actions = <th className="col-xs-3">Actions</th>;
        }

        return (
            <thead>
            {headersElements}
            {actions}
            </thead>
        );
    }
}

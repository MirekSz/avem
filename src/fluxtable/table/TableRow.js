import React, { Component } from 'react';
import TableColumn from './TableColumn';

export default class TableRow extends Component {
    constructor(props) {
        super(props);
        this.state = {selected: false}
    }

    select() {
        this.setState({selected: !this.state.selected});
        var row = this.props.row;
        this.props.ac.selectContainer(row);
        this.props.rowSelection(row.Id);
    }

    render() {
        var style = {cursor: 'hand'};
        var clazz = '';

        if (this.props.row.Id == this.props.selected) {
            clazz = 'active';
        }

        var row = this.props.row;

        var component = "";
        if (this.props.actions) {
            component = React.createElement(this.props.actions, {row});
        }

        var keys = this.props.headers;

        var cols = keys.map((col, index)=> {
            var value = this.props.row[col.name];

            if (col.formater) {
                value = col.formater(value, row, style);
            }

            if (col.visible == undefined || col.visible) {
                return <TableColumn value={value} key={index+' '+this.props.row.Id}/>
            }
        });

        return (
            <tr style={style} onClick={this.select.bind(this)} className={clazz}>
                {cols}
                {component}
            </tr>
        );
    }

}

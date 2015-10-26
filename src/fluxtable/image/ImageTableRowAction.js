import React, { Component } from 'react';
import TableColumn from './../table/TableColumn';
import Dialogs from './../Dialogs';
import {imagesActionCreator} from './ImagesActionCreator';

export default class ContainerTableRowAction extends Component {
    constructor(props) {
        super(props);
    }


    removeImage(e) {
        Dialogs.confirm("Are you sure?", "You will not be able to recover this container file!", ()=> {
            var row = this.props.row;
            imagesActionCreator.remove(row);
        })
    }


    render() {
        return (
            <td>
                <a href="#" onClick={this.removeImage.bind(this)}><span
                    className="glyphicon glyphicon-trash"></span></a>

            </td>
        );
    }

}

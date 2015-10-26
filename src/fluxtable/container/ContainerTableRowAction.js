import React, { Component } from 'react';
import TableColumn from './../table/TableColumn';
import Dialogs from './../Dialogs';
import {containersActionCreator} from './ContainersActionCreator';

export default class ContainerTableRowAction extends Component {
    constructor(props) {
        super(props);
    }

    open() {
        var id = this.props.row.Id;
        var port = this.props.row.Ports.filter((element)=>element.PrivatePort == 80);
        var url = `http://strumyk-next-build:${port[0].PublicPort}/`;
        var win = window.open(url, '_blank');
        win.focus();
    }

    startContainer() {
        var id = this.props.row.Id;
        containersActionCreator.startContainer(id);
    }

    stopContainer() {
        var id = this.props.row.Id;
        containersActionCreator.stopContainer(id);
    }

    removeContainer(e) {
        e.stopPropagation();
        Dialogs.confirm("Are you sure?", "You will not be able to recover this container file!", ()=> {
            var id = this.props.row.Id;
            containersActionCreator.removeContainer(id);
        })
    }

    createImage() {
        Dialogs.input("Are you sure?", "You will create image with this container state!", (value)=> {
            var id = this.props.row.Id;
            var repo = value.split(":")[0];
            var tag = value.split(":")[1];
            debugger;
            containersActionCreator.createImage(id, repo, tag);
        })
    }

    render() {
        return (
            <td>
                <a href="#" onClick={this.open.bind(this)}><span
                    className="glyphicon glyphicon-search"></span></a> &nbsp;&nbsp;
                <a href="#" onClick={this.startContainer.bind(this)}><span
                    className="glyphicon glyphicon-play"></span></a>&nbsp;&nbsp;
                <a href="#" onClick={this.stopContainer.bind(this)}><span
                    className="glyphicon glyphicon-stop"></span></a>&nbsp;&nbsp;
                <a href="#" onClick={this.createImage.bind(this)}><span
                    className="glyphicon glyphicon-tags"></span></a>&nbsp;&nbsp;
                <a href="#" onClick={this.removeContainer.bind(this)}><span
                    className="glyphicon glyphicon-trash"></span></a>

            </td>
        );
    }

}

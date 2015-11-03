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
        var url = `http://strumyk-next-build:${port[0].PublicPort}/next-instance`;
        var win = window.open(url, '_blank');
        win.focus();
    }

    startContainer() {
        var id = this.props.row.Id;
        containersActionCreator.startContainer(id);
    }

    stopContainer() {
        Dialogs.confirm("Are you sure?", "You will stop server!", ()=> {
            var id = this.props.row.Id;
            containersActionCreator.stopContainer(id);
        })
    }

    removeContainer(e) {
        e.stopPropagation();
        Dialogs.confirm("Are you sure?", "You will not be able to recover this server", ()=> {
            var id = this.props.row.Id;
            containersActionCreator.removeContainer(id);
        })
    }

    createImage() {
        Dialogs.input("Are you sure?", "You will create image with this container state!", (value)=> {
            var id = this.props.row.Id;
            var repo = value.split(":")[0];
            var tag = value.split(":")[1];
            containersActionCreator.createImage(id, repo, tag);
        })
    }

    render() {
        return (
            <td>
                <a href="#" title="Show" onClick={this.open.bind(this)}><span
                    className="glyphicon glyphicon-search"></span></a> &nbsp;&nbsp;
                <a href="#" title="Start" onClick={this.startContainer.bind(this)}><span
                    className="glyphicon glyphicon-play"></span></a>&nbsp;&nbsp;
                <a href="#" title="Stop" onClick={this.stopContainer.bind(this)}><span
                    className="glyphicon glyphicon-stop"></span></a>&nbsp;&nbsp;
                <a href="#" title="Tag" onClick={this.createImage.bind(this)}><span
                    className="glyphicon glyphicon-tags"></span></a>&nbsp;&nbsp;
                <a href="#" title="Delete" onClick={this.removeContainer.bind(this)}><span
                    className="glyphicon glyphicon-trash"></span></a>

            </td>
        );
    }

}

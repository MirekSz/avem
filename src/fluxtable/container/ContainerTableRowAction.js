import React, { Component } from 'react';
import TableColumn from './../table/TableColumn';
import Dialogs from './../Dialogs';
import {containersActionCreator} from './ContainersActionCreator';
import request from 'superagent';

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

    showJBossLogs() {
        var id = this.props.row.Id;
        var port = this.props.row.Ports.filter((element)=>element.PrivatePort == 80);

        var script = `
               import org.apache.commons.io.input.ReversedLinesFileReader;

File file = new File("/usr/local/jboss/jboss-as-7.1/standalone/log/verto.log");
int n_lines = 100;
int counter = 0;
ReversedLinesFileReader object = new ReversedLinesFileReader(file);
def list=[];
list.add(object.readLine())
while(!object.readLine().isEmpty()  && counter < n_lines)
{
   list.add(0,object.readLine());
    counter++;
}
def result='';
for(line in list){
result+= line+"<br/>"
}
return result;`;

        var url = `http://strumyk-next-build:${port[0].PublicPort}/executor/execute`;
        request.post(url).send({command: script}).end((err, res) => {
            if (!err) {
                $('#jbossLogs').html(res.body.response);
                $('#myModal').modal();
//                Dialogs.showInfo(res.body.response)
            }
        });
    }

    render() {
        return (
            <td>
                <a href="#" title="Show" onClick={this.open.bind(this)}><span
                    className="glyphicon glyphicon-search"></span></a> &nbsp;&nbsp;
                <a href="#" title="Show JBoss logs" onClick={this.showJBossLogs.bind(this)}><span
                    className="glyphicon glyphicon-comment"></span></a> &nbsp;&nbsp;
                <a href="#" title="Start" onClick={this.startContainer.bind(this)}><span
                    className="glyphicon glyphicon-play"></span></a>&nbsp;&nbsp;
                <a href="#" title="Stop" onClick={this.stopContainer.bind(this)}><span
                    className="glyphicon glyphicon-stop"></span></a>&nbsp;&nbsp;
                <a href="#" title="Create image" onClick={this.createImage.bind(this)}><span
                    className="glyphicon glyphicon-tags"></span></a>&nbsp;&nbsp;
                <a href="#" title="Delete" onClick={this.removeContainer.bind(this)}><span
                    className="glyphicon glyphicon-trash"></span></a>

            </td>
        );
    }

}

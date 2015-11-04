import React, { Component } from 'react';
import {observe} from './../lib/Decorators';
import request from 'superagent';
import Dialogs from '../Dialogs';

export default  @observe
class ContainerDetails extends Component {

    constructor(props) {
        super(props);
        this.state = this.getData();
    }

    getData() {
        return {selected: this.props.store.getSelected()};
    }

    componentDidMount() {
        this.addListenersToStore();
    }

    componentWillUnmount() {
        this.removeListenersToStore();
    }

    render() {
        if (!this.state.selected) {
            return null;
        }
        var version = getVersion(this.state.selected.Labels);
        var appPorts = getPortsList(this.state.selected);
        var dbPorts = getDbPorts(this.state.selected);

        return (
            <form>
                <div className="form-group">
                    <label for="version">Version</label>
                    <input type="text" className="form-control" id="version" value={version}
                           readOnly/>
                </div>
                <div className="form-group">
                    <label for="image">Image</label>
                    <input type="text" className="form-control" id="image" value={this.state.selected.Image}
                           readOnly/>
                </div>
                <div className="form-group">
                    <label for="ports">Ports</label>
                    <ul>
                        {appPorts}
                    </ul>
                </div>
                <div className="form-group">
                    <label for="labels">Labels</label>
                    <ul>
                        {dbPorts}
                    </ul>
                </div>
                <div className="form-group">
                    <label for="ports">Bash</label>
                    <input type="text" className="form-control" id="ports"
                           value={'docker exec -it "'+this.state.selected.Names[0].substring(1)+'" bash'} readonly/>
                </div>
            </form>
        );


    }
}

function getPortsList(selected) {
    var ports = selected.Ports.map((obj)=> {
        return <li>{obj.PrivatePort + ' = ' + obj.PublicPort}</li>
    });

    if (ports.length == 0) {
        var labels = selected.Labels;
        ports = <li>{labels.PrivateHostPort + ' -> ' + labels.HostPort}</li>;
    }
    return ports;
}

function getVersion(labels) {
    for (var obj  in  labels) {
        var value = labels[obj];
        if (obj == 'DOCKER_APP_VERTION' && value) {
            return value;
        }
    }
    return 'LAST'
}

function getDbPorts(selected) {
    var ports = [];
    for (var obj  in   selected.Labels) {
        var value = selected.Labels[obj];
        if (obj.indexOf('DB') != -1) {
            ports.push(<li>{obj.replace('DOCKER_', '') + ' = ' + value}</li>);
        }
    }
    return ports;
}

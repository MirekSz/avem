import React, { Component } from 'react';
import {observe} from './../lib/Decorators';
import request from 'superagent';
import Dialogs from '../Dialogs';
import ContainerDetailsWithoutDeps from './ContainerDetailsWithoutDeps';

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
        return ( <ContainerDetailsWithoutDeps row={this.state.selected}/>);
    }
}

var portInfo = new Map();
portInfo.set(80, 'HTTP');
portInfo.set(5432, 'Database');
portInfo.set(8000, 'DEBUG');
portInfo.set(9990, 'Admin Console');

function getPortsList(selected) {
    var ports = selected.Ports.map((obj)=> {
        return <li key={obj.PrivatePort}>{portInfo.get(obj.PrivatePort) + ' = ' + obj.PublicPort}</li>
    });

    if (ports.length == 0) {
        var labels = selected.Labels;
        ports = <li>{labels.PrivateHostPort + ' -> ' + labels.HostPort}</li>;
    }
    return ports;
}

function getVersion(selected) {
    var labels = selected.Labels;
    for (var obj  in  labels) {
        var value = labels[obj];
        if (obj == 'DOCKER_APP_VERTION' && value) {
            return value;
        }
    }
    if (selected.ver) {
        return `LAST (${selected.ver})`;
    }
    return 'LAST';
}

function getDbPorts(selected) {
    var ports = [];
    for (var obj  in   selected.Labels) {
        var value = selected.Labels[obj];
        if (obj.indexOf('DB') != -1) {
            ports.push(<li key={obj}>{obj.replace('DOCKER_', '') + ' = ' + value}</li>);
        }
    }
    return ports;
}

import React, { Component } from 'react/addons';

import styles from './ContainerDetailsWithoutDeps.less';

export default class ContainerDetailsWithoutDeps extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var row = this.props.row;
        if (!row) {
            return null;
        }
        var version = getVersion(row);
        var appPorts = getPortsList(row);
        var dbPorts = getDbPorts(row);

        return (
            <form className={styles.jupi}>
                <div className="form-group">
                    <label >Version</label>
                    <input type="text" className="form-control" id="version" value={version}
                           readOnly/>
                </div>
                <div className="form-group">
                    <label>Image</label>
                    <input type="text" className="form-control" id="image" value={this.props.row.Image}
                           readOnly/>
                </div>
                <div className="form-group">
                    <label>Ports</label>
                    <ul>
                        {appPorts}
                    </ul>
                </div>
                <div className="form-group">
                    <label >Labels</label>
                    <ul>
                        {dbPorts}
                    </ul>
                </div>
                <div className="form-group">
                    <label >Bash</label>
                    <input type="text" className="form-control" id="ports"
                           value={'docker exec -it "'+this.props.row.Names[0].substring(1)+'" bash'} readOnly/>
                </div>
            </form>
        );


    }
}

var portInfo = new Map();
portInfo.set(80, 'HTTP');
portInfo.set(5432, 'Database');
portInfo.set(8000, 'DEBUG');
portInfo.set(9990, 'Admin Console');

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

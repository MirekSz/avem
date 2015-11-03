import React, { Component } from 'react/addons';
import TableComponent from '../table/Table';
import ContainersStore from './ContainersStore';
import ContainerTableRowAction from './ContainerTableRowAction';
import {containersActionCreator as ac} from './ContainersActionCreator';


var headers = [{name: 'Id', visible: false}, {name: 'Names'}, {
    name: 'Created', formater: (value)=> {
        var t = new Date(parseInt(value * 1000) + 1000 * 60 * 60);
        return t.toISOString().slice(0, 16).replace('T', ' ');
    }
}, {
    name: 'Status', formater: (value, row, style)=> {
        var started;
        if (value.indexOf('Started') == -1) {
            started = <span className='glyphicon glyphicon-send' title="App Down"
                            style={{color: 'red', fontSize: '20px'}}></span>
        } else {
            started = <span className='glyphicon glyphicon-send' title="App Up"
                            style={{color: 'green', fontSize: '20px'}}></span>
        }

        if (value.indexOf('Up') == -1) {
            style.color = '#736363';

            return <center><span title="Server Down" className='glyphicon glyphicon-thumbs-down'
                                 style={{color: 'red', fontSize: '20px'}}></span> {started}</center>
        } else {
            return <center><span title="Server Up" className='glyphicon glyphicon-thumbs-up'
                                 style={{color:'green',fontSize:'20px'}}></span> {started}</center>
        }

    }
}, {name: 'Image', visible: false}];

export default class ContainerTable extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (<TableComponent store={ContainersStore} headers={headers} actions={ContainerTableRowAction} ac={ac}/>);
    }
}

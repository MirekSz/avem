import React, { Component } from 'react/addons';
import Table from './fluxtable/table/Table';
import ImagesStore from './fluxtable/image/ImagesStore';
import ContainersStore from './fluxtable/container/ContainersStore';
import ContainerDetails from './fluxtable/container/ContainerDetails';
import ContainerTableRowAction from './fluxtable/container/ContainerTableRowAction';
import {containersActionCreator as ac} from './fluxtable/container/ContainersActionCreator';
import StateManager from './fluxtable/lib/StateManager'
StateManager.start();

//var headers = ['Id', 'Names', 'Created', 'RepoTags'];
//<Table headers={headers} store={ImagesStore}/>
var headers = [{name: 'Id', visible: false}, {name: 'Names'}, {
    name: 'Created', formater: (value)=> {
        var t = new Date(parseInt(value * 1000));
        return t.toISOString().slice(0, 16).replace('T', ' ');
    }
}, {
    name: 'Status', formater: (value, row, style)=> {
        if (value.indexOf('Up') == -1) {
            style.color = '#736363';
            return <center><span className='glyphicon glyphicon-thumbs-down'
                                 style={{color:'red',fontSize:'20px'}}></span>
            </center>;
        } else {
            return <center><span className='glyphicon glyphicon-thumbs-up'
                                 style={{color:'green',fontSize:'20px'}}></span>
            </center>;
        }
    }
}, {name: 'Image', visible: false}];

export default class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-8">
                    <Table store={ContainersStore} headers={headers} actions={ContainerTableRowAction} ac={ac}/>
                </div>
                <div className="col-md-4">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                                Details
                            </h3>
                        </div>
                        <div className=" panel-body">
                            <ContainerDetails store={ContainersStore}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


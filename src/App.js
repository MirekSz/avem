import React, { Component } from 'react/addons';

import ImagesStore from './fluxtable/image/ImagesStore';
import ContainersStore from './fluxtable/container/ContainersStore';
import ContainerDetails from './fluxtable/container/ContainerDetails';
import ContainerTable from './fluxtable/container/ContainerTable';
import StateManager from './fluxtable/lib/StateManager'
StateManager.start();

export default class App extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="row">
                <div className="col-md-8">
                    <ContainerTable />
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


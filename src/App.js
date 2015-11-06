import React, { Component } from 'react/addons';

import ImagesStore from './fluxtable/image/ImagesStore';
import ContainersStore from './fluxtable/container/ContainersStore';
import {UpdateState} from './fluxtable/container/ContainersActionCreator';
import ContainerDetails from './fluxtable/container/ContainerDetails';
import ContainerTable from './fluxtable/container/ContainerTable';
import StateManager from './fluxtable/lib/StateManager'
import SoundNotifier from './fluxtable/SoundNotifier';

StateManager.start();

function titleMod(action) {
    document.title = action.updated.Names + ' Ready \u2605';
}
function supports(action) {
    var newVar = (action instanceof UpdateState) && action.updated.started;
    return newVar;
}

export default class App extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="row">
                <SoundNotifier supports={supports} extraFeature={titleMod}/>
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


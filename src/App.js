import React, { Component } from 'react/addons';

import ImagesStore from './fluxtable/image/ImagesStore';
import ContainersStore from './fluxtable/container/ContainersStore';
import {UpdateState} from './fluxtable/container/ContainersActionCreator';
import ContainerDetails from './fluxtable/container/ContainerDetails';
import ContainerDetailsWithoutDeps from './fluxtable/container/ContainerDetailsWithoutDeps';
import ContainerTable from './fluxtable/container/ContainerTable';
import StateManager from './fluxtable/lib/StateManager'
import SoundNotifier from './fluxtable/SoundNotifier';
import NewServerActionStateManager from './fluxtable/NewServerActionStateManager';

StateManager.start();

function titleMod(action) {
    document.title = action.updated.Names + ' Ready \u2605';
}
function supports(action) {
    var newVar = (action instanceof UpdateState) && action.updated.started;
    return newVar;
}

var DecoratedDetailsPage = connectToStores(ContainerDetailsWithoutDeps, ContainersStore, props => ({
    row: props.store.getSelected()
}));

export default class App extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="row">
                <SoundNotifier supports={supports} extraFeature={titleMod}/>
                <NewServerActionStateManager store={ContainersStore}/>
                <div className="col-md-8">
                    <ContainerTable />
                </div>
                <div className="col-md-4">
                    <div className="panel panel-default col-md-6">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                                Details
                            </h3>
                        </div>
                        <div className=" panel-body">
                            <DecoratedDetailsPage store={ContainersStore}/>
                        </div>
                    </div>
                    <div className="panel panel-default col-md-6">
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

function connectToStores(Component, store, getStateFromStores) {
    const StoreConnection = React.createClass({
        getData() {
            return getStateFromStores(this.props);
        },

        componentDidMount() {
            store.addListener(this.handleStoresChanged)
        },

        componentWillUnmount() {
            store.removeListener(this.handleStoresChanged)
        },

        handleStoresChanged() {
            this.setState(getStateFromStores(this.props));
        },

        render() {
            var props = this.props;
            var state = this.state;
            return <Component {...props} {...state} />;
        }
    });

    return StoreConnection;
}




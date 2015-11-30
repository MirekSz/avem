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

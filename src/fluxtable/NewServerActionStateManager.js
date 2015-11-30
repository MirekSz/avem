import React, { Component } from 'react';
import ContainersStore from './container/ContainersStore';
import {LoadAllContainers} from './container/ContainersActionCreator';

var NewServerActionStateManager = React.createClass({
    componentDidMount(){
        var store = this.props.store;
        store.addListener(this.storeChanged);
    },
    componentWillUnmount(){
        var store = this.props.store;
        store.removeListener(this.storeChanged);
    },
    render: function () {
        return null;
    },
    storeChanged(action){
        var data = this.props.store.getActiveElements();
        var length = data.length;
        if (length >= 5) {
            $("#newContainer").addClass('disabled');
        } else {
            $("#newContainer").removeClass('disabled');
        }
    }
});

export default NewServerActionStateManager;

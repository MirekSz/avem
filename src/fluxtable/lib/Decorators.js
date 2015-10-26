/**
 * Created by Mirek on 2015-10-09.
 */
import React, { Component } from 'react';
var Perf = React.addons.Perf;

export function observe(target) {

    target.prototype.addListenersToStore = function () {
        var listener = ()=> {
            this.setState(this.getData());
        };
        this.listener = listener;
        this.props.store.addListener(listener);

        if (!this.props.store.initialized) {
            this.props.store.init();
        }
    };

    target.prototype.removeListenersToStore = function () {
        this.props.store.removeListener(this.listener);
    }
}

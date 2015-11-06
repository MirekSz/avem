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

export function observable(target) {
    target.listeners = [];

    target.prototype.addListener = function (listener) {
        target.listeners.push(listener);
    };

    target.prototype.removeListener = function (listener) {
        var index = target.listeners.indexOf(listener);
        target.listeners.splice(index, 1);
    };

    target.prototype.emmit = function (event) {
        for (var i = 0; i < target.listeners.length; i++) {
            var listener = target.listeners[i];
            listener(event);
        }
    };

}

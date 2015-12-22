import React, { Component } from 'react';
import Dispacher from './lib/Dispacher';
var played = new Set();
var SoundNotifier = React.createClass({
    propTypes: {
        supports: React.PropTypes.func.isRequired,
        extraFeature: React.PropTypes.func
    },
    componentDidMount(){
        Dispacher.addListener(this.storeChanged);
    },
    componentWillUnmount(){
        Dispacher.removeListener(this.storeChanged);
    },
    render: function () {
        return null;
    },
    storeChanged(action){
        if (this.props.supports(action)) {
            var id = action.updated.Id;
            if (played.has(id)) {
                return;
            }
            played.add(id);
            var audio = new Audio('assets/NFF-choice-good.wav');
            audio.play();
            if (this.props.extraFeature) {
                this.props.extraFeature(action);
            }
        }
    }
});

export default SoundNotifier;

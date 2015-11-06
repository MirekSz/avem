import React, { Component } from 'react';
import Dispacher from './lib/Dispacher';

var SoundNotifier = React.createClass({
    propTypes: {
        eventType: React.PropTypes.func.isRequired,
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
        if (action instanceof this.props.eventType) {
            var audio = new Audio('assets/NFF-choice-good.wav');
            audio.play();
            if (this.props.extraFeature) {
                this.props.extraFeature(action);
            }
        }
    }
});

export default SoundNotifier;

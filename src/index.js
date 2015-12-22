import React from 'react';
import { render } from 'react-dom';
import App from './App';
import PortService from './fluxtable/PortService';
import request from 'superagent';

function initDecorators(target, options) {
    var constructor = target.constructor;
    var ownPropertyNames = Object.getOwnPropertyNames(constructor.prototype);
    for (var i = 0; i < ownPropertyNames.length; i++) {
        var obj = ownPropertyNames[i];
        if (obj.endsWith('Initializer')) {
            constructor.prototype[obj].call(target, options || {});
        }
    }
}


function sayName(target) {
    target.prototype.sayMyName = function () {
        console.log('sayName: ' + this.name);
    };

    target.prototype.sayMyNameInitializer = function () {
        console.log('sayMyNameInitializer: ');
        this.name = 'maja';
    };
}
@sayName
class SomeClass {
    constructor() {
        this.name = 'mirek'
        initDecorators(this);
    }
}
new SomeClass().sayMyName();


NProgress.configure({easing: 'ease', speed: 300});

var app = render(<div><App/></div>, document.getElementById('root'));

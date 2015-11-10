import React from 'react';
import { render } from 'react-dom';
import App from './App';
import PortService from './fluxtable/PortService';
import request from 'superagent';


NProgress.configure({easing: 'ease', speed: 300});

var app = render(<div><App /></div>, document.getElementById('root'));

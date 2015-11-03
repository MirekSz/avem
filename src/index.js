import React from 'react';
import App from './App';
import ContainerForm from './fluxtable/container/ContainerForm';
import PortService from './fluxtable/PortService';
import Table from './fluxtable/table/Table';
import ImagesStore from './fluxtable/image/ImagesStore';
import ImageTableRowAction from './fluxtable/image/ImageTableRowAction';


import request from 'superagent';

//request.post('/commit?container=4118e6be3008e872b0724cd357af994f92ebc315cbf08962b4a367ddeb8f6ee3&comment=message&repo=verto/demo&tag=v1').then((err, res)=> {
//    console.log('err: ');
//    console.log(err);
//});

NProgress.configure({easing: 'ease', speed: 300});

var app = React.render(<div><App /></div>, document.getElementById('root'));

$(document).ready(function () {
    $('#newContainer').click(function () {
        React.unmountComponentAtNode(document.getElementById('root'));

        React.render(<div><ContainerForm store={ImagesStore}/></div>, document.getElementById('root'));
    });

    $('#home').click(function () {
        React.unmountComponentAtNode(document.getElementById('root'));

        React.render(<div><App /></div>, document.getElementById('root'));
    });

    $('#images').click(function () {
        React.unmountComponentAtNode(document.getElementById('root'));

        var headers = [{name: 'RepoTags'}, {
            name: 'VirtualSize', formater: (value)=> {
                return Math.floor(value / 1000000) + ' MB';
            }
        }, {
            name: 'Created', formater: (value)=> {
                var t = new Date(parseInt(value * 1000) + 1000 * 60 * 60);
                return t.toISOString().slice(0, 16).replace('T', ' ');
            }
        }];


        React.render(<div><Table store={ImagesStore} headers={headers} actions={ImageTableRowAction}/>
        </div>, document.getElementById('root'));

    });
});


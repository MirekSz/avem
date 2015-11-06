/**
 * Created by Mirek on 2015-10-17.
 */
import Dispacher from './Dispacher';
import * as ac from './../container/ContainersActionCreator'
import React, { Component } from 'react/addons';
import ContainerForm from '../container/ContainerForm';
import ImagesStore from '../image/ImagesStore';
import ImageTableRowAction from '../image/ImageTableRowAction';
import Table from '../table/Table';
import App from '../../App';
class StateManager {
    start() {
        Dispacher.addListener(this.dispacherListener);
        addRouting();
    }

    dispacherListener(action) {
        switch (action.constructor) {
            case ac.CreateContainer:
                $("#home").click();
                break;
            default:
        }
    }
}

function addRouting() {
    $('#newContainer').click(function () {
        React.unmountComponentAtNode(document.getElementById('root'));

        React.render(<div><ContainerForm store={ImagesStore}/></div>, document.getElementById('root'));
    });
    $('a.selected').click(function () {
        React.unmountComponentAtNode(document.getElementById('root'));

        React.render(<div><App /></div>, document.getElementById('root'));
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
}


export default  new StateManager();

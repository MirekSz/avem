import React, { Component } from 'react';
import {observe} from './../lib/Decorators';
import PortService from './../PortService';
import {containersActionCreator} from './ContainersActionCreator';

export default @observe
class ContainerForm extends Component {

    constructor(props) {
        super(props);
        this.state = this.getData();
    }

    getData() {
        return {
            data: this.props.store.getData(),
            db: {
                dbHost: 'localhost',
                dbPort: 5432,
                dbName: 'verto_db',
                dbUser: 'verto',
                dbPassword: 'vertoverto',
                dbMapping: 'VERTO=VERTO'
            }
        };
    }

    componentDidMount() {
        this.addListenersToStore();

        PortService.getNextAvaliablePort().then((res)=> {
            var state = this.state;
            state.port = res;
            this.setState(state);
        });
    }

    acceptValue(e) {
        var s = this.state;
        s.db[e.target.name] = e.target.value;
        this.setState(s);
    }

    componentWillUnmount() {
        this.removeListenersToStore();
    }

    create(e) {
        e.preventDefault();

        var name = React.findDOMNode(this.refs.name).value.trim();
        var image = React.findDOMNode(this.refs.image).value.trim();
        var port = React.findDOMNode(this.refs.port).value.trim();
        var ver = React.findDOMNode(this.refs.ver).value.trim();

        if (ver) {
            ver = '1.0.' + ver;
        }

        var db = this.state.db;

        containersActionCreator.createContainer({name, image, port, ver, db});
    }

    render() {
        if (!this.state.data) {
            return null;
        }
        var options = this.state.data.map((image)=> {
            if (image.RepoTags[0].indexOf('<none>') == -1) {
                return <option>{image.RepoTags[0]}</option>
            }
        });
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        Nowy serwer
                    </h3>
                </div>

                <div className=" panel-body">
                    <form onSubmit={this.create.bind(this)}>
                        <div className="form-group">
                            <label for="ports">Name</label>
                            <input type="text" className="form-control" ref="name" required="required"/>
                        </div>

                        <div className="form-group">
                            <label for="image">Image</label>
                            <select className="form-control" ref="image" required="required">
                                {options}
                            </select>
                        </div>
                        <div className="form-group">
                            <label for="ver">Version</label>
                            <input type="text" className="form-control" ref="ver"
                                   placeholder="147.91"/>
                        </div>
                        <div className="row">
                            <div className="form-group col-xs-2">
                                <label >Host</label>
                                <input type="text" className="form-control" required="required"
                                       name="dbHost"
                                       onChange={this.acceptValue.bind(this)}
                                       value={this.state.db.dbHost}/>
                            </div>

                            <div className="form-group col-xs-1">
                                <label >Port</label>
                                <input type="text" className="form-control" required="required"
                                       onChange={this.acceptValue.bind(this)}
                                       name="dbPort" value={this.state.db.dbPort}/>
                            </div>
                            <div className="form-group col-xs-2">
                                <label >Db name</label>
                                <input type="text" className="form-control" required="required"
                                       onChange={this.acceptValue.bind(this)}
                                       name="dbName" value={this.state.db.dbName}/>
                            </div>
                            <div className="form-group col-xs-2">
                                <label >User</label>
                                <input type="text" className="form-control" required="required"
                                       onChange={this.acceptValue.bind(this)}
                                       name="dbUser" value={this.state.db.dbUser}/>
                            </div>
                            <div className="form-group col-xs-2">
                                <label >Password</label>
                                <input type="text" className="form-control" required="required"
                                       onChange={this.acceptValue.bind(this)}
                                       name="dbPassword" value={this.state.db.dbPassword}/>
                            </div>
                            <div className="form-group col-xs-3">
                                <label >Schema mapping</label>
                                <input type="text" className="form-control" required="required"
                                       onChange={this.acceptValue.bind(this)}
                                       name="dbMapping" value={this.state.db.dbMapping}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="port">Port</label>
                            <input type="text" readonly disabled className="form-control" ref="port"
                                   value={this.state.port}/>
                        </div>
                        <button type="submit" className="btn btn-default">Zapisz
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

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
        return {data: this.props.store.getData()};
    }

    componentDidMount() {
        this.addListenersToStore();

        PortService.getNextAvaliablePort().then((res)=> {
            var state = this.state;
            state.port = res;
            this.setState(state);
        });
    }

    componentWillUnmount() {
        this.removeListenersToStore();
    }

    create(e) {
        e.preventDefault();
        var name = React.findDOMNode(this.refs.name).value.trim();
        var image = React.findDOMNode(this.refs.image).value.trim();
        var port = React.findDOMNode(this.refs.port).value.trim();
        containersActionCreator.createContainer(name, image, port);
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
                    <form>
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

                        <div className="row">
                            <div className="form-group col-xs-2">
                                <label >Host</label>
                                <input type="text" className="form-control" required="required"
                                       placeholder="strumyk-next"/>
                            </div>
                            <div className="form-group col-xs-1">
                                <label >Port</label>
                                <input type="text" className="form-control" required="required" placeholder="5432"/>
                            </div>
                            <div className="form-group col-xs-2">
                                <label >Db name</label>
                                <input type="text" className="form-control" required="required" placeholder="verto_db"/>
                            </div>
                            <div className="form-group col-xs-2">
                                <label >User</label>
                                <input type="text" className="form-control" required="required" placeholder="verto"/>
                            </div>
                            <div className="form-group col-xs-2">
                                <label >Password</label>
                                <input type="text" className="form-control" required="required"
                                       placeholder="vertoverto"/>
                            </div>
                            <div className="form-group col-xs-3">
                                <label >Schema mapping</label>
                                <input type="text" className="form-control" required="required"
                                       placeholder="VERTO=VERTO_DEV;WMS=EKS"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="port">Port</label>
                            <input type="text" readonly disabled className="form-control" ref="port"
                                   value={this.state.port}/>
                        </div>
                        <button type="submit" className="btn btn-default" onClick={this.create.bind(this)}>Zapisz
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

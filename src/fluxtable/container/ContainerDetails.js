import React, { Component } from 'react';
import {observe} from './../lib/Decorators';
import request from 'superagent';
import Dialogs from '../Dialogs';

export default  @observe
class ContainerDetails extends Component {

    constructor(props) {
        super(props);
        this.state = this.getData();
    }

    getData() {
        return {selected: this.props.store.getSelected()};
    }

    execute(e) {
        e.preventDefault();
        var command = React.findDOMNode(this.refs.command).value;
        request.post('http://strumyk-next-build:8010/executor/shell').send({command: command}).end((err, res) => {
            Dialogs.showInfo('yo', res.body.response);
            console.log('res.body: ');

            console.log(res.body);
        });
    }

    componentDidMount() {
        this.addListenersToStore();
    }

    componentWillUnmount() {
        this.removeListenersToStore();
    }

    render() {
        if (!this.state.selected) {
            return null;
        }

        var mapping = this.state.selected.Ports.map((obj)=> {
            return <li>{obj.PrivatePort + ' = ' + obj.PublicPort}</li>
        });

        var dockerLabels = [];
        for (var obj  in     this.state.selected.Labels) {
            dockerLabels.push(<li>{obj.replace('DOCKER_', '') + ' = ' + this.state.selected.Labels[obj]}</li>);
        }
        if (mapping.length == 0) {
            var labels = this.state.selected.Labels;
            mapping = <li>{labels.PrivateHostPort + ' -> ' + labels.HostPort}</li>;
        }
        return (
            <form>
                <div className="form-group">
                    <label for="image">Image</label>
                    <input type="text" className="form-control" id="image" value={this.state.selected.Image}
                           readonly/>
                </div>
                <div className="form-group">
                    <label for="ports">Ports</label>
                    <ul>
                        {mapping}
                    </ul>
                </div>
                <div className="form-group">
                    <label for="labels">Labels</label>
                    <ul>
                        {dockerLabels}
                    </ul>
                </div>
                <div className="form-group">
                    <label for="ports">Bash</label>
                    <input type="text" className="form-control" id="ports"
                           value={'docker exec -it "'+this.state.selected.Names[0].substring(1)+'" bash'} readonly/>
                </div>
            </form>
        );


    }
}

import React, { Component } from 'react';

import TableHeader from './TableHeader';
import TableRow from './TableRow';
import {observe} from './../lib/Decorators';

export default @observe
class Table extends Component {

    constructor(props) {
        super(props);
        this.state = this.getData();//{items: []};
    }

    getData() {
        if (this.state) {
            var data = this.props.store.getByCriteria({active: this.state.active, query: this.state.query});
            this.state.items = data;
            return this.state;
        }
        return {items: this.props.store.getByCriteria({active: true}), active: true};
    }

    componentDidMount() {
        this.addListenersToStore();
    }

    componentWillUnmount() {
        this.removeListenersToStore();
    }


    showActive() {
        var state = this.state;
        state.active = !state.active;
        this.setState(this.getData());
    }

    search(e) {
        var query = React.findDOMNode(this.refs.search).value.trim();
        this.state.query = query;
        this.setState(this.getData());
    }

    render() {
        var rows = this.state.items.map((obj, index)=><TableRow headers={this.props.headers} row={obj}
                                                                key={'row '+obj.Id} actions={this.props.actions}
                                                                ac={this.props.ac}/>);

        var clazz = "btn btn-primary " + ( this.state.active ? 'active' : '');
        var color = {color: ( this.state.active ? 'green' : 'red')};

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <div className="row">
                        <div className="col-md-8">
                            <h3 className="panel-title">
                                Servers
                            </h3>
                        </div>
                        <div className="col-md-4">
                            <div className="input-group">
                                <div className="input-group-btn">
                                    <button onClick={this.showActive.bind(this)} type="button"
                                            className={clazz} style={color}
                                            data-toggle="button"><span
                                        className="glyphicon glyphicon-ok"></span>
                                    </button>
                                </div>
                                <input type="text" aria-label="Text input with multiple buttons"
                                       onChange={this.search.bind(this)} ref="search" placeholder="Search..."
                                       className="form-control"/>
                            </div>
                        </div>

                    </div>
                </div>

                <div className=" panel-body">
                    <table className=" table table-bordered table-striped table-hover">
                        <TableHeader headers={this.props.headers} actions={this.props.actions}/>
                        <tbody>
                        {rows}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}


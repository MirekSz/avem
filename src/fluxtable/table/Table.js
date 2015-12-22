import React, { Component } from 'react/addons';
import request from 'superagent';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import {observe} from './../lib/Decorators';

@observe
export default class TableComponent extends Component {

    constructor(props) {
        super(props);
        this.state = this.getData();//{items: []};
        this.state.filters = {};
        this.initFilters();
    }

    initFilters() {
        if (this.props.filters) {
            for (var i = 0; i < this.props.filters.length; i++) {
                var obj = this.props.filters[i];
                obj.init(this);
            }
        }
    }

    getData() {
        if (this.state) {
            var data = this.props.store.getByCriteria({filters: this.state.filters, query: this.state.query});
            this.state.items = data;
            return this.state;
        }
        return {items: this.props.store.getByCriteria()};
    }

    componentDidMount() {
        this.addListenersToStore();
    }

    componentWillUnmount() {
        this.removeListenersToStore();
    }

    search(e) {
        var query = React.findDOMNode(this.refs.search).value.trim();
        this.state.query = query;
        this.setState(this.getData());
    }

    rowSelection(rowId) {
        var state = this.state;
        state.rowSelectionId = rowId;
        this.setState(state);
    }

    render() {
        var filters = this.prepareFilters();
        var rows = this.state.items.map((obj, index)=><TableRow selected={this.state.rowSelectionId}
                                                                rowSelection={this.rowSelection.bind(this)}
                                                                headers={this.props.headers} row={obj}
                                                                key={'row '+obj.Id} actions={this.props.actions}
                                                                ac={this.props.ac}/>);

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <div className="row">
                        <div className="col-md-5">
                            <h3 className="panel-title">
                                Servers
                            </h3>
                        </div>
                        <div className="col-md-3">
                            <div className="btn-group  pull-right">
                                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false">
                                    Filters <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu">
                                    {filters}
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="input-group">
                                <div className="input-group-addon">
                                    <span className="glyphicon glyphicon-search"/>
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

    prepareFilters() {
        if (!this.props.filters) {
            return [];
        }
        var filters = this.props.filters.map((filter)=> {
            return <li key={filter}>
                <a href="#" onClick={filter.action.bind(filter)}>{filter.getPresentation()}</a>
            </li>
        });
        return filters;
    }
}

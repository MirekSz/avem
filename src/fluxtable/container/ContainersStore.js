/**
 * Created by Mirek on 2015-10-02.
 */
import BaseStore from './../lib/BaseStore'
import * as ac from './ContainersActionCreator';
import _sortByOrder from 'lodash/collection/sortByOrder';
import _filter from 'lodash/collection/filter';
import _startsWith from 'lodash/string/startsWith';

class ContainersStore extends BaseStore {
    constructor() {
        super();
    }


    dispacherListener(action) {
        switch (action.constructor) {
            case ac.LoadAllContainers:
                this.setData(action.data);
                break;
            case ac.StartContainer:
                ac.containersActionCreator.loadAll();
                break;
            case ac.StopContainer:
                ac.containersActionCreator.loadAll();
                break;
            case ac.DeleteContainer:
                this.selected = null;
                ac.containersActionCreator.loadAll();
                break;
            case ac.SelectContainer:
                this.selected = action.container;
                this.dispach();
                break;
            case ac.CreateContainer:
                ac.containersActionCreator.loadAll();
                break;
            case ac.UpdateState:
                var updated = action.updated;
                var data = this.getData();
                var indexOf = data.indexOf(updated);
                data[indexOf] = updated;
                this.setData(data);
                break;
            default:
        }
    }

    getActiveElements() {
        return this.getData().filter((element)=> {
            if (element.Status.indexOf('Up') != -1) {
                return element;
            }
            return null;
        })
    }

    getByCriteria({filters, query}={}) {
        var data = filters && filters.active && !query ? this.getActiveElements() : this.getData();

        if (PROD) {
            data = data.filter((element)=> {
                return !_startsWith(element.Names[0], '/n1');
            });
        }
        if (query) {
            return _sortByOrder(data.filter((element)=>element.Names[0].indexOf(query) != -1), ['Names'])
        }
        return _sortByOrder(data, ['Names']);
    }

    getSelected() {
        return this.selected;
    }

    initImpl() {
        ac.containersActionCreator.loadAll();
        setInterval(stateLocator.bind(this), 60000);
        setTimeout(stateLocator.bind(this), 5000);
        setInterval(function () {
            ac.containersActionCreator.loadAll();
        }, 100000);
    }

}
function stateLocator() {
    var data = this.getData();

    for (var i = 0; i < data.length; i++) {
        let obj = data[i];
        ac.containersActionCreator.checkAppState(obj);
    }
}
export default new ContainersStore();


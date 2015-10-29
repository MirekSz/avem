/**
 * Created by Mirek on 2015-10-02.
 */
import BaseStore from './../lib/BaseStore'
import * as ac from './ContainersActionCreator';
class ImagesStore extends BaseStore {
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

    getByCriteria({active, query}) {
        var data = active ? this.getActiveElements() : this.getData();
        if (query) {
            return data.filter((element)=>element.Names[0].indexOf(query) != -1)
        }
        return data;
    }

    getSelected() {
        return this.selected;
    }

    initImpl() {
        ac.containersActionCreator.loadAll();
        setInterval(stateLocator.bind(this), 10000);
    }

}
function stateLocator() {
    var data = this.getData();

    for (var i = 0; i < data.length; i++) {
        let obj = data[i];
        ac.containersActionCreator.checkAppState(obj);
    }
}
export default new ImagesStore();


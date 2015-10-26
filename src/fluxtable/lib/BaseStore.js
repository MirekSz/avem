/**
 * Created by Mirek on 2015-10-13.
 */
import Dispacher from './Dispacher'

export default class BaseStore {
    constructor() {
        this.listeners = [];
        this.data = [];
    }

    dispach() {
        for (var i = 0; i < this.listeners.length; i++) {
            var listener = this.listeners[i];
            listener();
        }
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    removeListener(listener) {
        this.listeners.slice(this.listeners.indexOf(listener), 1);
    }

    removeListener(listener) {
        var index = this.listeners.indexOf(listener);
        this.listeners.splice(index, 1);
    }

    init() {
        this.initialized = true;
        Dispacher.addListener(this.dispacherListener.bind(this));
        this.initImpl();
    }

    getData() {
        return this.data;
    }

    getByCriteria(options) {
        var data = this.getData();
        if (options.query) {
            return data.filter((element)=>JSON.stringify(element).indexOf(options.query) != -1);
        }
        return data;
    }

    setData(data) {
        this.data = data;
        this.dispach();
    }

    initImpl() {

    }

    dispacherListener() {

    }
}

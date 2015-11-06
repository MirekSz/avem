/**
 * Created by Mirek on 2015-10-13.
 */
import Dispacher from './Dispacher'
import {observable} from './Decorators'
@observable
export default class BaseStore {
    constructor() {
        this.data = [];
    }

    dispach() {
        this.emmit();
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

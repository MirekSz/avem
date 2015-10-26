/**
 * Created by Mirek on 2015-10-17.
 */
import Dispacher from './Dispacher';
import * as ac from './../container/ContainersActionCreator'

class StateManager {
    start() {
        Dispacher.addListener(this.dispacherListener)
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
export default  new StateManager();

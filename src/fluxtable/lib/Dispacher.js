/**
 * Created by Mirek on 2015-10-02.
 */

class Dispacher {
    constructor() {
        this.listeners = [];
    }

    dispach(action) {
        console.log('action: ');
        console.log(action);

        for (var i = 0; i < this.listeners.length; i++) {
            var listener = this.listeners[i];
            console.log('listener: ');
            console.log(listener);
            listener(action);
        }
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    removeListener(listener) {
        var index = this.listeners.indexOf(listener);
        this.listeners.splice(index, 1);
    }
}
export default  new Dispacher();

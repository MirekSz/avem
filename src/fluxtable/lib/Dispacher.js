/**
 * Created by Mirek on 2015-10-02.
 */
import {observable} from './Decorators';
@observable
class Dispacher {
    constructor() {
    }

    dispach(action) {
        console.log('action: ');
        console.log(action);

        this.emmit(action);
    }

}
export default  new Dispacher();

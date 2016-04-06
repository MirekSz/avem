"use strict";
/**
 * Created by Mirek on 2016-04-06.
 */
class Customer {
    constructor(name) {
        this.name = name;
    }

    hello() {
        console.log('this.name: ');
        console.log(this.name);
    }

}

export default Customer;

"use strict";
/**
 * Created by Mirek on 2015-10-02.
 */

import Dispacher from './../lib/Dispacher';
import request from 'superagent';
import Dialogs from './../Dialogs';

class ImagesActionCreator {


    loadAll() {
        var execute = request.get('/images/json');
        this.addCallback(execute, (err, res) => {
            Dispacher.dispach(new LoadAllContainers(res.body));
        });
    }

    remove(image) {
        var execute = request.del(`/images/${image.Id}`);

        this.addCallback(execute, (err, res) => {
            Dispacher.dispach(new RemoveContainer());
        });
    }

    addCallback(request, callback) {
        NProgress.start();
        request
            .end((err, res) => {
                if (err) {
                    Dialogs.showError(err.response.statusText, err.response.text);
                }
                NProgress.done();
                callback(err, res);
            });
    }
}

export var imagesActionCreator = new ImagesActionCreator();


export class LoadAllContainers {
    constructor(data) {
        this.data = data;
    }
}

export class RemoveContainer {
}

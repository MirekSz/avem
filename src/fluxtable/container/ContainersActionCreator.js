"use strict";
/**
 * Created by Mirek on 2015-10-02.
 */

import Dispacher from './../lib/Dispacher';
import Dialogs from './../Dialogs';
import request from 'superagent';

class ContainersActionCreator {
    createImage(id, repo, tag) {
        NProgress.start();
        request.post(`/commit?container=${id}&comment=commit&repo=${repo}&tag=${tag}`).then((err, res)=> {
            if (err.status == 201) {
                Dispacher.dispach(new CreateImage());
                NProgress.done();
                return;
            }
            if (err) {
                Dialogs.showError(err.response.statusText, err.response.text);
            }
            Dispacher.dispach(new CreateImage());
            NProgress.done();
        });
    }

    createContainer(name, image, port) {
        NProgress.start();

        var data = {
            Tty: true,
            RestartPolicy: {
                "MaximumRetryCount": 0,
                "Name": "no"
            },
            Cmd: ["/usr/bin/supervisord"],
            Env: [`DOCKER_HTTP_PORT=${port}`, 'DOCKER_HTTP_ADDR=strumyk-next-build'],
            Image: image,
            ExposedPorts: {"80/tcp": {}, "9990/tcp": {}, "8000/tcp": {}, "5432/tcp": {}},
            "Labels": {PrivateHostPort: "80", HostPort: port}
        };

        var run = {
            "PortBindings": {
                "80/tcp": [{"HostPort": port}],
                "9990/tcp": [{"HostPort": (Number(port) + 2) + ''}],
                "8000/tcp": [{"HostPort": (Number(port) + 4 + '')}],
                "5432/tcp": [{"HostPort": (Number(port) + 6 + '')}]
            }
        };

        request.post(`/containers/create?name=${name}`).send(data).end((err, res)=> {
            if (err) {
                Dialogs.showError(err.response.statusText, err.response.text);
            }
            var id = res.body.Id;
            request.post(`/containers/${id}/start`).send(run).end((err, res)=> {
                if (err) {
                    Dialogs.showError(err.response.statusText, err.response.text);
                }
                Dispacher.dispach(new CreateContainer());
                NProgress.done();
            });
        });
    }

    loadAll() {
        var execute = request.get('/containers/json?all=true');

        this.addCallback(execute, (err, res) => {
            Dispacher.dispach(new LoadAllContainers(res.body));
        });
    }

    startContainer(id) {
        var execute = request.post(`/containers/${id}/start`);

        this.addCallback(execute, (err, res) => {
            Dispacher.dispach(new StartContainer(id));
        });
    }

    stopContainer(id) {
        var execute = request.post(`/containers/${id}/stop`);

        this.addCallback(execute, (err, res) => {
            Dispacher.dispach(new StopContainer(id));
        });
    }

    removeContainer(id) {
        var execute = request.del(`/containers/${id}`);

        this.addCallback(execute, (err, res) => {
            Dispacher.dispach(new DeleteContainer(id));
        });
    }

    selectContainer(container) {
        Dispacher.dispach(new SelectContainer(container));
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

export var containersActionCreator = new ContainersActionCreator();


export class LoadAllContainers {
    constructor(data) {
        this.data = data;
    }
}

export class StartContainer {
    constructor(id) {
        this.id = id;
    }
}

export class StopContainer {
    constructor(id) {
        this.id = id;
    }
}

export class DeleteContainer {
    constructor(id) {
        this.id = id;
    }
}

export class SelectContainer {
    constructor(container) {
        this.container = container;
    }
}

export class CreateContainer {
}
export class CreateImage {
}

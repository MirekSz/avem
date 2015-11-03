"use strict";
/**
 * Created by Mirek on 2015-10-02.
 */

import Dispacher from './../lib/Dispacher';
import Dialogs from './../Dialogs';
import request from 'superagent';

class ContainersActionCreator {
    checkAppState(element) {
        var publicPort = '';

        for (var j = 0; j < element.Ports.length; j++) {
            var port = element.Ports[j];
            if (port.PrivatePort == '80') {
                publicPort = port.PublicPort;
            }
        }

        if (publicPort) {
            var script = `
                new URL('http://strumyk-next-build:${publicPort}/next-app/').getText()
                def data = new URL('http://strumyk-next-build:${publicPort}/next-instance/').getText()
                def start = data.indexOf('Wersja ')
                return data.substring(start+6,start+17)`;

            request.post(`http://strumyk-next-build:${publicPort}/executor/execute`).send({command: script}).end((err, res) => {
                if (!err) {
                    if (element.Status.indexOf('Started') != -1) {
                        return;
                    }
                    element.Status = element.Status += 'Started';
                    Dispacher.dispach(new UpdateState(element));
                    var audio = new Audio('assets/NFF-choice-good.wav');
                    audio.play();
                } else {
                    element.Status = element.Status.replace('Started', '');
                    Dispacher.dispach(new UpdateState(element));
                }
            });
        }
    }

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

    createContainer({name, image, port, ver, db}) {
        NProgress.start();
        var instance = Math.floor((Date.now() + '').substring(4));

        var env = [`DOCKER_HTTP_PORT=${port}`, `DOCKER_APP_INSTANCE=${instance}`, `DOCKER_APP_VERTION=${ver}`, 'DOCKER_HTTP_ADDR=strumyk-next-build', `DOCKER_DB_HOST=${db.dbHost}`, `DOCKER_DB_PORT=${db.dbPort}`, `DOCKER_DB_NAME=${db.dbName}`, `DOCKER_DB_USER=${db.dbUser}`, `DOCKER_DB_PASSWORD=${db.dbPassword}`, `DOCKER_DB_MAPPING=${db.dbMapping}`];
        var data = {
            Tty: true,
            RestartPolicy: {
                "MaximumRetryCount": 0,
                "Name": "no"
            },
            Cmd: ["/usr/bin/supervisord"],
            Env: env,
            Image: image,
            ExposedPorts: {"80/tcp": {}, "9990/tcp": {}, "8000/tcp": {}, "5432/tcp": {}},
            "Labels": {PrivateHostPort: "80", HostPort: port},
            "Volumes": {
                "/usr/local/jboss/jboss-as-7.1/standalone/log": {}
            }
        };

        for (var i = 0; i < env.length; i++) {
            var obj = env[i];
            var arr = obj.split('=');
            data.Labels[arr[0]] = arr[1];
        }

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

export class UpdateState {
    constructor(updated) {
        this.updated = updated;
    }
}

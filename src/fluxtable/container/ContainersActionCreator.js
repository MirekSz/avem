"use strict";
/**
 * Created by Mirek on 2015-10-02.
 */

import Dispacher from './../lib/Dispacher';
import Dialogs from './../Dialogs';
import request from 'superagent';
import _functions from 'lodash/object/functions';

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
                Authenticator.setDefault (new Authenticator() {
                     protected PasswordAuthentication getPasswordAuthentication() {
                           return new PasswordAuthentication ("admin", "admin".toCharArray());
                     }
                });
                new URL('http://${DOCKER_API}:${publicPort}/next-app/').getText();
                def data = new URL('http://${DOCKER_API}:${publicPort}/next-instance/').getText()
                def start = data.indexOf('Wersja ')
                return data.substring(start+6,start+18).replace('<','')`;

            request.post(`http://${DOCKER_API}:${publicPort}/executor/execute`).send({command: script}).end((err, res) => {
                if (!err) {
                    if (element.started) {
                        return;
                    }
                    element.started = true;
                    element.ver = res.body.response;
                    Dispacher.dispach(new UpdateState(element));
                } else {
                    element.started = false;
                    Dispacher.dispach(new UpdateState(element));
                }
            });
        }
    }

    createImage(id, repo, tag) {
        NProgress.start();
        request.post(`/commit?container=${id}&comment=commit&repo=${repo}&tag=${tag}`).set('Accept', 'application/json').then((err, res)=> {
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

        var env = [`DOCKER_HTTP_PORT=${port}`, `DOCKER_APP_INSTANCE=${instance}`, `DOCKER_APP_VERTION=${ver}`, `DOCKER_HTTP_ADDR=${DOCKER_API}`, `DOCKER_DB_HOST=${db.dbHost}`, `DOCKER_DB_PORT=${db.dbPort}`, `DOCKER_DB_NAME=${db.dbName}`, `DOCKER_DB_USER=${db.dbUser}`, `DOCKER_DB_PASSWORD=${db.dbPassword}`, `DOCKER_DB_MAPPING=${db.dbMapping}`];
        var data = {
            Hostname: name,
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
        request.post(`/containers/create?name=${name}`).set('Accept', 'application/json').send(data).end((err, res)=> {
            if (err) {
                Dialogs.showError(err.response.statusText, err.response.text);
            } else {
                var id = res.body.Id;
                request.post(`/containers/${id}/start`).set('Accept', 'application/json').send(run).end((err, res)=> {
                    if (err) {
                        Dialogs.showError(err.response.statusText, err.response.text);
                    }
                    Dispacher.dispach(new CreateContainer());
                    NProgress.done();
                });
            }
        });
    }

    loadAll() {
        var execute = request.get('/containers/json?all=true').set('Accept', 'application/json');

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
        var stopRequest = request.post(`/containers/${id}/stop`);


        this.addCallback(stopRequest, (err, res) => {
            var deleteRequest = request.del(`/containers/${id}`);
            this.addCallback(deleteRequest, (err, res) => {
                Dispacher.dispach(new DeleteContainer(id));
            });
        });
    }

    selectContainer(container) {
        Dispacher.dispach(new SelectContainer(container));
    }

    addCallback(request, callback) {
        NProgress.start();
        request
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (err) {
                    Dialogs.showError(err.response.statusText, err.response.text);
                }
                NProgress.done();
                callback(err, res);
            });
    }
}

function apply(name) {
    return this.target[name].apply(this.target, Array.prototype.slice.call(arguments, 1));
}
class Proxy {
    constructor(target, args) {
        this.target = target;
        var objs = Object.getOwnPropertyNames(target.__proto__);
        for (var i in objs) {
            var name = objs[i];
//            target[name + 'Orginal'] = target[name];
            this[name] = apply.bind(this, name);
        }
    }
}


var proxy = new Proxy(new ContainersActionCreator());

export var containersActionCreator = proxy;


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

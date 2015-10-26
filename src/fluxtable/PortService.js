/**
 * Created by Mirek on 2015-10-02.
 */

import request from 'superagent';
const START_PORT = 8000;
const INC = 10;
class PortService {

    getNextAvaliablePort() {
        return new Promise((resolve, reject) => {
            var execute = request.get('/containers/json?all=true');

            this.addCallback(execute, (err, res) => {
                var nextPort = this.findNextPort(res.body);
                resolve(nextPort);
            });
        });
    }

    findNextPort(data) {
        var bookedPorts = [];
        for (let i = 0; i < data.length; i++) {
            var container = data[i];
            for (var j = 0; j < container.Ports.length; j++) {
                var mapping = container.Ports[j];
                var port = mapping.PublicPort;
                bookedPorts.push(port);
            }
            if (container.Labels.HostPort) {
                bookedPorts.push(Number(container.Labels.HostPort));
            }
        }
        for (let i = START_PORT; i < 9990; i = i + INC) {
            if (bookedPorts.indexOf(i) == -1) {
                return i;
            }

        }
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
export default new PortService();

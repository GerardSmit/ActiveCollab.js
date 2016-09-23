'use strict';

const Base = require('../base');

class Task extends Base {
    constructor(account, data) {
        super(account, data);
    }

    getPath() {
        return 'projects/' + this['project_id'] + '/tasks';
    }

    open() {
        return new Promise((resolve, reject) => {
            this.account.put('/open/task/' + this['id'])
                .then((data) => {
                    this.set(data['single']);
                    resolve();
                })
                .catch(reject);
        });
    }

    complete() {
        return new Promise((resolve, reject) => {
            this.account.put('/complete/task/' + this['id'])
                .then((data) => {
                    this.set(data['single']);
                    resolve();
                })
                .catch(reject);
        });
    }
}

module.exports = Task;
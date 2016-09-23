'use strict';

const Base = require('../base');

class Subtask extends Base {
    constructor(account, data) {
        super(account, data);
    }

    getPath() {
        return 'projects/' + this['project_id'] + '/tasks/' + this['task_id'];
    }
}

module.exports = Subtask;
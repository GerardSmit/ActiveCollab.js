'use strict';

const Base = require('./base');

class Project extends Base {
    constructor(account, data) {
        super(account, data);
        this.path = 'projects';
        this.tasks = this._createProp(
            () => 'projects/' + this['id'] + '/tasks',
            (result) => result['tasks']
        );
    }
}

module.exports = Project;
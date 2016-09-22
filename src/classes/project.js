'use strict';

const Base = require('./base');

class Project extends Base {
    constructor(account, data) {
        super(account, data);
        this.path = 'projects';
    }
}

module.exports = Project;
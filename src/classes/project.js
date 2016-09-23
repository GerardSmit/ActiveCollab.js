'use strict';

const Base = require('./base');

class Project extends Base {
    constructor(account, data) {
        super(account, data);
        this.path = 'projects';
        this.tasks = (() => {
            // TODO Clean this up.
            let prop = () => this.account.get('projects/' + this.id + '/tasks')['tasks'];
            prop.read = () => this.account.get('projects/' + this.id + '/tasks');
            prop.create = (object) => this.account.post('projects/' + this.id + '/tasks', object);
            prop.update = (object) => this.account.put('projects/' + this.id + '/tasks/' + object.id, object);
            prop.remove = (object) => this.account.remove('projects/' + this.id + '/tasks/' + object.id);
            return prop;
        })();
    }
}

module.exports = Project;
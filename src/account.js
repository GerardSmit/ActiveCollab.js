'use strict';

const request = require('request');
const List = require('./utils/list');
const Base = require('./classes/base');
const classes = {
    Project: require('./classes/project'),
    Task: require('./classes/projects/task')
};

/**
 * Class Account
 */
class Account {
    /**
     * Account constructor
     *
     * @param {Client} client
     * @param {Object} data
     */
    constructor(client, data) {
        this.client = client;
        this.name = data.name;
        this.url = data.url;
        this.display_name = data.display_name;
        this.class = data.class;
        this.token = null;
        this.projects = this._createProp('projects');
    }

    /**
     * Fetch the token from ActiveCollab.
     *
     * @returns {Promise}
     */
    issueToken() {
        return new Promise((accept, reject) => {
            request.post({
                url: this.url + '/api/v1/issue-token-intent',
                form: {
                    client_vendor: this.client.vendor,
                    client_name: this.client.name,
                    intent: this.client.user.intent
                }
            }, (err, response, body) => {
                if (err) reject(err);
                let data = JSON.parse(body);
                if (!data['is_ok']) {
                    reject(data['message']);
                    return;
                }
                this.token = data['token'];
                accept(this);
            });
        });
    }

    /**
     * Fetch data from ActiveCollab.
     *
     * All the objects are converted to classes if the 'class' key is present.
     *
     * @param {string} path The path.
     * @returns {Promise}
     */
    get(path) {
        return new Promise((accept, reject) => {
            if (this.token === null) {
                reject('The token is null. Call Account.issueToken first.')
            }

            request({
                url: this.url + '/api/v1/' + path,
                headers: {
                    'X-Angie-AuthApiToken': this.token
                }
            }, (err, response, body) => {
                if (err) reject(err);
                let data = JSON.parse(body);
                let items = data.map((item) => {
                    if (item.class) {
                        let itemClass = classes[item.class];

                        if (!itemClass) {
                            reject('The class ' + item.class + ' is not supported (yet).');
                        }

                        return new itemClass(this, item);
                    }

                    return item;
                });

                accept(new List(items));
            });
        });
    }

    /**
     *
     * @param path
     * @param {Base|Object} object
     * @returns {Promise}
     */
    post(path, object) {
        if (object instanceof Base && object.account !== this) {
            object.account = null;
            delete object['id'];
        }

        return new Promise((accept, reject) => {
            request.post({
                url: this.url + '/api/v1/' + path,
                headers: {
                    'X-Angie-AuthApiToken': this.token
                },
                json: object
            }, (err, response, data) => {
                if (err) reject(err);

                if (data.type && data.type === 'ValidationErrors') {
                    reject(data.message);
                    return;
                }

                if (object instanceof Base && data['single']) {
                    object.account = this;
                    object.set(data['single']);
                } else if (data['single'] && data['single'].class) {
                    let itemClass = classes[data['single'].class];

                    if (!itemClass) {
                        reject('The class ' + data['single'].class + ' is not supported (yet).');
                    }

                    object = new itemClass(this, data['single']);
                }
                accept(object);
            });
        });
    }

    /**
     *
     * @param path
     * @returns {Promise}
     */
    remove(path) {
        return new Promise((accept, reject) => {
            request.delete({
                url: this.url + '/api/v1/' + path,
                headers: {
                    'X-Angie-AuthApiToken': this.token
                }
            }, (err, response, data) => {
                if (err) reject(err);
                accept();
            });
        });
    }

    /**
     *
     * @param path
     * @param {Base|Object} object
     * @returns {Promise}
     */
    put(path, object) {
        return new Promise((accept, reject) => {
            if (object instanceof Base && object.account !== this) {
                reject('Updating across different accounts is not possible');
                return;
            }

            request.put({
                url: this.url + '/api/v1/' + path,
                headers: {
                    'X-Angie-AuthApiToken': this.token
                },
                json: object
            }, (err, response, data) => {
                if (err) reject(err);
                if (object instanceof Base && data['single']) {
                    object.set(data['single']);
                }
                accept();
            });
        });
    }

    /**
     * Create a property.
     *
     * @param url
     * @returns {function(): Promise|{read: (function(): Promise), create: (function(*=): Promise), update: (function(*=): Promise), remove: (function(*): Promise)}}
     * @private
     */
    _createProp(url) {
        let prop = () => this.get(url);
        prop.read = () => this.get(url);
        prop.create = (object) => this.post(url, object);
        prop.update = (object) => this.put(url + '/' + object.id, object);
        prop.remove = (object) => this.remove(url + '/' + object.id);
        return prop;
    }
}

module.exports = Account;
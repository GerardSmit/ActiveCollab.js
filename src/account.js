'use strict';

const request = require('request');
const List = require('./utils/list');

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
     * Fetch all the projects from ActiveCollab.
     *
     * @returns {Promise<List<Object>>}
     */
    getProjects() {
        return new Promise((accept, reject) => {
            if (this.token === null) {
                reject('The token is null. Call Account.issueToken first.')
            }

            request({
                url: this.url + '/api/v1/projects',
                headers: {
                    'X-Angie-AuthApiToken': this.token
                }
            }, (err, response, body) => {
                if (err) reject(err);
                let data = JSON.parse(body);
                accept(new List(data));
            });
        });
    }
}

module.exports = Account;
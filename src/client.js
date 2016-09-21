'use strict';

const request = require('request');
const Account = require('./account');
const List = require('./utils/list');

/**
 * Class Client
 */
class Client {
    /**
     * Client constructor
     *
     * The name and vendor can be the application name and company name.
     *
     * @param {string} name The name of the client.
     * @param {string} vendor The vendor of the client.
     */
    constructor(name, vendor) {
        this.name = name;
        this.vendor = vendor;
        this.accounts = new List();
        this.user = null;
    }

    /**
     * Login with the given username and password.
     *
     * @param {string} email
     * @param {string} password
     * @returns {Promise}
     */
    login(email, password) {
        return new Promise((accept, reject) => {
            request.post({
                url: 'https://my.activecollab.com/api/v1/external/login',
                form: {
                    email: email,
                    password: password
                }
            }, (err, response, body) => {
                if (err) reject(err);
                let data = JSON.parse(body);
                if (!data['is_ok']) {
                    reject(data['message']);
                    return;
                }
                this.accounts = new List(data['accounts'].map((account) => new Account(this, account)));
                this.user = data['user'];
                accept();
            });
        })
    }
}

module.exports = Client;
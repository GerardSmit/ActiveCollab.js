const assert = require('assert');
const ActiveCollab = require('../index');
const fs = require('fs');

if(!process.env.email || !process.env.password) {
    throw 'Expected an email and password in process.env';
}

const client = new ActiveCollab.Client('ActiveCollab.js', 'Gerard');

describe('Client', function() {
    describe('#login()', function() {
        it('should fail', () => client.login().shouldFail);
        it('should login', () => client.login(process.env.email, process.env.password));
    });
});

describe('Account', function() {
    let account;

    before(() => {
        if (client.accounts.empty()) {
            throw 'No accounts are loaded.'
        } else {
            account = client.accounts.first();
        }
    });

    describe('#issueToken()', function () {
        it('should fetch the token', () => account.issueToken());
    });

    describe('#projects()', function () {
        it('should success', () => account.projects());
    });
});
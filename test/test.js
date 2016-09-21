const assert = require('assert');
const ActiveCollab = require('../index');
const fs = require('fs');

if(!fs.existsSync('credentials.json', 'utf-8')) {
    throw 'Expected a file `credentials.json` with the email and password.';
}

const client = new ActiveCollab.Client('ActiveCollab.js', 'Gerard');
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf-8'));

describe('Client', function() {
    describe('#login()', function() {
        it('should fail', () => client.login().shouldFail);
        it('should login', () => client.login(credentials.email, credentials.password));
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
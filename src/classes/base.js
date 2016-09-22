'use strict';

class Base {
    constructor(account, data) {
        if (account && data) {
            this.account = account;
            this.set(data);
        } else {
            this.set(account);
        }
    }

    set(data) {
        if (data) {
            for (let key of Object.keys(data)) {
                this[key] = data[key];
            }
        }
    }

    save() {
        if (!this.account) {
            return Promise.reject('The account is not set.');
        }

        if (this.id) {
            return this.account.put(this.path + '/' + this.id, this);
        } else {
            return this.account.post(this.path, this);
        }
    }

    remove() {
        if (!this.account) {
            return Promise.reject('The account is not set.');
        }

        if (this.id) {
            return this.account.remove(this.path + '/' + this.id);
        } else {
            return Promise.resolve();
        }
    }
}

module.exports = Base;
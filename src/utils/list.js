'use strict';

/**
 * Class List
 */
class List {
    /**
     * List constructor.
     *
     * @param {Array} [items]
     */
    constructor(items) {
        this.items = items || [];
    }

    /**
     * Add a new item.
     *
     * @param {*} item
     * @returns {Number}
     */
    add(item) {
        return this.items.push(item);
    }

    /**
     * Filter the list.
     *
     * @param {function(*=, number=, Array=)} callback
     * @returns {List}
     */
    filter(callback) {
        return new List(this.items.filter(callback));
    }

    /**
     * Get the last item.
     *
     * @param {function(*=, number=, Array=)} [callback]
     * @returns {*}
     */
    last(callback) {
        if (!callback) {
            return this.items.length > 0 ? this.items[this.items.length - 1] : null;
        }

        for (let i = this.items.length - 1; i >= 0; i--) {
            let item = this.items[i];
            if (callback(item, i, this.items)) {
                return item;
            }
        }

        return null;
    }

    /**
     * Get the first item.
     *
     * @param {function(*=, number=, Array=)} [callback]
     * @returns {*}
     */
    first(callback) {
        if (!callback) {
            return this.items.length > 0 ? this.items[0] : null;
        }

        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            if (callback(item, i, this.items)) {
                return item;
            }
        }

        return null;
    }

    /**
     * Delete the given item.
     *
     * @param {*} item
     * @returns {List}
     */
    remove(item) {
        let index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
        return this;
    }

    /**
     * Delete all the items.
     *
     * @param {function(*=, number=, Array=)} [callback]
     * @returns {List}
     */
    removeAll(callback) {
        this.items = callback ? this.items.filter((fn, items) => !callback(fn, items)) : [];
        return this;
    }

    /**
     * Check if the item is in the list.
     *
     * @param {*} item
     * @returns {boolean}
     */
    contains(item) {
        return this.items.indexOf(item) !== -1;
    }

    /**
     * Map the list.
     *
     * @param {function(*=, number=, Array=)} callback
     * @returns {List}
     */
    map(callback) {
        return new List(this.items.map(callback));
    }

    /**
     * Get all the items.
     *
     * @returns {Array}
     */
    all() {
        return this.items;
    }

    /**
     * Get the size of the list.
     *
     * @returns {Number}
     */
    size() {
        return this.items.length;
    }

    /**
     * True if the list is empty.
     *
     * @returns {boolean}
     */
    empty() {
        return this.items.length === 0;
    }

    /**
     * Join the map to a single string.
     *
     * @param {string} [separator]
     * @returns {string}
     */
    join(separator) {
        return this.items.join(separator);
    }

    /**
     * Get all the promises and call Promise.all.
     *
     * @param [callback]
     * @returns {Promise}
     */
    promise(callback) {
        let promises = (callback ? this.items.map(callback) : this.items).filter(promise => promise instanceof Promise);
        return promises.length === 0 ? Promise.resolve() : Promise.all(promises);
    }

    /**
     * Loop through all the items.
     *
     * @param callback
     * @returns {List}
     */
    forEach(callback) {
        this.items.forEach(callback);
        return this;
    }

    /**
     * Iterator
     *
     * @returns {{next: (function(): {value: *, done: boolean})}}
     */
    [Symbol.iterator]() {
        var index = 0;
        var data = this.items;

        return {
            next: () => ({value: data[index++], done: index >= data.length})
        };
    };
}

module.exports = List;
'use strict';

const List = require('../src/utils/list');
const assert = require('assert');

describe('List', function() {
    describe('#add()', function() {
        it('should add', () => {
            let list = new List();
            assert.equal(list.add('foo'), 1);
            assert.equal(list.add('bar'), 2);
        });
    });

    describe('#all()', function() {
        it('should return all the items', () => {
            let list = new List(['foo', 'bar']);
            assert.deepEqual(list.all(), ['foo', 'bar']);
        });
    });

    describe('#first()', function() {
        let list = new List();

        before(() => {
            list.removeAll();
            list.add('foo');
            list.add('bar');
        });

        it('should return the first value', () => {
            assert.equal(list.first(), 'foo');
        });

        it('should return the first value with filter', () => {
            assert.equal(list.first((item) => item === 'bar'), 'bar');
        });
    });

    describe('#last()', function() {
        let list = new List();

        before(() => {
            list.removeAll();
            list.add('foo');
            list.add('bar');
        });

        it('should return the last value', () => {
            assert.equal(list.last(), 'bar');
        });

        it('should return the last value with filter', () => {
            assert.equal(list.last((item) => item === 'foo'), 'foo');
        });
    });

    describe('#filter()', function() {
        it('should return everything but not ruh', () => {
            let list = new List(['foo', 'ruh', 'bar']);
            assert.deepEqual(list.filter((item) => item !== 'ruh'), new List(['foo', 'bar']));
        });
    });

    describe('#contains()', function() {
        let list = new List();

        before(() => {
            list.removeAll();
            list.add('foo');
            list.add('bar');
        });

        it('should contain foo', () => {
            assert.equal(list.contains('foo'), true);
        });

        it('should not contain ruh', () => {
            assert.equal(list.contains('ruh'), false);
        });
    });

    describe('#remove()', function() {
        let list = new List();

        beforeEach(() => {
            list.removeAll();
            list.add('foo');
            list.add('bar');
        });

        it('should remove the item', () => {
            list.remove('foo');
            assert.deepEqual(list, new List(['bar']));
        });
    });

    describe('#size()', function() {
        let list = new List();

        beforeEach(() => {
            list.removeAll();
            list.add('foo');
            list.add('bar');
        });

        it('should return the correct size', () => {
            assert.equal(list.size(), 2);
            list.remove('foo');
            assert.equal(list.size(), 1);
        });
    });

    describe('#empty()', function() {
        it('should return true if the list is empty', () => {
            let list = new List();
            assert.equal(list.empty(), true);
        });

        it('should return false if the list is not empty', () => {
            let list = new List();
            list.add('foo');
            assert.equal(list.empty(), false);
        });
    });

    describe('#map()', function() {
        it('should map the list', () => {
            let list = new List(['foo', 'bar']).map((item) => item.toUpperCase());
            assert.deepEqual(list, new List(['FOO', 'BAR']));
        });
    });

    describe('#forEach()', function() {
        it('should loop through the list', () => {
            let list = new List(['foo']);
            list.forEach((item) => assert.equal(item, 'foo'));
        });
    });

    describe('#promises()', function() {
        it('should should accept all the promises', () => {
            let list = new List([
                Promise.resolve(),
                Promise.resolve()
            ]);
            return list.promise();
        });

        it('should should reject', () => {
            let list = new List([
                Promise.resolve(),
                Promise.reject()
            ]);
            return list.promise().shouldFail;
        });


        it('should should accept all the promises with callback', () => {
            let list = new List([
                () => Promise.resolve(),
                () => Promise.resolve()
            ]);
            return list.promise((callback) => callback());
        });
    });
});
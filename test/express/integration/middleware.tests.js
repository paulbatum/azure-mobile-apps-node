// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').expect,
    supertest = require('supertest-as-promised'),
    app = require('express')(),
    mobileApp = require('../../..')();

describe('azure-mobile-apps.express.integration.middleware', function () {
    it('read middleware is mounted in the correct order', function () {
        test('read');
    });

    it('insert middleware is mounted in the correct order', function () {
        test('insert');
    });

    it('update middleware is mounted in the correct order', function () {
        test('update');
    });

    it('delete middleware is mounted in the correct order', function () {
        test('delete');
    });

    function test(operation) {
        var results = [];

        mobileApp.use(appendResult(1));

        var table = mobileApp.table();
        table.use(appendResult(2), table.execute, appendResult(5));
        table[operation].use(appendResult(3), table.operation, appendResult(4));
        mobileApp.tables.add('test', table);
        app.use(mobileApp);

        return supertest(app)
            .get('/tables/test')
            .expect(200)
            .then(function (res) {
                expect(results).to.deep.equal([1, 2, 3, 4, 5]);
            });

        function appendResult(result) {
            return function (req, res, next) {
                results.push(result);
                next();
            }
        }
    }
});

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import registerHelper from 'ember-intl/utils/register-helper';
import formatTimeHelper from 'ember-intl/helpers/format-time';
import { runAppend, runDestroy } from '../helpers/run-append';
import createIntlBlock from '../helpers/create-intl-block';

var dateStr   = 'Thu Jan 23 2014 18:00:44 GMT-0500 (EST)';
var timeStamp = 1390518044403;
var view;

moduleFor('ember-intl@formatter:format-time', {
    needs: ['service:intl'],
    beforeEach() {
        registerHelper('format-time', formatTimeHelper, this.container);
        this.container.injection('formatter', 'intl', 'service:intl');
        this.intlBlock = createIntlBlock(this.container);
    },
    afterEach() {
        runDestroy(view);
    }
});

test('exists', function(assert) {
    assert.expect(1);
    assert.ok(formatTimeHelper);
});

test('invoke formatTime directly with format', function(assert) {
    assert.expect(1);
    var service = this.container.lookup('service:intl');
    this.container.unregister('formats:main');
    this.container.register('formats:main', {
        time: {
            test: {
                timeZone: 'UTC',
                locale: 'fr-fr'
            }
        }
    }, { instantiate: false });

    assert.equal(service.formatTime(timeStamp, {
        format: 'test'
    }), '23/1/2014');

    this.container.unregister('formats:main');
});

test('invoke formatTime directly', function(assert) {
    assert.expect(1);
    var service = this.container.lookup('service:intl');
    assert.equal(service.formatTime(timeStamp, {
        timeZone: 'UTC',
        locale: 'fr-fr'
    }), '23/1/2014');
});

test('should throw if called with out a value', function(assert) {
    assert.expect(1);
    view = this.intlBlock('{{format-time}}');
    assert.throws(runAppend(view), Error, 'raised error when not value is passed to format-time');
});

test('it should return a formatted string from a date string', function(assert) {
    assert.expect(1);

    // Must provide `timeZone` because: https://github.com/yahoo/ember-intl/issues/21
    view = this.intlBlock(`{{format-time '${dateStr}' timeZone='UTC'}}`, { locale: 'en-us' });
    runAppend(view);
    assert.equal(view.$().text(), '1/23/2014');
});

test('it should return a formatted string from a timestamp', function(assert) {
    assert.expect(1);

    // Must provide `timeZone` because: https://github.com/yahoo/ember-intl/issues/21
    view = this.intlBlock(`{{format-time ${timeStamp} timeZone='UTC'}}`, { locale: 'en-us' });
    runAppend(view);
    assert.equal(view.$().text(), '1/23/2014');
});

test('it should return a formatted string of just the time', function(assert) {
    assert.expect(1);

    view = this.intlBlock(`{{format-time ${timeStamp} hour='numeric' minute='numeric' timeZone='UTC'}}`, { locale: 'en-us' });
    runAppend(view);
    assert.equal(view.$().text(), '11:00 PM');
});

test('it should format the epoch timestamp', function(assert) {
    assert.expect(1);
    let locale = 'en-us';
    view = this.intlBlock('{{format-time 0}}', { locale: locale });
    runAppend(view);
    assert.equal(view.$().text(), new Intl.DateTimeFormat(locale).format(0));
});

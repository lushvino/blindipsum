var test = require('tap').test;

var blindipsum = require('./../');
var ipsum = blindipsum({});
var dict = require('./../data/dictionary');


test('html output', function (t) {
   t.plan(1);
   ipsum.setDictionary(dict);
   var html = ipsum.generate({count: 5, unit: 'sentance', format: 'html'})
   t.type(html, 'string')
   t.end();
});
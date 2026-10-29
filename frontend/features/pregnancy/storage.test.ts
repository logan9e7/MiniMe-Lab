import test from 'node:test';
import assert from 'node:assert/strict';
import {validDate,parseRecords,localDate} from './storage.ts';

test('calendar dates reject normalization and accept leap days',()=>{
 assert.equal(validDate('2026-02-30'),false);
 assert.equal(validDate('2027-02-29'),false);
 assert.equal(validDate('2028-02-29'),true);
 assert.equal(validDate(''),false);
});
test('malformed records do not discard valid neighboring check-ins',()=>{
 const good={date:'2026-10-29',symptoms:'Tired',notes:'Ask at appointment'};
 assert.deepEqual(parseRecords(JSON.stringify({dueDate:'2026-02-30',checkins:[null,{},good,{...good,notes:'x'.repeat(501)}]})),{dueDate:'',checkins:[good]});
});
test('invalid payload rejected and record count bounded',()=>{
 assert.throws(()=>parseRecords('null'));
 assert.throws(()=>parseRecords('{"checkins":{}}'));
 assert.equal(parseRecords(JSON.stringify({checkins:Array(301).fill({date:'2026-10-29',symptoms:'',notes:''})})).checkins.length,300);
});
test('local date uses calendar fields',()=>{
 assert.equal(localDate(new Date(2026,9,29,0,5)),'2026-10-29');
});

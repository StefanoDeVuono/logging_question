import test from 'ava'
import {merge, byDate} from './sync-sorted-merge'

function Entry (date) {
  this.date = date
}
Entry.prototype.pop = function () {
  return this.date;
};

const duplicateLog = new Entry(new Date('2017-06-13'));

const log = new Entry(new Date('2017-05-13'));

const earlyLog = new Entry(new Date('2017-01-13'));

const lateLog = new Entry(new Date('2017-10-13'));

const oddList = [
  new Entry(new Date('2017-07-13')),
  new Entry(new Date('2017-06-13')),
  new Entry(new Date('2017-02-13'))
]

const evenList = [
  new Entry(new Date('2017-07-13')),
  new Entry(new Date('2017-06-13')),
  new Entry(new Date('2017-03-13')),
  new Entry(new Date('2017-02-13'))
]

const unsortedList = [
  new Entry(new Date('2017-03-13')),
  new Entry(new Date('2017-06-13')),
  new Entry(new Date('2017-02-13')),
  new Entry(new Date('2017-07-13'))
]

test('should sort a log list', t => {
  t.deepEqual(unsortedList.sort(byDate), evenList);
});

test('should insert log into odd list', t => {
  t.deepEqual(merge(log, oddList), [log, ...oddList].sort(byDate))
})

test('should insert log into even list', t => {
  t.deepEqual(merge(log, evenList), [log, ...evenList].sort(byDate))
})

test('should insert duplicate times log into odd list', t => {
  t.deepEqual(merge(duplicateLog, oddList), [duplicateLog, ...oddList].sort(byDate))
})

test('should insert duplicate times log into even list', t => {
  t.deepEqual(merge(duplicateLog, evenList), [duplicateLog, ...evenList].sort(byDate))
})

test('should insert early log into odd list', t => {
  t.deepEqual(merge(earlyLog, oddList), [earlyLog, ...oddList].sort(byDate))
})

test('should insert early log into even list', t => {
  t.deepEqual(merge(earlyLog, evenList), [earlyLog, ...evenList].sort(byDate))
})

test('should insert late log into odd list', t => {
  t.deepEqual(merge(lateLog, oddList), [lateLog, ...oddList].sort(byDate))
})

test('should insert late log into even list', t => {
  t.deepEqual(merge(lateLog, evenList), [lateLog, ...evenList].sort(byDate))
})

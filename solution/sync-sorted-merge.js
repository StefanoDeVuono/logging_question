'use strict'

const merge = (log, list, start = 0, end = list.length - 1) => {
  let split = start + ((end - start) >>> 1);
  if (list.length == 0) {
    return [log];
  }
  const logDate = Date.parse(log.date),
        listSplitDate = Date.parse(list[split].date),
        listStartDate = Date.parse(list[start].date),
        listEndDate = Date.parse(list[end].date);

  if (logDate <= listEndDate) {
    return [...list.slice(0, end + 1), log, ...list.slice(end + 1)]
  }
  if (logDate >= listStartDate) {//!!
    return [...list.slice(0,start), log, ...list.slice(start)]
  }
  if (logDate >= listSplitDate) {
    return merge(log, list, start, split);
  } else {
    return merge(log, list, split + 1, end);
  }
}

//oldest at end
const byDate = (a, b) => Date.parse(b.date) -  Date.parse(a.date);

const addIndex = (source, index) => {
  const logEntry = source.pop();
  return logEntry ? Object.assign({index}, logEntry) : false;
}

module.exports = (logSources, printer) => {
  // sort all log sources and add indexes
  let lastLogs = logSources.map(addIndex).sort(byDate);

  while (lastLogs.length > 0) {
    let oldestEntry = lastLogs.pop();
    if (oldestEntry) {
      let index = oldestEntry.index;
      printer.print(oldestEntry);

      let unsortedSource = addIndex(logSources[index], index);

      if (unsortedSource) {
        lastLogs = merge(unsortedSource, lastLogs);
      }
    }
  }
  printer.done();

};

module.exports.merge = merge;
module.exports.byDate = byDate;

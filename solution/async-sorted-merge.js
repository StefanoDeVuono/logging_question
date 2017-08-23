'use strict'

const { byDate, merge } = require('./sync-sorted-merge');


const addIndex = async (source, index) => {
  const logEntry = await source.popAsync();
  return logEntry ? Object.assign({index}, logEntry) : false;
}

module.exports = async (logSources, printer) => {
  // add indexes to logs
  let indexedLogs = await Promise.all(logSources.map(addIndex));
  // sort logs
  let lastLogs = indexedLogs.sort(byDate);
  while (lastLogs.length > 0) { // as long as there are logs
    let oldestEntry = lastLogs.pop();
    if (oldestEntry) { // as long as there's a log entry
      let index = oldestEntry.index;
      printer.print(oldestEntry);

      let unsortedSource = await addIndex(logSources[index], index);

      if (unsortedSource) { // if it exists merge unsortedSource back into logs
        lastLogs = merge(unsortedSource, lastLogs);
      }
    }
  }
  printer.done();
}

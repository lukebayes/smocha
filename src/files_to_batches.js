const os = require('os');

function filesToBatches(list, opt_coreCount) {
  const batchCount = Math.min(list.length, opt_coreCount || os.cpus().length);
  const fileCount = list == null ? 0 : list.length;
  const batchSize = Math.ceil(fileCount / batchCount);

  if (!fileCount || batchCount < 1) {
    return [];
  }

  const result = new Array(Math.ceil(fileCount / batchSize));

  let index = 0;
  // Initialize the batch collection.
  while (index < batchCount) {
    result[index] = [];
    index++;
  }

  list.forEach((file, index) => {
    const bIndex = index % batchCount;
    result[bIndex].push(file);
  });

  return result;
}

module.exports = filesToBatches;


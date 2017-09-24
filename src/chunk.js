const os = require('os');

/**
 * Given the provided Array, return a new Array that has separated it into
 * chunks, ensuring that the elements that are nearest the beginning of
 * the initial collection will also be at the beginning of each chunk of the
 * returned Array.
 */
function chunk(list, opt_coreCount) {
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

module.exports = chunk;


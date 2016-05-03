'use strict';

const chokidar = require('chokidar');

// `pattern` is an "anymatch" pattern (e.g. a glob or array of globs):
// https://www.npmjs.com/package/anymatch
//
// `callback` is called with `(err, {paths})` when the scan is done.
exports.scan = (pattern, callback) => {
  return doScan(pattern, callback);
};

// Like `scan`, but if the readyCallback succeeds, will watch for changes
// to the files matching `pattern` (or new files matching `pattern`!)
// and call `changedCallback(err, {path})` if it detects a change (with the
// `path` property saying where the change happened, in case the caller is
// curious).  The change callback only fires once.  Any change causes the
// watchers to be torn down, at which point you have to call `watch` again.
exports.watch = (pattern, readyCallback, changedCallback) => {
  return doScan(pattern, readyCallback, changedCallback);
};

function doScan(pattern, readyCallback, opt_changedCallback) {
  // if there's no changedCallback, we're always "done" as soon as we're "ready"
  let isReady = false;
  let isDone = false;
  const paths = [];
  const watcher = chokidar.watch(pattern, {
    persistent: !!opt_changedCallback,
  });

  watcher.on('ready', () => {
    isReady = true;
    if (!opt_changedCallback) {
      isDone = true;
      watcher.close();
    }
    readyCallback(null, {
      paths: paths,
    });
  });

  watcher.on('error', error => {
    if (!isDone) {
      isDone = true;
      watcher.close();
      if (isReady) {
        if (opt_changedCallback) {
          opt_changedCallback(error);
        }
      } else {
        readyCallback(error);
      }
    }
  });

  watcher.on('add', path => {
    if (!isReady && !isDone) {
      paths.push(path);
    }
  });

  const onFileEvent = path => {
    if (isReady && !isDone) {
      isDone = true;
      watcher.close();
      opt_changedCallback(null, {path: path});
    }
  };

  if (opt_changedCallback) {
    watcher.on('add', onFileEvent);
    watcher.on('change', onFileEvent);
    watcher.on('unlink', onFileEvent);
  }
}

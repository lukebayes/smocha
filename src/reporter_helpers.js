'use strict';

const diff = require('diff');
const tty = require('tty');


// Functions that sniff the global environment
const sniff = {
  isTty() {
    return tty.isatty(1) && tty.isatty(2);
  },
  isWindows() {
    return process.platform === 'win32';
  },
  isBrowser() {
    // set by require('browser') polyfill?
    return !!process.browser;
  },
  terminalWidth() {
    let width = null;
    if (sniff.isTty()) {
      if (process.stdout.getWindowSize) {
        width = process.stdout.getWindowSize(1)[0];
      } else {
        width = tty.getWindowSize()[1];
      }
    }
    return width || 75;
  },
  isColorSupport() {
    return !sniff.isBrowser() && sniff.isTty() &&
      (sniff.isWindows() || ('COLORTERM' in process.env) ||
       /^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM));
  }
};

exports.terminalWidth = () => {
  return sniff.terminalWidth();
};

exports.useColors = () => {
  return sniff.isColorSupport() || (
    (typeof process.env.MOCHA_COLORS !== 'undefined') && !sniff.isBrowser());
};

exports.symbols = () => {
  if (sniff.isWindows()) {
    // With node.js on Windows: use symbols available in terminal default fonts
    return {
      ok: '\u221A', // "square root"
      err: '\u00D7', // "multiplication sign"
      dot: '․',
    };
  } else {
    return {
      ok: '\u2713', // "check mark"
      err: '\u2716', // "heavy multiplication x"
      dot: '․',
    };
  }
};

// copied from Mocha
const COLORS = {
  pass: 90,
  fail: 31,
  'bright pass': 92,
  'bright fail': 91,
  'bright yellow': 93,
  pending: 36,
  suite: 0,
  'error title': 0,
  'error message': 31,
  'error stack': 90,
  checkmark: 32,
  fast: 90,
  medium: 33,
  slow: 31,
  green: 32,
  light: 90,
  'diff gutter': 90,
  'diff added': 32,
  'diff removed': 31
};

function colorize(colorName, str) {
  str = String(str);
  if (exports.useColors()) {
    return '\u001b[' + COLORS[colorName] + 'm' + str + '\u001b[0m';
  } else {
    return str;
  }
};

exports.colorize = colorize;

exports.escapeInvisibles = str => {
  return str.replace(/\t/g, '<tab>')
    .replace(/\r/g, '<CR>')
    .replace(/\n/g, '<LF>\n');
};

exports.unifiedDiff = (actual, expected) => {
  const patch = diff.createPatch('string', actual, expected);
  const lines = patch.split('\n').slice(4).filter(
    line => !(/^@@/.test(line) || /^\\ No newline/.test(line))).map(
      line => {
        if (line[0] === '+') {
          return colorize('diff added', line);
        } else if (line[0] === '-') {
          return colorize('diff removed', line);
        } else {
          return line;
        }
      });
  return (
    colorize('diff added', '+ expected') + ' '
      + colorize('diff removed', '- actual')
      + '\n\n'
      + lines.join('\n'));
};

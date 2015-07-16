#!/usr/bin/env node

'use strict';

var program = require('commander'),
    _ = require('lodash'),
    Pattern = require('./core/compiler/pattern'),
    fs = require('fs-extra'),
    chokidar = require('chokidar'),
    chalk = require('chalk');

// CLI
var cliPatterns = require('./core/cli/patterns'),
    cliBuild = require('./core/cli/build');
var log = console.log.bind(console);

program
  .version('0.0.1')
  .option('-b, --build', 'Build app')
  .option('-p, --patterns', 'Compile patterns')
  .option('-w, --watch', 'Watch and compile patterns on change')
  .parse(process.argv);

var Stylizer = require('./core/compiler/stylizer.js');

// Compile patterns
if (program.patterns) {
  cliPatterns.run();
}


// Build app
if (program.build) {
  cliBuild.run();
}

// Watch patterns
if (program.watch) {
  log(chalk.green('Watching'));
  var watcher = chokidar.watch(__dirname + '/src/patterns', {
    usePolling: true,
    persistent: true,
    ignored: /[\/\\]\./,
  });

  watcher.on('change', function(path, stats) {
    cliPatterns.run();
    log(chalk.green('Updated', path));
  });

  watcher.on('add', function(path, stats) {
    cliBuild.run();
    cliPatterns.run();
    log(chalk.green('Added', path));
  });
}

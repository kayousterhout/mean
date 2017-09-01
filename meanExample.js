const process = require('process');
const quilt = require('@quilt/quilt');
const Mean = require('./mean.js');
const utils = require('./utils.js');

let nodeRepository = 'https://github.com/quilt/node-todo.git';
console.log(process.argv.length);
if (process.argv.length > 1) {
  nodeRepository = process.argv[1];
}

// Replication to use for the node application
// and Mongo.
const count = 2;
const infrastructure = quilt.createDeployment();

const machine = new quilt.Machine({
  provider: 'Amazon',
  cpu: new quilt.Range(1),
  ram: new quilt.Range(2),
});

utils.addSshKey(machine);

infrastructure.deploy(machine.asMaster());
infrastructure.deploy(machine.asWorker().replicate(count));

const mean = new Mean(count, nodeRepository);
infrastructure.deploy(mean);

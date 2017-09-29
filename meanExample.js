const quilt = require('@quilt/quilt');
const Mean = require('./mean.js');
const utils = require('./utils.js');

// Replication to use for the node application
// and Mongo.
const count = 2;

const machine = new quilt.Machine({
  provider: 'Amazon',
  cpu: new quilt.Range(1),
  ram: new quilt.Range(2),
});

utils.addSshKey(machine);

// A few questions:
// (1) Can you add workers later?  I can imagine this potentially
//     being something we'd want to add.
// (2) Another idea I had was to take a worker machine and a count,
//     since we're not sophisticated about scheduling, so users may
//     find it misleading if they create a few types of worker machines.
//     But then I realized that makes placement not work.
// (3) Floating IPs seem a bit ugly here, since the user still has to
//     pull out one of these workers and assign it a floating IP
//     (I guess this applies to placement constraints in general?).
//     This is a little uglier here because all of the workers are
//     added when the deployment is created, so a blueprint couldn't,
//     for example, take in the deployment, and add one worker with a
//     floating IP that's specific to the deployment.  I wonder if this
//     is a deeper problem with the current floating IP API though.
const infrastructure = quilt.createDeployment(machine, machine.replicate(count));

const nodeRepository = 'https://github.com/quilt/node-todo.git';
const mean = new Mean(count, nodeRepository);
infrastructure.deploy(mean);

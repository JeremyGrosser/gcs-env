#!/usr/bin/env node
const gcs_env = require('./gcs-env');
const spawn = require('cross-spawn');
const argv = require('yargs')
    .scriptName('gcs-env-run')
    .usage('$0 [args]')
    .option('bucket', {
        alias: 'b',
        type: 'string',
        demandOption: true,
    })
    .option('environment', {
        alias: 'e',
        type: 'string',
    })
    .help()
    .argv;

gcs_env.config(argv.bucket, argv.environment).then(env => {
    if(env) {
        spawn('cross-env', [...env, ...(argv._)], {
            stdio: 'inherit',
        }).on('exit', code => {
            process.exit(code)
        });
    }else{
        console.error('gcs-env: Unable to determine projectId and no environment was specified, aborting');
        process.exit(1);
    }
});

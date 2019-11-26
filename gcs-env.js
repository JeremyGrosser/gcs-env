const {Storage} = require('@google-cloud/storage');
const got = require('got');


async function gcsEnvironmentVariables(bucketName, envName) {
    const storage = new Storage();

    const options = {
        prefix: envName + '/',
    };
    
    return storage.bucket(bucketName).getFiles(options).then(files => {
        const env = files[0].map(file => {
            return file.download().then(contents => {
                return {
                    name: file.name.substring(envName.length + 1),
                    value: contents,
                };
            });
        });
        console.log('gcs-env: Loaded ' + env.length + ' environment variables from gs://' + bucketName + '/' + envName + '/');
        return Promise.all(env);
    });
}


async function getProjectId () {
    const METADATA_PROJECT_ID_URL =
      'http://metadata.google.internal/computeMetadata/v1/project/project-id';
    const options = {
        headers: {
            'Metadata-Flavor': 'Google',
        },
    };

    return await got(METADATA_PROJECT_ID_URL, options);
};

function stringifyEnvironment(env) {
    const envstr = [];
    env.forEach(envvar => {
        envstr.push(`${envvar.name}="${envvar.value}"`);
    });
    return envstr;
}

function config(bucket, environment) {
    if(environment) {
        return gcsEnvironmentVariables(bucket, environment)
            .then(stringifyEnvironment);
    }else{
        return getProjectId().then(response => {
            const projectId = response.body;
            return gcsEnvironmentVariables(bucket, projectId)
                .then(stringifyEnvironment);
        }).catch(err => {
            console.error('gcs-env: Failed to connect to the metadata service');
        });
    }
}


module.exports = {
    config: config,
};

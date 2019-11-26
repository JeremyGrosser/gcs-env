# gcs-env
Populate environment variables based on values stored in a Google Cloud Storage bucket.

    Usage: gcs-env -b bucket [-e environment] <command> [args...]

        bucket      GCS bucket your environment variables are stored in
        environment Name of this environment, used as a prefix when reading from
                    the bucket. If environment is not specified, gcs-env will
                    attempt to connect to the Compute Engine Metadata service and use the current
                    project ID as the environment name.
        command     Command to execute
        args        Optional arguments to be passed to command


## Example
You must be authenticated with a Google Cloud account for this to work. Run `gcloud auth login` or read [Getting Started with Authentication](https://cloud.google.com/docs/authentication/getting-started) for information on using application default credentials.

    echo -n "supersecretpassword" >SECRET_VARIABLE_NAME
    gsutil mb gs://example-env
    gsutil cp SECRET_VARIABLE_NAME gs://example-env/exampleprojectid/SECRET_VARIABLE_NAME
    gcs-env -b example-env -e exampleprojectid -- /bin/sh -c 'echo ${SECRET_VARIABLE_NAME}'

You should configure permissions on the GCS bucket or individual objects to limit who can read and modify your secrets!

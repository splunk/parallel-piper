# Parallel Piper

Simple mobile web app for sending data to a Splunk HTTP input. It measures the device motion and sends an event with 
the intensity of the motion to Splunk.

## Build/Deploy

1) Install NPM deps
```
npm install
```

2) Run webpack build

Run `build.sh` in the source directory.

```
$ sh build.sh
```

The following environment variables need to be defined for specifying the Splunk 
server running the HTTP input. 

- `PP_SPLUNK_HOST` (default is `"localhost"`)
- `PP_SPLUNK_PORT` (default is `8088`)
- `PP_SPLUNK_SSL` (default is `false`)
- `PP_SPLUNK_TOKEN` (required) token for the HTTP input

Then run the webpack build:

```
PP_SPLUNK_TOKEN=cafecafecafecafe \
PP_SPLUNK_HOST=my.host.com \
./node_modules/webpack/bin/webpack.js -p
```

This generates all the page, JS and all the static content in the `dist` directory. Simply
copy it to a webserver-exposed folder.
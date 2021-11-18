# Parallel Piper

Simple mobile web app for sending data to a Splunk HTTP input. It measures the device motion and sends an event with
the intensity of the motion to Splunk.

## Build/Deploy

1. Install NPM deps

```
npm install
```

2. Run webpack build

The following environment variables need to be defined for specifying the Splunk
server running the HTTP input.

- `PP_SPLUNK_HOST` (default is `"localhost"`)
- `PP_SPLUNK_PORT` (default is `8088`)
- `PP_SPLUNK_SSL` (default is `false`)
- `PP_SPLUNK_TOKEN` (required) token for the HTTP input (See Splunk Setup below.)

Then run the webpack build:

```
PP_SPLUNK_TOKEN=cafecafecafecafe \
PP_SPLUNK_HOST=my.host.com \
npm run build
```

This generates all the page, JS and all the static content in the `dist` directory. Simply
copy it to a webserver-exposed folder.

Alternatively, you can also build a docker container serving the webpack build:

```
PP_SPLUNK_TOKEN=cafecafecafecafe PP_SPLUNK_HOST=my.host.com docker build -t shaker --build-arg PP_SPLUNK_TOKEN --build-arg PP_SPLUNK_HOST .
```

To run it on port 3000, call:

```
docker run -p 3000:3000 shaker
```

# Splunk Setup

To enable the splunk HTTP Event Collector and create a token follow the instructions posted here:
http://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector

Once you have your token make sure you update your `PP_SPLUNK_TOKEN` in the previous section.

Parallel Piper makes use of cross-origin resource sharing which requires you to enable CORS on the HTTP event collector.

To do this edit your `$SPLUNK_HOME/etc/system/local/server.conf` and add the following.

```
[httpServer]
crossOriginSharingPolicy = *
```

If you wish to restrict cors calls to a specific domain replace the asterix with the domain name your are hosting
Parallel Piper on.

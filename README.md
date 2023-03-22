# Parallel Piper

Simple mobile web app for sending data to a Splunk HTTP input. It measures the device motion and sends an event with
the intensity of the motion to Splunk.

## Development

Ensure that you have Node 16 installed. Then follow these steps:

1. Install NPM deps

```
npm install
```

2. Run webpack build

```
npm run build
```

This generates the page, JS and all the static content in the `dist` directory.

3. Run NodeJS server

```
npm start
```

This will start the server on http://localhost:3000/.

## Build

Github Actions are building a docker container for you on each commit to `main`.

You can also run the build locally by calling:

```
docker build -t shaker .
```

To run the image then on port 3000, call:

```
docker run -p 3000:3000 shaker
```

> Note: Just running the image, it is not forwarding the events to a Splunk instance. For this, you have to set environment variables, which are specified in the next section.

## Deployment

The following environment variables need to be defined for specifying the Splunk
server that should receive the events:

- `PP_SPLUNK_HOST` (default is `"localhost"`)
- `PP_SPLUNK_PORT` (default is `8088`)
- `PP_SPLUNK_SSL` (default is `false`)
- `PP_SPLUNK_TOKEN` (required) token for the HTTP input (See Splunk Setup below.)

Usually you will set these environment variables in your deployment descriptor. The folder [`kubernetes-manifests`](./kubernetes-manifests/) contains a sample deployment descriptor for Kubernetes based on the [Splunk Operator](https://splunk.github.io/splunk-operator/).

You can apply it by calling:

```
kubectl apply -f ./kubernetes-manifests/
```

If you're using this example descriptor in production, make sure to change the `PP_SPLUNK_TOKEN` environment variable and match it with the `SPLUNK_HEC_TOKEN` configuration.

> **Note**: The mobile Chrome browser is not supporting [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent) over HTTP, therefore ensure that this app is served via HTTPS. As the docker image doesn't do any TLS termination, make sure that the Kubernetes ingress controller (e.g. [AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.4/) for EKS) is doing this for you.

For testing, you can also run the image locally and set the environment variables:

```
docker run -p 3000:3000 -e PP_SPLUNK_TOKEN=cafecafecafecafe -e PP_SPLUNK_HOST=my.host.com shaker
```

# Splunk Setup

To enable the splunk HTTP Event Collector and create a token follow the instructions posted here:
http://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector

Once you have your token make sure you update your `PP_SPLUNK_TOKEN` environment variable.

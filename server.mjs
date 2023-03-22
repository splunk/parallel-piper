import url from "url";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import fetch from "node-fetch";
import https from "https";

const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static assets
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "dist")));

// get configuration from environment variables
const SPLUNK_HOST = process.env.PP_SPLUNK_HOST || "localhost";
const SPLUNK_PORT = process.env.PP_SPLUNK_PORT || 8088;
const SPLUNK_TOKEN = process.env.PP_SPLUNK_TOKEN;
const isSSL = process.env.PP_SPLUNK_SSL == "true";
const protocol = isSSL ? "https://" : "http://";
const targetUrl = `${protocol}${SPLUNK_HOST}:${SPLUNK_PORT}/services/collector`;

if (!SPLUNK_TOKEN) {
  console.warn(
    "Environment variable PP_SPLUNK_TOKEN is not set. Can't forward to Splunk HEC."
  );
} else {
  console.log(`Forwarding events to Splunk HEC at ${targetUrl}`);
}

// REST API endpoint
app.post("/event", async (req, res) => {
  const eventData = req.body;
  // get the IP of the calling client
  eventData.clientIp =
    req.header("X-Forwarded-For") || req.socket.remoteAddress;
  console.log("Received event data:", eventData);

  if (!SPLUNK_TOKEN) {
    console.warn(
      "Environment variable PP_SPLUNK_TOKEN is not set. Can't forward to Splunk HEC."
    );
    res
      .status(200)
      .send(
        "Event received but cannot forward as Splunk HEC is not configured"
      );
    return;
  }
  // Forward the event data to another server
  try {
    // Create a custom https.Agent to allow self-signed certificates
    const agent = isSSL
      ? new https.Agent({
          rejectUnauthorized: false,
        })
      : undefined;

    const forwardResponse = await fetch(targetUrl, {
      agent: agent,
      method: "POST",
      headers: {
        Authorization: `Splunk ${SPLUNK_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: eventData,
        sourcetype: "manual",
      }),
    });

    if (forwardResponse.ok) {
      console.log(`Event data forwarded successfully to ${targetUrl}`);
      res.status(200).send("Event received and forwarded");
    } else {
      throw new Error(forwardResponse.statusText);
    }
  } catch (error) {
    console.error("Error forwarding event data:", error);
    res
      .status(500)
      .send("Error forwarding event data. Check Splunk HEC configuration.");
  }
});

// Set the port for the server
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

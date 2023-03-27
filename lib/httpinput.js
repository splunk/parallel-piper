import $ from "jquery";

export default class SplunkHttp {
  constructor({ host, port = 8088, ssl = true, token = null }) {
    let proto = ssl ? "https" : "http";
    this.url = `${proto}://${host}:${port}/services/collector`;
    this.token = token;
  }

  send(data) {
    return new Promise((resolve, reject) =>
      $.ajax({
        method: "POST",
        url: this.url,
        data: JSON.stringify({ event: data }),
        headers: {
          Authorization: `Splunk ${this.token}`,
        },
        success: (data, status, xhr) => resolve(data),
        error: (xhr, status, error) => reject(error),
      })
    );
  }
}

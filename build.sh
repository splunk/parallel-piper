rm -rf dist/*

export PP_SPLUNK_HOST=http-inputs-parallelpiper.splunkcloud.com
export PP_SPLUNK_PORT=8088
export PP_SPLUNK_SSL=true
export PP_SPLUNK_TOKEN=1FD79E2B-019C-4A32-B903-CFFFB7E8ADEA

./node_modules/webpack/bin/webpack.js -p --progress

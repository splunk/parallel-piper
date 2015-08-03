rm -rf dist/*

PP_SPLUNK_HOST=http-inputs-parallelpiper.splunkcloud.com \
PP_SPLUNK_PORT=8088 \
PP_SPLUNK_SSL=true \
PP_SPLUNK_TOKEN=1FD79E2B-019C-4A32-B903-CFFFB7E8ADEA \
./node_modules/webpack/bin/webpack.js -p --progress

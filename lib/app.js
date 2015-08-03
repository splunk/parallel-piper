import $ from 'jquery';
import DeviceMotion from 'motion';
import SplunkHttp from 'httpinput';
import Page from 'page';
import vdom from 'vdom';
import State from 'state';
import renderSteps, {bindStepDomEvents} from 'components/steps';
import renderMotionState from 'components/motionstate';
import renderDeviceNotSupported from 'components/notsupported';
import renderNoMotionDetected from 'components/nomotion';
import renderDebugUI, {bindDebugDomEvents} from 'components/debug';
import {deviceSupportSummary} from 'featurecheck';

import 'normalize.css';
import 'app.less';
import 'sprites.less';

State.bootstrap();

function renderAppState(state) {
    if (state.deviceNotSupported) {
        return renderDeviceNotSupported(state);
    }
    if (state.setupMode) {
        return renderSteps(state);
    }
    if (!state.motionDetected) {
        return renderNoMotionDetected(state);
    } else {
        return renderMotionState(state);
    }
}

let page = new Page(state =>
        <div className="ct">
            {renderAppState(state)}
            {renderDebugUI(state)}
            <div className="splunk-logo font-icon">splunk&gt;</div>
        </div>
);
page.render(document.body, State.cur() || {});
State.on('change', state => page.update(state || {}));

bindStepDomEvents();
bindDebugDomEvents();

let eventSink = new SplunkHttp({
    host: SPLUNK_HOST,
    port: SPLUNK_PORT,
    ssl: SPLUNK_SSL,
    token: SPLUNK_TOKEN
});

function createEventPayload(attributes) {
    return Object.assign({
        uid: State.get('uid'),
        userAgent: navigator.userAgent,
        state: State.get('selectedState'),
        name: State.get('name')
    }, attributes);
}

if (DeviceMotion.supported()) {
    DeviceMotion.measure((acceleration, receivedMotion) => {
        State.recordAcceleration(acceleration, receivedMotion);
        if (acceleration > 0 && !State.get('setupMode')) {
            eventSink.send(createEventPayload({
                acceleration: acceleration
            }));
        }
    });
}

State.when('deviceNotSupported').then(notSupported => {
    if (notSupported) {
        eventSink.send(createEventPayload({
            support: deviceSupportSummary()
        }))
    }
});

State.when('setupComplete').then(() => {
    if (!State.get('motionDetected')) {
        eventSink.send(createEventPayload({
            nomotion: true
        }))
    }
});
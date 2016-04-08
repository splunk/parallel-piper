import $ from 'jquery';
import DeviceMotion from 'motion';
import SplunkHttp from 'httpinput';
import Page from 'page';
import vdom from 'vdom';
import State from 'state';
import renderSetup, {bindSetupDomEvents} from 'components/setup';
import renderMotionState from 'components/motionstate';
import renderDeviceNotSupported from 'components/notsupported';
import renderNoMotionDetected from 'components/nomotion';
import renderDebugUI, {bindDebugDomEvents} from 'components/debug';
import {deviceSupportSummary} from 'featurecheck';
import _ from 'underscore';

import 'normalize.css';
import 'app.less';
import 'sprites.less';

State.bootstrap();

function renderAppState(state) {
    if (state.deviceNotSupported) {
        return renderDeviceNotSupported(state);
    }
    if (state.setupMode) {
        return renderSetup(state);
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

let renderPending = false;
State.on('change', () => {
    if (!renderPending) {
        requestAnimationFrame(() => {
            page.update(State.cur() || {});
            renderPending = false;
        });
        renderPending = true;
    }
});

bindSetupDomEvents();
bindDebugDomEvents();

let eventSink = new SplunkHttp({
    host: SPLUNK_HOST,
    port: SPLUNK_PORT,
    ssl: SPLUNK_SSL,
    token: SPLUNK_TOKEN
});

let lastMotionEvent = null;

function createEventPayload(attributes) {
    return Object.assign({
        uid: State.get('uid'),
        userAgent: navigator.userAgent,
        answer: State.get('answer'),
        name: State.get('name'),
        motionEvent: lastMotionEvent
    }, attributes);
}

if (DeviceMotion.supported()) {
    DeviceMotion.measure((acceleration, receivedMotion) => {
        State.recordAcceleration(acceleration, receivedMotion);
        if (acceleration > 0 && !State.get('setupMode')) {
            var data = createEventPayload({});
            eventSink.send(data);
        }
    });

    let lastAnswerUpdate = 0;
    DeviceMotion.listen(e => {
        const now = Date.now();
        if (now - lastAnswerUpdate > 250) {
            lastMotionEvent = e;
            State.set('answer', Math.abs(e.dm.gz) > 6 ? (e.dm.gz < 0 ? 'yes' : 'no') : '?');
            lastAnswerUpdate = now;
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

eventSink.send(createEventPayload({
    init: true
}));
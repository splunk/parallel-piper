import $ from 'jquery';
import DeviceMotion from 'motion';
import Page from 'page';
import vdom from 'vdom';
import State from 'state';
import renderSteps, { bindStepDomEvents } from 'components/steps';
import renderMotionState from 'components/motionstate';
import renderDeviceNotSupported from 'components/notsupported';
import renderNoMotionDetected from 'components/nomotion';
import renderDebugUI, { bindDebugDomEvents } from 'components/debug';
import { deviceSupportSummary } from 'featurecheck';

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

const sendEvent = async (eventData) => {
    try {
        const response = await fetch('/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        if (response.ok) {
            console.log(await response.text());
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        // TODO: show error to user
        console.error('Error sending event:', error);
    }
};

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
            sendEvent(createEventPayload({
                acceleration: acceleration
            }));
        }
    });
}

State.when('deviceNotSupported').then(notSupported => {
    if (notSupported) {
        sendEvent(createEventPayload({
            support: deviceSupportSummary()
        }))
    }
});

State.when('setupComplete').then(() => {
    if (!State.get('motionDetected')) {
        sendEvent(createEventPayload({
            nomotion: true
        }))
    }
});
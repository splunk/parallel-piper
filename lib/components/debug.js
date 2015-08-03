import vdom from 'vdom';
import State from 'state';
import $ from 'jquery';
import './debug.less';

export default function(state) {
    return <div className="debug">
        <div className="debug-uuid">{state.uid}</div>
    </div>;
}

const DOUBLE_CLICK_THRESHOLD = 250;

export function bindDebugDomEvents() {
    let last = 0;
    $(document).delegate('.splunk-logo', 'click touchstart', e => {
        e.preventDefault();
        let now = Date.now();
        if (now - last < DOUBLE_CLICK_THRESHOLD) {
            if (confirm("Reset?")) {
                State.reset();
            }
        }
        last = now;
    });
}
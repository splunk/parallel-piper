import vdom from 'vdom';
import $ from 'jquery';
import "./steps.less";
import State from 'state';
import STATES from 'usstates';

function renderStateSelector(state) {
    if (state.stateSelected) {
        return <div>
            <div>Favorite US state:</div>
            <div className="selected-state">{STATES[state.selectedState]}</div>
        </div>;
    }
    return <div>
        <div>Favorite US state:</div>
        <select id="us-state">
            <option value="">Select...</option>
            {Object.keys(STATES).map(state => <option value={state}>{STATES[state]}</option>)}
        </select>
    </div>;
}

function renderNamePrompt(state) {
    if (state.nameSubmitted) {
        return <div className="submitted-name">{state.name ? <div>Name:
            <div className="name-val">{state.name}</div>
        </div> : "No name"}</div>;
    }
    return <div className="name-prompt">
        <label>
            Name or Team:
            {!state.stateSelected ? <span className="name">{state.name}</span> :
                <div className="name-input">
                    <input type="text" placeholder="Optional..."/>
                    <button className="no-name">No thanks</button>
                </div>}
        </label>
    </div>;
}

function renderStep(n, state, {active, done}, content) {
    n = String(n);
    return <section className={active ? 'step active' : 'step'} id={'step'+n}>
        <span className="step-label">{n}</span>
        {content(state)}
        {done ? <i className="icon icon-check"/> : null}
    </section>;
}

export default function renderSteps(state) {
    return <div className="steps">
        {renderStep(1, state, {active: !state.stateSelected, done: state.stateSelected}, renderStateSelector)}
        {renderStep(2, state, {
            active: !state.nameSubmitted && state.stateSelected,
            done: !!state.nameSubmitted
        }, renderNamePrompt)}
        {renderStep(3, state, {active: !!state.nameSubmitted}, state => <div className="shake-it">SHAKE</div>)}
    </div>;
}

export function bindStepDomEvents() {
    $(document).delegate('.steps #us-state', 'change', e => {
        var $select = $(e.currentTarget);
        let val = $select.val();
        State.applySelectedState(val);
    });

    $(document).delegate('.steps .name-prompt input', 'change', e => {
        var $input = $(e.currentTarget);
        var val = $input.val();
        if (!val) return;
        State.applyName(val);
    });

    $(document).delegate('.steps button.no-name', 'click', e => {
        State.applyName(null);
    });
}

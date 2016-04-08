import vdom from 'vdom';
import "./motionstate.less";


function formatTotalValue(val) {
    return String(val);
}

function motionSeverityClass(val) {
    const min = 5;
    const max = 80;
    let severity = Math.floor(Math.min(max - min - 1, Math.max(0, val - min)) / (max - min) * 8) + 1;
    return 'motion-severity-' + severity;
}

window.motionSeverityClass = motionSeverityClass;

function answerClass(val) {
    switch (val) {
        case 'yes':
            return 'answer-yes';
        case 'no':
            return 'answer-no';
        default:
            return 'answer-undecided';
    }
}

function answerLabel(val) {
    switch (val) {
        case 'yes':
            return 'Yes!';
        case 'no':
            return 'No!';
        default:
            return 'Hm?';
    }
}

export default function renderMotionState(state) {
    var containerClass = "motion-state " + answerClass(state.answer);

    return <div className={containerClass}>
        <div className="cur-name">{state.name}</div>
        <div className="answer">
            <div className="answer-label">Your answer:</div>
            <h2>{answerLabel(state.answer)}</h2>
            <div className="answer-help-text">
                Put the phone with the screen facing up for Yes, facing down for No.  
            </div>
        </div>
        <div>Acceleration:</div>
        <div className="current">
            <div className={"value " + motionSeverityClass(state.acceleration)}>{String(state.acceleration)}</div>
            <div className="unit">m/s²</div>
        </div>
    </div>;
}
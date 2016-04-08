import vdom from 'vdom';
import $ from 'jquery';
import "./setup.less";
import State from 'state';

function renderNamePrompt(state) {
    if (state.nameSubmitted) {
        return <div className="name-prompt">
            <div className="cur-name">
                {state.name}
            </div>
        </div>;
    }
    return <div className="name-prompt">
        <label>
            <div className="prompt-text">
                <div className="prompt-label">
                Enter your name 
                </div>
                <span className="prompt-sub">(or better your Twitter @handle)</span>
            </div>
            <div className="name-input">
                <input type="text" placeholder="Name..."/>
            </div>
        </label>
    </div>;
}

export default function renderSetup(state) {
    return <div className="setup">
        {renderNamePrompt(state)}
    </div>
}


export function bindSetupDomEvents() {
    $(document).delegate('.name-input input', 'change', e => {
        var $input = $(e.currentTarget);
        var val = $input.val();
        if (!val) return;
        State.applyName(val);
    });
    
    setTimeout(() => $('.name-input input').focus(), 500);
}
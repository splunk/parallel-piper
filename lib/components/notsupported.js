import vdom from 'vdom';
import "./notsupported.less";


export default function renderDeviceNotSupported(state) {
    return <div className="not-supported">
        <div className="item">
            <h3>Device not supported :(</h3>
            <p>
                It seems like your device does not support the necessary APIs for this demo application 
                to work. In particular the application listens to <code>ondevicemotion</code> events, which doesn't 
                seem to be supported in your browser.</p>
            {state.isPrivateBrowsing ? 
                <p>If your phone is in <b>private browsing mode</b>, it won't emit any motion data, which is necessary 
                    for this demo application to work.</p> 
                : null }
        </div>                                      
    </div>;
}
import vdom from "vdom";
import "./nomotion.less";

export default function renderNoMotionDetected(state) {
  return (
    <div className="no-motion">
      <div className="item">
        <h3>No motion I sense</h3>
        <p>
          Your device seems to support the APIs necessary to obtain the motion
          data, but it did not emit any data yet. Try moving your device - if it
          still doesn't work it might be lacking the necessary sensors to obtain
          the motion information.
        </p>
        {state.isPrivateBrowsing ? (
          <p>
            If your phone is in <b>private browsing mode</b>, it won't emit any
            motion data, which is necessary for this demo application to work.
          </p>
        ) : null}
      </div>
    </div>
  );
}

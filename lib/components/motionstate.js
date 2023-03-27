import vdom from "vdom";
import "./motionstate.less";

function formatTotalValue(val) {
  return String(val);
}

function motionSeverityClass(val) {
  const min = 15;
  const max = 80;
  let severity =
    Math.floor(
      (Math.min(max - min - 1, Math.max(0, val - min)) / (max - min)) * 8
    ) + 1;
  return "motion-severity-" + severity;
}

window.motionSeverityClass = motionSeverityClass;

export default function renderMotionState(state) {
  var containerClass =
    "motion-state " + motionSeverityClass(state.acceleration);

  return (
    <div className={containerClass}>
      <div className="current">
        <div className="value">{String(state.acceleration)}</div>
        <div className="unit">m/s²</div>
      </div>
      <div className="total">
        <span className="label">Total: </span>
        <span className="value">
          {formatTotalValue(state.totalAcceleration)}
        </span>
      </div>
    </div>
  );
}

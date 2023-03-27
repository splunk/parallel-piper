import vdom from "vdom";
import $ from "jquery";
import "./permission.less";
import { checkPermission } from "../featurecheck";
import State from "../state";

export default function renderPermissionCheck(state) {
  return (
    <div className="permission">
      {state.permissionNotGranted ? (
        <div className="item">
          <h3>Permission check failed.</h3>
          <p>Permission not granted. Please close browser and try again.</p>
        </div>
      ) : (
        <div className="item">
          <h3>Device requires permission check</h3>
          <p>
            Your using the Safari browser which requires an additional
            permission check. Please click the button below to check the
            permission.
          </p>
          <button className="check">Check permission</button>
        </div>
      )}
    </div>
  );
}

export function bindPermissionCheckDomEvents() {
  $(document).delegate(".permission button.check", "click", async () => {
    try {
      const response = await checkPermission();
      if (response == "granted") {
        State.set("needsPermissionCheck", false);
      } else {
        State.set("permissionNotGranted", true);
      }
    } catch (err) {
      console.log(err);
    }
  });
}

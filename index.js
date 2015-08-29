/* eslint-env es6 */

let { PrefsTarget } = require("sdk/preferences/event-target");
let { get, set, reset, getLocalized } = require("sdk/preferences/service");
let buttons = require("sdk/ui/button/toggle");
let panels = require("sdk/panel");
let tabs = require("sdk/tabs");

const pref = "intl.accept_languages";
const propFile = "chrome://global/locale/intl.properties";

let truncate = (s) => /[^-,]*/.exec(s.trim())[0].toLowerCase();
let read = () => get(pref) === propFile ? getLocalized(pref) : get(pref);

PrefsTarget({ branchName: pref })
  .on("", () => button.badge = truncate(read()));

let panel = panels.Panel({
  width: 220,
  height: 50,
  contentURL: "./panel.html",
  contentScriptFile: "./panel.js",
  onHide: () => button.state("window", { checked: false })
});

panel.port.on("return", (locale) => {
  panel.hide();
  locale = locale.trim();
  locale.length > 0 ? set(pref, locale) : reset(pref);
});

let button = buttons.ToggleButton({
  id: "quickAcceptLanguageSwitcher",
  label: "Quick Accept-Language Switcher",
  icon: "./icon.svg",
  badge: truncate(read()),
  onChange: (state) => {
    if (state.checked) {
      panel.show({ position: button });
      panel.port.emit("show", read());
    }
  }
});

let locale = "";

chrome.webRequest.onBeforeSendHeaders.addListener(
  details => {
    if (locale) {
      for (var header of details.requestHeaders) {
        if (header.name.toLowerCase() == "accept-language") {
          header.value = locale;
        }
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["http://*/*", "https://*/*"] },
  [ "blocking", "requestHeaders" ]
);

function setLocaleString(s) {
  locale = s.trim();
}

function getLocaleString() {
  return locale;
}

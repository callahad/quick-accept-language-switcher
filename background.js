let locale = "";

chrome.webRequest.onBeforeSendHeaders.addListener(
  details => {
    if (locale) {
      for (var header of details.requestHeaders) {
        if (header.name == "Accept-Language") {
          header.value = locale;
        }
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  [ "blocking", "requestHeaders" ]
);

function setLocaleString(s) {
  locale = s.trim();
}

function getLocaleString() {
  return locale;
}

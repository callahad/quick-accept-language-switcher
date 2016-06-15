{
  let input = document.getElementById('locale-input');

  let backgroundPage = chrome.extension.getBackgroundPage();

  let updateBadge = (text) => {
    let label = /[^-,]*/.exec(text.trim())[0].toLowerCase();
    chrome.browserAction.setBadgeText( { text: label });
  }

  input.value = backgroundPage.getLocaleString();

  input.select();

  input.addEventListener('input', e => {
    updateBadge(e.target.value)
  });

  input.addEventListener('input', e => {
    backgroundPage.setLocaleString(e.target.value);
  });

  input.addEventListener('keydown', e => {
    if (e.key === "Enter") { window.close(); }
  });
}

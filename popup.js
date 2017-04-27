{
  let input = document.getElementById('locale-input');

  let backgroundPage = chrome.extension.getBackgroundPage();

  let validAcceptLanguageStringRegex = /^[a-z]{1,8}(?:-[a-z]{1,8})?(?:;q=(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?))?(?:, *[a-z]{1,8}(?:-[a-z]{1,8})?(?:;q=(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?))?)*$/i;

  let assignWeights = (item, index, array) => {
    item = item.split(';q=');
    item[0] = item[0].trim();
    if (item.length === 1) {
      /* The default weight is 1: */
      item.push(1);
    }
    else {
      item[1] = parseFloat(item[1].trim());
    }
    array[index] = item;
  }

  let getHighestWeightedAcceptLanguage = (text) => {
    if (validAcceptLanguageStringRegex.test(text)) {
      let acceptLanguageString = text;
      let acceptLanguageSubstringArray = acceptLanguageString.split(',');
      acceptLanguageSubstringArray.forEach(assignWeights);
      let acceptLanguageSubstringArrayHighestWeight = null;
      let acceptLanguageSubstringArrayHighestWeightedItems = null;
      while (acceptLanguageSubstringArray.length > 0) {
        let acceptLanguageSubstringArrayItem = acceptLanguageSubstringArray.pop();
        let acceptLanguageSubstringArrayItemWeight = acceptLanguageSubstringArrayItem[1];
        if (acceptLanguageSubstringArrayItemWeight > acceptLanguageSubstringArrayHighestWeight || acceptLanguageSubstringArrayHighestWeight === null) {
          acceptLanguageSubstringArrayHighestWeight = acceptLanguageSubstringArrayItemWeight;
          acceptLanguageSubstringArrayHighestWeightedItems = [];
          acceptLanguageSubstringArrayHighestWeightedItems.push(acceptLanguageSubstringArrayItem[0]);
        }
        else if (acceptLanguageSubstringArrayItemWeight >= acceptLanguageSubstringArrayHighestWeight) {
          acceptLanguageSubstringArrayHighestWeightedItems.push(acceptLanguageSubstringArrayItem[0]);
        }
      }
      if (acceptLanguageSubstringArrayHighestWeight > 0) {
        if (acceptLanguageSubstringArrayHighestWeightedItems.length === 1) {
          /* One |accept-language| substring has the highest weight. */
          return acceptLanguageSubstringArrayHighestWeightedItems[0];
        }
        else {
          /* Multiple |accept-language| substrings have the highest weight. */
          return "mul";
        }
      }
      else {
        /* Zero |accept-language| substrings have a weight exceeding zero. */
        return 'q=0';
      }
    }
    /* The |accept-language| string is invalid. */
    return '⚠';
  }

  let updateBadge = (text) => {
    text = text.trim();
    let label = getHighestWeightedAcceptLanguage(text);
    chrome.browserAction.setBadgeText( { text: label });
  }

  input.value = backgroundPage.getLocaleString();

  input.select();

  input.addEventListener('input', e => {
    updateBadge(e.target.value);
  });

  input.addEventListener('input', e => {
    backgroundPage.setLocaleString(e.target.value);
  });

  input.addEventListener('keydown', e => {
    if (e.key === "Enter") { window.close(); }
  });
}
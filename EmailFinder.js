var properties = PropertiesService.getScriptProperties();


function getKey() {
  return properties.getProperty('key');
}

function saveValue(data) {
  properties.setProperty('key', data);
}

function clear_key() {
  properties.setProperty('key',"");
  let ui = SpreadsheetApp.getUi();
    ui.alert("Key deleted");
}

function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('API key')
      .addItem('ADD Key','keyMenu')
      .addToUi();
}

function keyMenu() {
  let html = HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('API Menu')
      .setWidth(300);
  SpreadsheetApp.getUi()
      .showSidebar(html);
}


function get_form_info(formObject) {
  let ui = SpreadsheetApp.getUi();
  if(formObject.key)
  {
    saveValue(formObject.key);
    ui.alert("Key saved");
  }
  else ui.alert("no key provided");
}

function findEmail(first_names,last_names,company) {

  let result = [];
  let key = getKey();

  if(!key)
  {
    return "No API key saved";
  }

  function domainCheck(domain) {
    if (!domain.includes('.')) {
      return "company";
    }
    else return "domain"
  }

  if(Array.isArray(first_names)&&Array.isArray(last_names)&&Array.isArray(company))
  {
    if(first_names.length === last_names.length && last_names.length === company.length)
    {
      for(let i = 0 ; i< first_names.length;i++)
      {
        try {
          let parameter = domainCheck(company[i]);
          let req = UrlFetchApp.fetch(`https://api.hunter.io/v2/email-finder?${parameter}=${company[i]}&first_name=${first_names[i]}&last_name=${last_names[i]}&api_key=${key}`)
          res = JSON.parse(req);
          result.push(res.data.email);
        } catch(error) {return 'ERROR : '+ error.message}
      }

    }
    else return "amount of arguments doesn't match";
  }
  else if(!Array.isArray(first_names)&&!Array.isArray(last_names)&&!Array.isArray(company))
  {
    try {

      let parameter = domainCheck(company);
      let req = UrlFetchApp.fetch(`https://api.hunter.io/v2/email-finder?${parameter}=${company}&first_name=${first_names}&last_name=${last_names}&api_key=${key}`)
      res = JSON.parse(req);
      result = (res.data.email);
    }

    catch (error) {return 'ERROR : '+ error.message};
  }

  if(result)return result;
  else return "email not found";
}

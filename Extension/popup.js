async function urlRequest(url){
  const response = await fetch(url);
  const responseJson = await response.json();
  return responseJson;
}

async function downloadFile(url, filePath) {
  const responseJson = await urlRequest(url);
  // console.log("JObj");
  // console.log(responseJson);

  var fullFileName = filePath + responseJson.filename;
  fullFileName = fullFileName.replace(":", "");

  console.log("Full Name");
  console.log(fullFileName);

  //*
  chrome.downloads.download({
    url: responseJson.url,
    filename: fullFileName, //Optional
  });
  //*/
}

async function downloadModule(moduleJson, runningFilePath){

}

async function downloadClass(classId, runningFilePath){
  console.log(runningFilePath);
  //For Each Module Download it
  var ulrOrigin = "https://canvas.wpi.edu";

  var modulesArray = await getModules(ulrOrigin, classId);

  // console.log(modulesArray);

  for(let j = 0; j < modulesArray.length; j++){
    console.log(modulesArray[i]);
    // downloadModule();
  }

}


async function deafultDownload(){
  console.log("Here");
  // var url = "https://canvas.wpi.edu/api/v1/courses"
  var ulrOrigin = "https://canvas.wpi.edu";

  var url = ulrOrigin + "/api/v1/dashboard/dashboard_cards"
  var activeClasses = await urlRequest(url);
  console.log(activeClasses);

  var activeClassIds = new Array(activeClasses.length);

  for(let i = 0; i < activeClassIds.length; i++){
    if(i == 2){
      activeClassIds[i] = activeClasses[i]["id"];

      runningFilePath = "Term " + activeClasses[i]['term'] + "/" + activeClasses[i]['shortName']
  
      downloadClass(activeClassIds[i], runningFilePath);
  
    }
  }

  // console.log(activeClassIds);



  /*/ 
  //Class = i
  //Module = j
  //Module Entery = k


  var classModules = new Array(activeClasses.length);

  for(let i = 0; i < activeClassIds.length; i++){
    var prores = await getModules(ulrOrigin, activeClassIds[i]);
    // console.log(prores);
    // console.log(prores.result);
    classModules[i] = prores;
  }

  console.log(classModules);

  var items     = new Array(activeClasses.length);
  var itemTypes = new Array(activeClasses.length);


  for(let i = 0;i < activeClassIds.length; i++){
    items[i]      = new Array(classModules[i].length);
    itemTypes[i]  = new Array(classModules[i].length); 
    for(let j = 0; j < classModules[i].length; j++){
      // console.log(j);
      var itemsURL = classModules[i][j]["items_url"];
      // console.log(itemsURL);
      items[i][j] = (await getItems(itemsURL));
      itemTypes[i][j] = (await getItemTypes(itemsURL));
      // items[i][j] = items[i][j]['type'];
    }
    // getItems()

  }
  console.log(items);
  console.log(itemTypes);

  for(let i = 0; i < items.length; i++){
    for(let j = 0; j < items[i].length; j++){
      for(let k = 0; k < items[i][j].length; k++){
        if(itemTypes[i][j][k] == "File"){
          downloadFile(items[i][j][k]['url'], "Term " + activeClasses[i]['term'] + "/" + activeClasses[i]['shortName'] + "/" + classModules[i][j]['name'] + "/");
        }
      }
    }
  }
   //*/


  // downloadFile("https://canvas.wpi.edu/api/v1/files/6240223");
}


async function getModules(origin, courseId) {
  // const response = await fetch(
  //   origin + '/api/v1/courses/' + courseId + '/modules'
  // );

  // return await response.json();
  const responseJson = await urlRequest( origin + '/api/v1/courses/' + courseId + '/modules');
  // // console.log("RESPJS");
  // console.log(responseJson);
  return responseJson;
}

async function getItems(moduleUrl){
  const itemsArray = await urlRequest(moduleUrl);
  // console.log("RESPJS");
  // console.log(responseJson);

  // for(let j = 0; j < itemsArray.length; j++){
  //   itemsArray[j] = itemsArray[j]['type'];
  // }

  return itemsArray;
}

async function getItemTypes(moduleUrl){
  const itemsArray = await urlRequest(moduleUrl);
  // console.log("RESPJS");
  // console.log(responseJson);

  for(let j = 0; j < itemsArray.length; j++){
    itemsArray[j] = itemsArray[j]['type'];
  }

  return itemsArray;
}


window.onload=function(){
  // document.getElementById("myButton").addEventListener("click", testing);
  document.getElementById("myButton").addEventListener("click", deafultDownload);
}  


async function testing(){
  var tab = await getCurrentTab(); 
  var url = tab.url;
  console.log(url);
  
  let isClass = urlIsASpecificCourse(url);
  console.log(isClass);

  console.log("Done");
}

function urlIsASpecificCourse(url){
  var urlArray = url.split("/");
  console.log(urlArray);
  var cousesIndex = -1;
  for (let i = 0; i < urlArray.length; i++) {
    if(cousesIndex != -1 && i == cousesIndex + 1){
      if(typeof parseInt(urlArray[i]) == typeof 5){
        console.log(urlArray[i]);
        return true;
      }
    }
    if(urlArray[i] == "courses"){
      cousesIndex = i;
      console.log(cousesIndex);
    }
  }
  return false;
}



async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);
  return tabs[0];
}
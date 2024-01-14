async function urlRequest(url){
  var newUrl = url + "?per_page=100>"
  const response = await fetch(newUrl);
  // console.log(response);
  // console.log(response.headers);
  const responseJson = await response.json();
  return responseJson;
}
//Pages,Announcements, Discussions.
//Clean Icon, Copy Myles HTML, Make Selectors work, Change Based on Page.

async function downloadFile(url, filePath) {
  console.log("URL");
  console.log(url);

  const responseJson = await urlRequest(url);
  // console.log("JObj");
  // console.log(responseJson);

  var fullFileName = filePath + "/" + responseJson.filename;
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
  // console.log(j);
  var itemsURL = moduleJson["items_url"];
  // console.log(itemsURL);
  items = (await getItems(itemsURL));
  itemTypes = (await getItemTypes(itemsURL));
  // items[i][j] = items[i][j]['type']; 


  console.log(moduleJson);
  console.log(items);
  console.log(itemTypes);
  for(let k = 0; k < items.length; k++){
    if(itemTypes[k] == 'File'){
      var fileStr = runningFilePath
      console.log(fileStr);
      var res = await downloadFile(items[k]['url'], fileStr);
    }
  }
  // downloadItem();
}

async function downloadClass(courseId, runningFilePath){
  console.log(runningFilePath);
  //For Each Module Download it
  var ulrOrigin = "https://canvas.wpi.edu";

  //Download Modules
  var modulesArray = await getModules(ulrOrigin, courseId);
  console.log(modulesArray);

  for(let j = 0; j < modulesArray.length; j++){
    // console.log(modulesArray[j]);
    var res = await downloadModule(modulesArray[j], runningFilePath + "/Modules/" + modulesArray[j]['name']);
  }

  //Download Folders/Files
  var corseRequestURL = ulrOrigin + "/api/v1/courses/" + courseId;
  const responseJson = await urlRequest(corseRequestURL); 
  console.log(responseJson);

  var url = ulrOrigin + "/api/v1/courses/" + courseId + "/folders";
  const foldersArray = await urlRequest(url);

  console.log(foldersArray);

  for(let i = 0; i < foldersArray.length; i++){ 
    // console.log(filesArray[i]['url']);
    // var fileUrl = "https://canvas.wpi.edu/api/v1/files/" + filesArray[i]['id'];

    // var res = await downloadFolder(foldersArray[i], responseJson['name']);
    var res = await downloadFolder(foldersArray[i], runningFilePath);
  }

  //Download Assignments
  var url = ulrOrigin + "/api/v1/courses/" + courseId + "/assignments";
  const assignmentsArray = await urlRequest(url);

  console.log(assignmentsArray);

  for(let i = 0; i < assignmentsArray.length; i++){
    // console.log(assignmentsArray[i]['url']);
    // downloadFile(filesArray[i]['url'], responseJson['name'] + "/" + "Files");
    // var res = await downloadAssignmnet(assignmentsArray[i], responseJson['name'] + "/" + "Assignments")
    var res = await downloadAssignmnet(assignmentsArray[i], runningFilePath + "/" + "Assignments")
  }

}

async function downloadHTML(htmlString, runningFilePath){
  console.log(htmlString);
  if(htmlString == null || htmlString.length < 5){
    console.log("Too Small For File!");
    return;
  }else{
    nextIndex = htmlString.indexOf("https://canvas.wpi.edu/api/v1/courses");
    while(nextIndex != -1){
      console.log(htmlString);
      console.log(nextIndex);
      
      var wrapInd = htmlString.indexOf("wrap");
      console.log(wrapInd);

      var endLinkIndex = htmlString.substring(nextIndex).indexOf('"') + nextIndex;
      var linkStr = htmlString.substring(nextIndex, endLinkIndex);
      console.log(linkStr);

      // if(wrapInd < 50){
        // if(false){
        //Download
        // var endLinkIndex = htmlString.indexOf('"');
        // var linkStr = htmlString.substring(nextIndex, endLinkIndex);
        // console.log(linkStr);
        var res = await downloadFile(linkStr, runningFilePath);
        console.log("WW")
      // }else{
        // console.log("LL");
      // }

      // Reduce String
      htmlString = htmlString.substring(nextIndex + 1); //Add any number as to not repeat
      console.log(htmlString);
      nextIndex = htmlString.indexOf("https://canvas.wpi.edu/api/v1/courses"); 
      // nextIndex = -1;
    }
    
  }
  
}

async function downloadAssignmnet(assignmentJson, runningFilePath){
  var res = await downloadHTML(assignmentJson['description'], runningFilePath + "/" + assignmentJson['name']);
}

async function downloadFolder(folderJson, runningFilePath){
  console.log(folderJson);
  var filesArray = await urlRequest(folderJson['files_url']);
  console.log(filesArray);
  for(let i = 0; i < filesArray.length; i++){
    var fileUrl = "https://canvas.wpi.edu/api/v1/files/" + filesArray[i]['id'];
    var res = await downloadFile(fileUrl, runningFilePath + "/" + folderJson['full_name'])
  }
}

async function deafultDownload(){
  console.log("Here");
  // var url = "https://canvas.wpi.edu/api/v1/courses"
  var ulrOrigin = "https://canvas.wpi.edu";

  /*
  var url = ulrOrigin + "/api/v1/dashboard/dashboard_cards"
  var activeClasses = await urlRequest(url);
  console.log(activeClasses);

  var activeClassIds = new Array(activeClasses.length);

  for(let i = 0; i < activeClassIds.length; i++){
    // if(i == 2){
      activeClassIds[i] = activeClasses[i]["id"];

      runningFilePath = "Term " + activeClasses[i]['term'] + "/" + activeClasses[i]['shortName']
  
      var res = await downloadClass(activeClassIds[i], runningFilePath);
  
    // }
  }

  // var res = await downloadClass(activeClassIds[i], runningFilePath);

  //*/
  
  /*
  //Class All Parts
  var courseId = 37300;
  // var courseId = 52592;
  var corseRequestURL = ulrOrigin + "/api/v1/courses/" + courseId;
  const responseJson = await urlRequest(corseRequestURL); 

  console.log(responseJson);

  runningFilePath = responseJson['name']
  
  var res = await downloadClass(courseId, runningFilePath); 

  // console.log(activeClassIds);
  //*/


  // url = "https://canvas.wpi.edu/api/v1/courses/52592/folders";
  // url = "https://canvas.wpi.edu/api/v1/folders/713365/folders";
  // var res = await urlRequest(url);
  // console.log(res);

  /*
  //Folders
  var courseId = 52592;
  var corseRequestURL = ulrOrigin + "/api/v1/courses/" + courseId;
  const responseJson = await urlRequest(corseRequestURL); 
  console.log(responseJson);

  var url = ulrOrigin + "/api/v1/courses/" + courseId + "/folders";
  const foldersArray = await urlRequest(url);

  console.log(foldersArray);

  for(let i = 0; i < foldersArray.length; i++){ 
    // console.log(filesArray[i]['url']);
    // var fileUrl = "https://canvas.wpi.edu/api/v1/files/" + filesArray[i]['id'];

    var res = await downloadFolder(foldersArray[i], responseJson['name']);
  }


  /*
  //Files
  var courseId = 52592;
  var corseRequestURL = ulrOrigin + "/api/v1/courses/" + courseId;
  const responseJson = await urlRequest(corseRequestURL); 
  console.log(responseJson);

  var url = ulrOrigin + "/api/v1/courses/" + courseId + "/files";
  const filesArray = await urlRequest(url);

  console.log(filesArray);

  for(let i = 0; i < filesArray.length; i++){
    console.log(filesArray[i]['url']);
    var fileUrl = "https://canvas.wpi.edu/api/v1/files/" + filesArray[i]['id'];

    var res = await downloadFile(fileUrl, responseJson['name'] + "/" + "Files");
  }
  //*/

  /*
  //Assignmets
  var courseId = 52592;
  var corseRequestURL = ulrOrigin + "/api/v1/courses/" + courseId;
  const responseJson = await urlRequest(corseRequestURL); 
  console.log(responseJson);

  var url = ulrOrigin + "/api/v1/courses/" + courseId + "/assignments";
  const assignmentsArray = await urlRequest(url);

  console.log(assignmentsArray);

  for(let i = 0; i < assignmentsArray.length; i++){
    // console.log(assignmentsArray[i]['url']);
    // downloadFile(filesArray[i]['url'], responseJson['name'] + "/" + "Files");
    var res = await downloadAssignmnet(assignmentsArray[i], responseJson['name'] + "/" + "Assignments")
  }
  //*/

  // /*
  //Pages. Cant Find Body
  var courseId = 53124;
  var corseRequestURL = ulrOrigin + "/api/v1/courses/" + courseId;
  const responseJson = await urlRequest(corseRequestURL); 
  console.log(responseJson);

  var url = ulrOrigin + "/api/v1/courses/" + courseId + "/pages";
  const pagesArray = await urlRequest(url);

  console.log(pagesArray);

  for(let i = 0; i < pagesArray.length; i++){
    console.log(pagesArray[i]);
    var pageStr = pagesArray[i]['page_id'];
    // pageStr = pageStr.replace(" ", "-");
    var fileUrl = "https://canvas.wpi.edu/api/v1/courses/" + courseId + "/pages/" + pageStr;
    console.log(fileUrl);
    const responseJson = await urlRequest(fileUrl); 
    console.log(responseJson['body']);

    var res = await downloadHTML(responseJson['body'], "Pages/" + responseJson['title']);
    // downloadFile(filesArray[i]['url'], responseJson['name'] + "/" + "Files");
    // var res = await downloadAssignmnet(assignmentsArray[i], responseJson['name'] + "/" + "Assignments")
  }
  //*/

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
  document.getElementById("download-button").addEventListener("click", deafultDownload);
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
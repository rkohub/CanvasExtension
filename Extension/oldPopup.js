console.log("This is a popup!");

function importData() {
    // let input = document.createElement('input');
    // input.type = 'file';
    // input.onchange = _ => {
    //   // you can use this method to get file and perform respective operations
    //           let files =   Array.from(input.files);
    //           console.log(files);
    //       };
    // input.click();

    /*
    var fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');

    // fileSelector.click();

    var selectDialogueLink = document.createElement('a');
    selectDialogueLink.setAttribute('href', '');
    selectDialogueLink.innerText = "Select File";

    selectDialogueLink.onclick = function () {
        fileSelector.click();
        return false;
    }

    document.body.appendChild(selectDialogueLink);
    //*/

    // const dialog = require('electron').dialog;
    // console.log(dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]}));

    console.log("POP!");
    
}

async function logMovies(urlIN) {
    //*
    const url = urlIN;
    // const response = await fetch("http://example.com/movies.json");
    const response = await fetch(url);
    const movies = await response.json();
    // const movies = await response.text();
    console.log(movies);
    //*/
    console.log(movies.url);

    const downURL = movies.url;
    const fileName = movies.filename;

    console.log(fileName);
    console.log("CanvasDownloads/" + fileName);
    

    importData();

    // /*
    chrome.downloads.download({
        url: movies.url,//"https://canvas.wpi.edu/api/v1/files/6240223",
        filename: "CanvasDownloads/" + fileName // Optional
      });
    //*/
}

async function downloadFile(url) {
  const response = await fetch(url);
  const responseJson = await response.json();

  chrome.downloads.download({
    url: responseJson.url,
    filename: responseJson.filename, //Optional
  });
}


async function downloadFile(url) {
    const response = await fetch(url);
    const responseJson = await response.json();
  
    chrome.downloads.download({
      url: responseJson.url,
      filename: responseJson.fileName
    });
  }

// logMovies("https://canvas.wpi.edu/api/v1/files/6240223");

function deafultDownload(){
  console.log("Here");
  // downloadFile("https://canvas.wpi.edu/api/v1/files/6240223");

  // let url = chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  //   // let url = tabs[0].url;
  //   // use `url` here inside the callback because it's asynchronous!
    
  //   // console.log(url);
  //   console.log("URL");

  //   return tabs[0].url;

  // });

  // console.log(url);
  // console.log("URL2");

  var activeTabId;

  activeTabId = getActiveTab(returnTab);
  // console.log(activeTabId);

  var out = secondFunction();

  // console.log("DOne2");
  // console.log(out);
  // console.log(activeTabId);

} 

function returnTab(tab){
  console.log("Callback");
  console.log(tab);

  let url = tab.url; 

  console.log(url);
  console.log(typeof url);

  let isClass = urlIsASpecificCourse(url);

  console.log(isClass);


  return tab;
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

function firstFunction(_callback){
  // do some asynchronous work
  var activeTabId;
  chrome.tabs.onActivated.addListener(function(activeInfo) {
    activeTabId = activeInfo.tabId;
  });

  // and when the asynchronous stuff is complete
  _callback();    
  return activeTabId;
}

function secondFunction(){
  // call first function and pass in a callback function which
  // first function runs when it has completed
  return firstFunction(function() {
      console.log('huzzah, I\'m done!');
  });    
}


chrome.tabs.onActivated.addListener(function(activeInfo) {
  activeTabId = activeInfo.tabId;
});

function getActiveTab(callback) {
  chrome.tabs.query({ lastFocusedWindow: true, active: true}, function (tabs) {
    var tab = tabs[0];

    if (tab) {
      console.log("Tab"); 
      var val = callback(tab);
      // console.log(val);
      return val;
    } else {
      chrome.tabs.get(activeTabId, function (tab) {
        if (tab) {
          callback(tab);
        } else {
          console.log('No active tab identified.');
        }
      });

    }
  });
}

window.onload=function(){
  document.getElementById("myButton").addEventListener("click", deafultDownload);
}                       


// function myFunction() {
//   document.getElementById("demo").innerHTML = "YOU CLICKED ME!";
// }  

console.log("DONE!");
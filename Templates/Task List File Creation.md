<%*
 // File import
 const jsonPath = "JSON/farmers-state-bank-task-list.json";
 const jsonTFile = app.vault.getFileByPath(jsonPath);
 const json = await app.vault.read(jsonTFile);

//Initializing Task-related variables
let tID, tName, tList, dCreated, wfStages, tPriority, tStatus, tProgress, tComments, tDescription = '';

console.log("----------------------- THIS IS THE FILE CREATED ----------------------")
// console.log(json)

 let jsonFile = JSON.parse(json);
 console.log("This is jsonFile:", jsonFile)
 
 let fTitle = await tp.file.title;
 let pTitle = fTitle; // Obsidian Friendly Formatting
 // let fileName = jsonPath.match(/[^\/]+$/)
 // const regex = new RegExp(` Modified`, "g")

 fTitle = fTitle.replaceAll(/ [-]/g, ":")
 fTitle = fTitle.replaceAll(/u002F/g, "/")
 fTitle = fTitle.replaceAll(/u005C/g, "\\")
 fTitle = fTitle.replaceAll(/~/g, "")
 console.log("this is fTitle:", fTitle)

 // Get the main object
 let sObject = await jsonFile.find(x => x["Task name"] === fTitle)



 console.log("This is sObject:", sObject)
 
 tID = sObject["Task ID"];
 tName = pTitle;
 tList = sObject["Task list"];
 dCreated = sObject["Date created"];
 nCreated = sObject["Created by firstname"] + " " + sObject["Created by lastname"];
 tDescription = sObject["Task description"];
 wfStages = sObject["Workflow Stages"];
 tPriority = sObject["Priority"];
 tStatus = sObject["Status"];
 tProgress = sObject["Progress"];
 tComments = ''; // Need to implement comment handling
 
 console.log("----------------------- THIS IS THE FILE ENDING ----------------------")




-%>
<% "---" %>
tags:
  - tasks
taskID: <% tID %>
taskName: <% tName %> 
taskList: <% tList %>
dateCreated: <% dCreated %>
createdBy: <% nCreated %>
workflowStages: <% wfStages %>
priority: <% tPriority %>
status: <% tStatus %>
progress: <% tProgress %>
<% "---" %>

<% tDescription %>
[Link](https://corephp.teamwork.com/app/tasks/<% tID %>)

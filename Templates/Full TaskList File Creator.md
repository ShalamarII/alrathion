<%*

// console.log("This is sObject:", sObject)
const jsonPath = "JSON/farmers-state-bank-task-list.json";
const jsonTFile = app.vault.getFileByPath(jsonPath);
const json = await app.vault.read(jsonTFile);

//Replace this for the output directory
let outputDirectory = "Tasks"
//console.log(json);


let o = await JSON.parse(json);
console.log("This is o: ", o)
console.log("This is o.length: ", o.length);
let count = 0

async function iterateAndCreate(item, index)  {

    console.log("This is item", item)
    console.log("This is index", index)

    // Get the current task
    cTask = item[index]

    console.log("This is cTask:", cTask)

    // input name and retemplate
    let nName = cTask["Task name"]
    nName = nName.replaceAll(/[:]/g, " -")
    nName = nName.replaceAll(/[\/]/g, "u002F")
    nName = nName.replaceAll(/[\\]/g, "u005C")

    console.log(nName)

    let tList = cTask["Task list"];
    console.log(tList);
    
    // Create the file in the new directory with the template
    
    tp.file.create_new(tp.file.find_tfile("Task List File Creation"), `${nName}`, false, `${outputDirectory}/${tList}`)

}

// await new Promise(r => setTimeout(r, 250));
iterateAndCreate(o, 0);

/*
// Run the loop for each spell object
for (let i = 0; i < o.rows.length; i++) {
    await new Promise(r => setTimeout(r, 150));
    iterateAndCreate(o.rows, i)
    }

*/

-%>
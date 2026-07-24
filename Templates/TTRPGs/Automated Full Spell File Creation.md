<%*

// console.log("This is sObject:", sObject)
const jsonPath = "JSON/CodexArcanumSpells.spl";
const jsonTFile = app.vault.getFileByPath(jsonPath);
const json = await app.vault.read(jsonTFile);
let o = await JSON.parse(json);
let rows = await o.rows
// console.log(o.rows)
let count = 0

// Grab the Source List
const jsonPathL = "JSON/sourceList.json";
const jsonTFileL = app.vault.getFileByPath(jsonPathL);
const jsonL = await app.vault.read(jsonTFileL);
let sourceList = await JSON.parse(jsonL);
// console.log("This is the source list:", sourceList)

//Replace this for the output directory
let outputDirectory = "TTRPG Systems/GURPS/Mechanics/Spells"

let refLetters, refPage, refName, sRef, refIssue, cRow = ""

//let sourceList = [{"name": "GURPS 4th - Magic", "alias": "M", "pageOffset": 2}, {"name": "GURPS - Codex Arcanum", "alias": "GCX", "pageOffset": 0}, {"name": "Magic - Plant Spells", "alias":"MPS", "pageOffset": 0}, {"name": "GURPS 4th - Pyramid - 3_28", "alias": "PY28", "pageOffset": 0}]



async function iterateAndCreate(item, index)  {

    // Get the current spell
    cRow = item[index]

    console.log("This is cRow:", cRow)

    // Get the appropriate reference and manipulate the string
    if (cRow.hasOwnProperty("reference") == true) { 
        sRef = cRow.reference 
    }
    
    // Item ref check (Optional)
    // console.log("This is item.ref:", sRef)

    // Current Spell Check (Optional)
    // console.log("This is the item:", cRow.name)

    // Handle groups
    if (cRow.hasOwnProperty("children") == 
true) {
        let immutableTable = cRow.children
        for (x in cRow.children) {
            // console.log(cRow.children)
            // console.log("This is spell:", cRow.children)
            await iterateAndCreate(immutableTable, Number(x))
        }
        return
    }

    // console.log("this is cRow.name:", cRow.name.replaceAll(/[:]/g, " -"))

    count++

    // input name and manipulate remplating
    let nName = cRow.name.replaceAll(/[:]/g, " -")
    nName = nName.replaceAll(/[\/]/g, "u002F")
    nName = nName.replaceAll(/[\\]/g, "u005C")
    // console.log("This is nName:", nName)
    

    // Output Title Check (Optional)
    // console.log("This is the file name", nName)

    // console.log("This is sRef:", sRef)

    //Folder Placement
    if (sRef.includes(":") == false) {
        refLetters = sRef.match(/[aA-zZ]+/)[0]
        refPage = sRef.match(/\d+/)[0]
        // console.log("this is refLetters:", refLetters)
    } else if (sRef.includes(":") == true ) { 
        refLetters = sRef.match(/[aA-zZ0-9]+[^:]/)[0]
        refPage = sRef.match(/(?::)\d+/)[0].replaceAll(":", "")
        if (refLetters.startsWith("PY")) {
            refLetters = sRef.match(/[aA-zZ]+/)[0]
            refIssue = sRef.match(/[0-9]*:/)[0].replaceAll(":", "")
        }
    }
    
    refName = sourceList.find((element) => element.alias == refLetters).name

    refName = refName.replaceAll(/[:]/g, " -")
    refName = refName.replaceAll(/[\/]/g, "u002F")
    refName = refName.replaceAll(/[\\]/g, "u005C")

    // console.log("This is refName:", refName)
    // console.log("This is nName:", outputDirectory + "/" + refName + "/" + nName + ".md")
    
    if (refLetters.startsWith("PY")) {
        refName = refName + refIssue
    }

    // Check if Duplicate
    let fileTotal = outputDirectory + "/" + refName + "/" + nName + ".md"
    let preExists = await tp.file.exists(fileTotal)
    let preID = rows.find((element) => element.id == cRow.id)
    let fileName = jsonPath.match(/[^\/]+$/)

    console.log("this is preID:", preID)

    console.log("-------------")

    if (preExists == true && preID != undefined) {
        console.log(nName, "is a duplicate")
        return
    }

    console.log("This is not true for:", `${nName} ~ ${fileName[0]}`)

    if (preExists == true && preID == undefined) {
        let fileName = jsonPath.match(/[^\/]+$/)
        console.log("Creating a new modified file")
        tp.file.create_new(tp.file.find_tfile("New Spell Template"), `${nName} ~ Modified`, false, `${outputDirectory}/${fileName[0]}`)
        return
    }

    // console.log("This is refLetters:", refLetters)
    // console.log("This is refName:", refName)
 
    // Create the file in the new directory with the template
    tp.file.create_new(tp.file.find_tfile("New Spell Template"), `${nName}`, false, `${outputDirectory}/${refName}`)
}
// iterateAndCreate(rows, 0)

await new Promise(r => setTimeout(r, 250));
// iterateAndCreate(rows, 0)


// Run the loop for each spell object
for (let i = 0; i < o.rows.length; i++) {
    await new Promise(r => setTimeout(r, 150));
    iterateAndCreate(o.rows, i)
    }

 -%>
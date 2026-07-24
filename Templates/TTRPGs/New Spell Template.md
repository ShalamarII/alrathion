<%*
 // File import
 const jsonPath = "JSON/CodexArcanumSpells.spl";
 const jsonTFile = app.vault.getFileByPath(jsonPath);
 const json = await app.vault.read(jsonTFile);
 let jsonFile = JSON.parse(json).rows;
 let fTitle = await tp.file.title
 let rName = await fTitle
 let fileName = jsonPath.match(/[^\/]+$/)
 const regex = new RegExp(` Modified`, "g")
 
 fTitle = fTitle.replaceAll(/ [-]/g, ":")
 fTitle = fTitle.replaceAll(/u002F/g, "/")
 fTitle = fTitle.replaceAll(/u005C/g, "\\")
 fTitle = fTitle.replaceAll(/~/g, "")
 fTitle = fTitle.replaceAll(regex, "")
 // console.log("this is fTitle", fTitle)

 rName = rName.replaceAll(/u002F/g, " - ")
 rName = rName.replaceAll(/u005C/g, " - ")
 await tp.file.rename(`${rName}`)

// Grab the source list
const jsonPathL = "JSON/sourceList.json";
const jsonTFileL = app.vault.getFileByPath(jsonPathL);
const jsonL = await app.vault.read(jsonTFileL);
let sourceList = JSON.parse(jsonL);

// Source List Check (Optional)
// console.log("This is the source list:", sourceList)


 // Get the main object
 let sObject = await jsonFile.find((element) => element.name == fTitle)
 // console.log(sObject)

 let sTags, sCollege, sName, sClass, sDifficulty, sDuration, sMaintenance, sCost, sCastTime, sDescription, sRef, sResist, sSource, sPowerSource, sPoints, sID = ''


 //Set variables
 if (sObject.hasOwnProperty("college")) { sCollege = sObject.college.toString().replaceAll(/[,]/g, ", ")} else sCollege = "None"
 if (sObject.hasOwnProperty("tags")) { sTags = sObject.tags.toString().replaceAll(/[,]/g, ", ")}
 if (sObject.hasOwnProperty("name")) { sName = sObject.name}
 if (sObject.hasOwnProperty("spell_class")) { sClass = sObject.spell_class}
 if (sObject.hasOwnProperty("difficulty")) { sDifficulty = sObject.difficulty.toUpperCase()}
 if (sObject.hasOwnProperty("duration")) { sDuration = `'"${sObject.duration}"'`}
 if (sObject.hasOwnProperty("maintenance_cost")) { sMaintenance = sObject.maintenance_cost}
 if (sObject.hasOwnProperty("casting_cost")) { sCost = sObject.casting_cost}
 if (sObject.hasOwnProperty("casting_time")) { sCastTime = `'"${sObject.casting_time}"'`}
 if (sObject.hasOwnProperty("description")) { sDescription = sObject.description}
 if (sObject.hasOwnProperty("reference")) { sRef = sObject.reference}
 if (sObject.hasOwnProperty("resist")) { sResist = sObject.resist}
 if (sObject.hasOwnProperty("source")) { sSource = sObject.source}
 if (sObject.hasOwnProperty("power_source")) { sPowerSource = sObject.power_source}
 if (sObject.hasOwnProperty("points")) { sPoints = sObject.points}
  if (sObject.hasOwnProperty("id")) { sID = sObject.id}
 
 let sPrerequisites = ''
 let prereqList, gLink, refName, refPage, pSName, refLetters, refNumbers, prereqRT, prereqObj, cOutput, cHas, pLevel, pSLevel, pName, pQuantity, refIssues, weaponsList = ''
 let sNum = 0
 if (sObject.hasOwnProperty("prereqs")){ prereqList = sObject.prereqs.prereqs }
if (sObject.hasOwnProperty("weapons")){ weaponsList = JSON.stringify(sObject.weapons)}

if (sTags == undefined) {
    sTags = "None Given"
}

function sortPList(item) {
    // console.log("Prereq_List:", prereqList)
    // console.log("this is item.prereqs", item.prereqs)
    for (x in prereqList) {
        prereqObj = item.prereqs[x]
        // console.log("This is the prereqObj", prereqObj)
        if (prereqObj == undefined){
            return
        }
        typeTester(prereqObj)
    }
}

 // Function to format spell names
function formatReference(item)  {
    sRef = item.reference

    if (item.hasOwnProperty("reference")) { sRef = item.reference } else { sRef = ""
    return }
    

    console.log("This is includes:", sRef.includes(":"))
    if (sRef.includes(":") == false) {
        refLetters = sRef.match(/[aA-zZ]+/)[0]
        refPage = sRef.match(/\d+/)[0]
    } else if (sRef.includes(":") == true ) { 
       refLetters = sRef.match(/[aA-zZ0-9]+[^:]/)[0]
        refPage = sRef.match(/(?::)\d+/)[0].replaceAll(":", "")
        // console.log(sRef.match(/[aA-zZ]+/)[0])
        if (refLetters.startsWith("PY")) {
            refLetters = sRef.match(/[aA-zZ]+/)[0]
            refIssue = sRef.match(/[0-9]*:/)[0].replaceAll(":", "")
            // console.log("This is refIssue:", refIssue)
        }

        // Reference based checks
        /*
        console.log("This is refLetters:", refLetters)
        // console.log("This is the ref page:", refPage)
        */
    }

    refName = sourceList.find((element) => element.alias == refLetters).name
    refOffset = sourceList.find((element) => element.alias == refLetters).pageOffset

    refName = refName.replaceAll(/[:]/g, " -")
    refName = refName.replaceAll(/[\/]/g, "u002F")
    refName = refName.replaceAll(/[\\]/g, "u005C")

    // Covering the Codex Arcanum
    if (refLetters == "GOCA") {
        sPrerequisites = sObject.prerequisites
        prereqRT = String(sObject.prerequisites)
    }
    
    // Covering the Pyramid Cases
    if (refLetters.startsWith("PY")) {
        refName = refName + refIssue
    }

    refPage = Number(refPage) + Number(refOffset)
    sSource = item.source = refName
}

function typeTester(item){
    switch (item.type){
        case undefined:
            console.log("Undefined!")
            break
        case "prereq_list":
            sortPList(item)
            break
        case "trait_prereq":
            // console.log("Trait Prereq!")
            traitPrereqFormat(item)
            break
        case "spell_prereq":
            spellPrereqFormat(item)
            break
        case "attribute_prereq":
            // console.log("Attribute Prereq!")
            attribPrereqFormat(item)
            break
        case "skill_prereq":
            // console.log("Skill Prereq!")
            skillPrereqFormat(item)
            break
        default:
            // console.log("This shit ain't gon work")
            break
        }
}

function formatPrereqs(item, index) {
        prereqObj = item.prereqs
        // console.log("This is item prereqs: ", item)
        typeTester(item)
    // console.log("----------------------------------------------------")
}

function traitPrereqFormat(item){
    
    // console.log("This is the item", item)

    pName, cOutput, pLevel, cHas = ''
    cArray = ['contains', 'is', 'starts_with']
    let oString = ''
        if (item.has == false){
            cHas = "Does not have "
            oString += cHas
        }
        if (item.hasOwnProperty("name") == true && item.hasOwnProperty("notes") == false){
            pName = item.name.qualifier.replaceAll(/[:\/]/g, " or ")
            pName = pName.replace(/(\b[a-z](?!\s))/g, m => m.toUpperCase())
            oString += pName
        }
        if (item.hasOwnProperty("name") == true && item.hasOwnProperty("notes") == true){
            pName = item.name.qualifier
            cOutput = item.notes.qualifier
            // String Replacements
            pName = pName.replace(/(\b[a-z](?!\s))/g, m => m.toUpperCase());
            cOutput = cOutput.replaceAll("\one college", "")
            cOutput = cOutput.replaceAll(/[()]*/g, "")
            cOutput = cOutput.slice(1)
            cOutput = cOutput.replace(/(\b[a-z](?!\s))/g, m => m.toUpperCase());
            if (cArray.includes(item.notes.compare) == true){
                pName = ''
            }
            oString += pName
            oString += cOutput + " "
        }
        if (item.hasOwnProperty("level") == true){
            pLevel = item.level.qualifier
            oString += pLevel
        }
    sPrerequisites += (oString + ", ")
}

function skillPrereqFormat(item){
    pSName = item.name.qualifier
    pSName = pSName.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    
    if (item.hasOwnProperty("level") == true) {
        pSLevel = item.level.qualifier
        sPrerequisites += `at least ${pSLevel} ${pSName}, `
    } else if (item.hasOwnProperty("level") == false) {
        sPrerequisites += `is ${pSName}, `
    }
    // console.log("Current prerequisites:", sPrerequisites)
}

function attribPrereqFormat(item){
    pSNum = item.qualifier.qualifier
    pSAttrib = item.which
    pSAttrib = pSAttrib.toUpperCase();
    sPrerequisites += `at least ${pSNum} ${pSAttrib}, `
    // console.log("Current prerequisites:", sPrerequisites)
}

function spellPrereqFormat(item){
    // console.log("This is the item", item)
    switch (item.sub_type) {
        case "name":
            // console.log("This is subtype name:", item)
            if (item.hasOwnProperty("qualifier") == true) {
                pSName = item.qualifier.qualifier
            } else if (item.hasOwnProperty("quantity") == true) {
                pSName = item.quantity.qualifier
                sPrerequisites += `at least ${pSName} Spells, `
                break
            }

            pSName = pSName.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
            sPrerequisites += `${pSName}, `
            // console.log("Current prerequisites:", sPrerequisites)
            break
        case "college_count":
            if (sNum < 1) {sNum = Object.values(prereqList).filter(v => v.sub_type === 'college_count').length 
            pQuantity = item.quantity.qualifier
            sPrerequisites += `${sNum} Spell(s) from ${pQuantity} Colleges, `
            // console.log("Current prerequisites:", sPrerequisites)
            }
            break
        case "college":
            pCName = item.qualifier.qualifier
            pQuantity = item.quantity.qualifier
            sPrerequisites += `${pQuantity} Spell(s) from the ${pCName} College, `
            break
        default:
            console.log("No correct subtype")
            break
    }
}

if (sObject.hasOwnProperty("prereqs")){ prereqList.forEach(formatPrereqs) }
prereqRT = sPrerequisites.replaceAll(/[,;] \]$/g,'');
prereqRT = prereqRT.replaceAll(/[,] $/g,'');
await formatReference(sObject)
if (sPrerequisites == "") {
    sPrerequisites = "None"
}

-%>
<% "---" %>
tags:
  - Spell
  - SpellsAsMagic
spellID: <% sID %> 
spellName: <% tp.file.title %>
spellCollege: [<% sCollege %>]
spellDifficulty: <% sDifficulty %>
spellClass: <% sClass %>
spellResisted: <% sResist %>
spellDuration: <% sDuration %>
spellCastingTime: <%sCastTime %>
spellCost: "<% sCost %>"
spellMaintenance: "<% sMaintenance %>"
spellPrerequisites: [<% sPrerequisites %>]
spellPrereqText: <% prereqRT %>
spellSource: <% sSource %>
spellReference: <% sRef %>
spellLink: [[<% refName %>.pdf#page=<% refPage %>&search=<% tp.file.title %>]]
spellPoints: <% sPoints %>
spellTags: <% sTags %>
spellWeapons: <% weaponsList %>
<% "---" %>

 [[<% refName %>.pdf#page=<% refPage %>&search=<% tp.file.title %>|Spell Link]]

---

~~~datacorejsx
return function View(){
    return <dc.Markdown content={`~~~statblock
layout: GCS - Layout 
name: [[${dc.currentFile().field("spellLink").raw}|${dc.currentFile().field("spellName").raw}]]
spell_class: ${dc.currentFile().field("spellClass").raw}
resistedW: ${dc.currentFile().field("spellResisted").raw}
difficulty: ${dc.currentFile().field("spellDifficulty").raw}
duration: ${dc.currentFile().field("spellDuration").raw}
casting_cost: ${dc.currentFile().field("spellCost").raw}
maintenance_cost: ${dc.currentFile().field("spellMaintenance").raw}
casting_time: '${dc.currentFile().field("spellCastingTime").raw}'
college: ${dc.currentFile().field("spellCollege").raw}
prerequisites: ${dc.currentFile().field("spellPrereqText").raw}
reference: ${dc.currentFile().field("spellReference").raw}
spellLink: ${dc.currentFile().field("spellLink").raw}
spellTags: ${dc.currentFile().field("spellTags").raw}
source: ${dc.currentFile().field("spellSource").raw}
~~~`}/>
}
~~~
---
tags:
  - Spell
  - SpellsAsMagic
SpellCategories:
---

<span style="display: flex; justify-content: center; font-size: 24; font-weight: bold;"> INSERT TITLE HERE </span>

```dataview 
TABLE WITHOUT ID 
file.link as "Spell Name", SpellType as "Spell Type", SpellCost as "Vraul Cost", SpellDuration as "Duration (Minutes)", CostToMaintain as "Maintenance Cost"
FROM "TTRPG Systems" 
WHERE file.path = this.file.path
SORT spellCost ASC
```


---
<h3 class="no-after" style="text-align: center">Description</h3>
`VIEW[{SpellDescription}]`




---
<h3 class="no-after" style="text-align: center">Prerequisites</h3>
`VIEW[{Prerequisites}]`




---

<h3 class="no-after" style="text-align: center">Craftable Item</h3>

`VIEW[{CraftableMagicItem}]`

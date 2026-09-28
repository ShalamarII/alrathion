---
tags: ability
identifier:
affects: Self
range: Self
cost: 1
image:
pgRef: PG Ref.
variants:
  - type: Sheer
    description: You begin to craft a vial of poison. It has base charges equal to your proficiency with the [Potion-Crafting] skill. You need the materials to make it and the time it takes to create is X days equivalent to the loot modifier. Poison-Crafting applies to your currently Crafting.
---
identifier:identifier:
```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

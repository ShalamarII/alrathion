---
tags: ability
title: Lacerate Flesh
affects: 1 Target
range: 1 hex
cost: 1
image:
pgRef: PG Ref.
variants:
  - type: Major
    description: "The user uses a [slashing] damage weapon to lacerate a target. The target rolls against the user's Weapon Skill Max. On a success, the user rolls the Weapon's Base Damage + their Weapon Skill Dice."
  - type: Minor
    dataRef:
    description: "The user uses a [slashing] damage weapon to lacerate a target. The target rolls against the user's Weapon Skill Max. On a success, the user rolls the Weapon's Base Damage."
---

```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

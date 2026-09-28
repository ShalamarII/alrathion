---
tags: ability
identifier: crescent_slash
affects: 1 Target
range: Self
cost: 1
image:
pgRef: PG Ref.
variants: |
    type: Default
    description: "The user uses a [Slashing] damage weapon to crush a target. The target rolls against the user's Weapon Skill Max. On a success, the user rolls the Weapon's Base Damage + Weapon Skill Dice."
  - type: Enhanced
    description: "The user uses a [Slashing] damage weapon to crush a target. The target rolls against the user's Weapon Skill Max. On a success, the user rolls the Weapon's Base Damage + their Weapon Skill Dice and applies [Bleeding]."
---

```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

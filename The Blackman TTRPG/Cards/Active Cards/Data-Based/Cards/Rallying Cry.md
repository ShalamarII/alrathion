---
tags: ability
identifier: rallying_cry
affects: Self
range: 8 hexes
cost: 1
image:
pgRef: PG Ref.
variants:
  - type: Default
    dataRef:
    description: "The user makes an exclamation, raising the spirits of any associated with it. One member of the enemy may try and exclaim in response! Roll an opposed SOC check against them. On a success, any allies of the winning party in range will take their turn first next turn."

---

```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

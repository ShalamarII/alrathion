---
tags: ability
identifier: rallying_cry
affects: Self
range: 8 hexes
cost: 1
image:
pgRef: PG Ref.
variants:
  - type: Enhanced
    description: "The user makes a booming exclamation, raising the spirits of any associated with it. Any allies in range will take their turn first; they also receive +1 hex of movement."
---

```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

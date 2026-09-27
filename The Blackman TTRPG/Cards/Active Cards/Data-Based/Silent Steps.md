---
tags: ability
title:
affects: Self
range: Self
cost: 1
image:
pgRef: PG Ref.
variants:
  - type: Major
    description: "Move silently, treating darkness as full cover for PER checks. This gives the status [Stealthed] for 5 turns and increases your movement by 2 hexes."
  - type: Minor
    dataRef:
    description: "Move silently, treating darkness as full cover for PER checks. This gives the status [Stealthed] for 5 turns."
---

```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

---
tags: ability
title: Coordinated Strike
affects: Self
range: Self
cost: 1
image: Attachments/CoordinatedStrike.png
pgRef: PG Ref.
variants:
  - type: Major
    description: If another ally with the Coordinated Strike ability does a minor attack, you may use a minor attack in conjunction.
  - type: Minor
    dataRef: DataRef
    description: If another ally with the Coordinated Strike ability does a minor attack, you may use a minor attack in conjunction.
---

```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

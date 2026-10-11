---
tags: ability
identifier: silent_steps
affects: Self
range: Self
cost: 1
image:
pgRef: PG Ref.
variants:
  - type: Default
    dataRef:
    description: "Move silently, obtaining the [Stealthed] status for 5 turns or until you attack."
---

```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

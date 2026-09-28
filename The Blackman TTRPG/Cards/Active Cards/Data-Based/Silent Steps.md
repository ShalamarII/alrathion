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
  - type: Enhanced
    description: "Move nearly imperceptibly, increasing your movement by 1 hex and obtaining the [E. Stealthed] status for 5 turns or until you attack."
---
identifier:identifier:
```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

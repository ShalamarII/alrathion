---
tags: ability
identifier: Chokehold
affects: Self
range: Self
cost: 1
image:
pgRef: PG Ref.
variants:
  - type: Sheer
    dataRef:
    description: "You wrap your arm around a target's neck, ensuring they cannot breate normally. If you surprise your target, hold them in the [Grappled] condition (HG pg. ). If not, roll an opposed DEX|STR check to hold them in the [Grappled] condition. After two turns, they fall [unconsious]."
  - type: Enhanced
    description: "You wrap your arm around a target's neck, ensuring they cannot breathe normally. If you surprise your target, hold them in the [E. Grappled] condition (HG pg. ). If not, roll an opposed DEX|STR check to hold them in the [E. Grappled] condition. After two turns, they fall [unconsious]."
---

```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

---
tags: ability
title: Chokehold
affects: Self
range: Self
cost: 1
image:
pgRef: PG Ref.
variants:
  - type: Major
    description: "You wrap your arm around a target's neck, ensuring they cannot breathe normally. If you surprise your target, hold them in the [Enhanced Grappled] condition (HG pg. ). If not, roll an opposed DEX|STR check to hold them in the [Enhanced Grappled condition]. After two turns, they fall [unconsious]."
  - type: Minor
    dataRef:
    description: "You wrap your arm around a target's neck, ensuring they cannot breate normally. If you surprise your target, hold them in the [Grappled] condition (HG pg. ). If not, roll an opposed DEX|STR check to hold them in the [grappled condition]. After two turns, they fall [unconsious]."
---

```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

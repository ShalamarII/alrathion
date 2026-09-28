---
tags: ability
identifier: Roll
affects: Self
range: Self
cost: 1
image:
pgRef: Pg Ref.
variants:
  - type: Sheer
    dataRef: DataRef
    description: You make a roll to try and dodge the next attack or ability coming your way. When an enemy targets you, you may attempt to dodge out of the way, negating any damage. You roll defense as normal, but can move up to 1 hex away on a successful dodge and suffer [unbalanced].
  - type: Enhanced
    description: You make a roll to try and dodge the next attack or ability coming your way. You roll defense as normal, but can move up to 1 hex away on a successful dodge.
---
identifier:identifier:identifier:identifier:
```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

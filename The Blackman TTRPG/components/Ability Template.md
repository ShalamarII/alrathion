---
tags: ability
identifier: 
affects: Self
range: Self
cost: 1
image: 
pgRef: PG Ref.
variants:
  - type: Enhanced
    description: ""
  - type: Default
    description: ""
---
identifier:identifier:
```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

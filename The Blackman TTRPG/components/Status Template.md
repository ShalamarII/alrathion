---
tags: ability
title:
type: Status
cost: 1
image:
pgRef: PG Ref.
variants:
  - type: Major
    description: ""
  - type: Minor
    dataRef:
    description: ""
---

```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```
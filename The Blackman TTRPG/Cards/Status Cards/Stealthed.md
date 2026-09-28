---
tags: ability
title: Stealthed
type: Status
cost: 1
image:
pgRef: PG Ref.
variants:
  - type: Default
    description: All stealth-related rolls are 1 RD easier for you. All PER related checks for someone searching, tracking etc. are 1 RD harder for an enemy.
  - type: Enhanced
    description: All stealth-related rolls are 2 RD easier for you. All PER related checks for someone searching, tracking etc. are 2 RD harder for an enemy.
---

```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```
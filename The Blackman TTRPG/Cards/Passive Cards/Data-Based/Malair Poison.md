---
tags: ability
identifier: Malair Poison
type: Passive
range: Self
cost: 1
image:
pgRef: PG Ref.
variants:
  - Default: |
      Any Grappled, Blinded or Surprised enemy turns to dust when killed by a blade dipped in this poison. The poison lasts until washed off. If ingested, this poison causes extreme sweatiness.
---
identifier:identifier:
```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

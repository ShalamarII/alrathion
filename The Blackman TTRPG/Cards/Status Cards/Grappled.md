---
tags: ability
identifier: Grappled
type: Status
cost: 1
image:
pgRef: PG Ref.
variants:
  - type: Enhanced
    description: The target of this status is restrained and cannot cast spells, use abilities or move. They may roll a contested DEX roll once a turn against the source. Regardless, they are unable to communicate with their allies, unless they have a status that otherwise allows them to. If they have a higher DEX level than the source, it is equalized.
  - type: Sheer
    dataRef:
    description: The target of this status is restrained and cannot cast spells, use abilities or move. They may roll a contested DEX roll once a turn against the source. Regardless, they are unable to communicate with their allies, unless they have a status that otherwise allows them to.
---
identifier:identifier:
```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```
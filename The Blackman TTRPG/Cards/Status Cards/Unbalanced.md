---
tags: ability
identifier:
type: Status
cost: 1
image:
pgRef: PG Ref.
variants:
  - type: Sheer
    dataRef:
    description: You are off-balance, making it harder for you to cast spells & use abilities. Treat all RD as if it one level higher.
---

```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```
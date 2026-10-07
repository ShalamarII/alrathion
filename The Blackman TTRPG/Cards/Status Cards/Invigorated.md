---
tags: ability
identifier: Invigorated
type: Status
image:
pgRef: PG Ref.
variants:
  - type: Default
    description: You are Invigorated, gaining one roll level to VIG.
---

```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```
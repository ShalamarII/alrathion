---
tags: ability
title: Card Name
type: Passive
range: Self
cost: 1
image: 
pgRef: PG Ref.
variants:
  - description: |
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris in porttitor justo. Fusce nisi justo, aliquam sit amet massa vel, semper bibendum leo. Cras quis place. This is even more sample text.
  - description: |
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris in porttitor justo. Fusce nisi justo, aliquam sit amet massa vel, semper bibendum leo. Cras quis place. This is even more sample text.
---

```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  const page = dc.useCurrentFile();
  return <AbilityCards cards={fromPage(page)} />;
};
```

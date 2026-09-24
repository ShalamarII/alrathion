
```datacorejsx
const { AbilityCards, fromPage } = await dc.require("The Blackman TTRPG/components/AbilityCard.jsx");

return function View() {
  // Every note tagged #ability, excluding the template
  const pages = dc.useQuery('@page and #ability and !path("Abilities/_components")');
  const [side, setSide] = dc.useState("front");

  const cards = dc.useMemo(() =>
    Array.from(pages)
      .sort((a, b) =>
        String(a.value("title") ?? a.$name).localeCompare(String(b.value("title") ?? b.$name))
      )
      .flatMap(fromPage)
  , [pages]);

  const count = new Set(cards.map((c) => c.path)).size;

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <span style={{ marginRight: "8px" }}>Flip all to:</span>
        {[["front", "Front (Major)"], ["back", "Back (Minor)"]].map(([s, label]) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={side === s ? "mod-cta" : ""}
            style={{ marginRight: "6px" }}
          >
            {label}
          </button>
        ))}
        <span style={{ marginLeft: "8px", color: "var(--text-muted)" }}>
          {count} abilit{count === 1 ? "y" : "ies"}
        </span>
      </div>

      <AbilityCards cards={cards} side={side} clickable />
    </div>
  );
};
```

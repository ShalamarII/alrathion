// Shared ability-card component for Datacore.
// Load it from any datacorejsx block with:
//   const { AbilityCards, fromPage } = await dc.require("Abilities/_components/AbilityCard.jsx");

const FONT = "Virgil, 'Excalifont', 'Comic Sans MS', 'Segoe Print', cursive";

const styles = {
  card: {
    width: "300px",
    minHeight: "440px",
    boxSizing: "border-box",
    border: "2px solid var(--text-normal)",
    borderRadius: "28px",
    padding: "20px 22px 16px",
    display: "flex",
    flexDirection: "column",
    fontFamily: FONT,
    color: "var(--text-normal)",
    background: "var(--background-primary)",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: "1.6em", fontWeight: 700, lineHeight: 1.1 },
  sub: { fontSize: "0.95em", marginTop: "4px" },
  image: {
    width: "100%",
    height: "180px",
    margin: "14px 0 18px",
    border: "1.5px solid var(--text-normal)",
    background: "#c5ccd4",
    objectFit: "cover",
    display: "block",
  },
  desc: { fontSize: "0.92em", lineHeight: 1.45, flexGrow: 1, margin: 0, whiteSpace: "pre-line" },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "16px",
    fontSize: "0.95em",
  },
};

// ---------- Helpers ----------

// Accepts a vault path, a [[wikilink]] property, or a URL.
function resolveImage(src) {
  if (!src) return null;
  if (typeof src === "object" && src.path) src = src.path;
  src = String(src).replace(/^!?\[\[|\]\]$/g, "").split("|")[0];
  if (/^(https?:|app:|data:)/.test(src)) return src;
  const file = dc.app.metadataCache.getFirstLinkpathDest(src, "");
  return file ? dc.app.vault.getResourcePath(file) : null;
}

function linkTarget(v) {
  if (!v) return null;
  if (typeof v === "object" && v.path) return v.path;
  return String(v).replace(/^\[\[|\]\]$/g, "").split("|")[0];
}

function linkLabel(v) {
  if (!v) return null;
  if (typeof v === "object") return v.display || v.path?.split("/").pop().replace(/\.md$/, "");
  const s = String(v).replace(/^\[\[|\]\]$/g, "");
  return s.includes("|") ? s.split("|")[1] : s;
}

function Hex({ value }) {
  return (
    <svg width="58" height="52" viewBox="0 0 58 52" style={{ flexShrink: 0 }}>
      <polygon
        points="15,2 43,2 56,26 43,50 15,50 2,26"
        fill="none"
        stroke="var(--text-normal)"
        strokeWidth="1.5"
      />
      <text
        x="29" y="27"
        textAnchor="middle" dominantBaseline="middle"
        fontFamily={FONT} fontSize="20"
        fill="var(--text-normal)"
      >
        {value}
      </text>
    </svg>
  );
}

// Renders as a clickable Obsidian link if a note with that name exists.
function RefLink({ value }) {
  const target = linkTarget(value);
  const label = linkLabel(value);
  const file = target && dc.app.metadataCache.getFirstLinkpathDest(target, "");
  if (!file) return <span>{label}</span>;
  return (
    <a className="internal-link" data-href={file.path} href={file.path}>
      {label}
    </a>
  );
}

// Turns line breaks into <br/>. Accepts real newlines, a typed \n, or <br>.
function MultilineText({ text }) {
  const parts = String(text ?? "").split(/\r?\n|\\n|<br\s*\/?>/i);
  return parts.map((line, i) => (
    <>
      {i > 0 && <br />}
      {line}
    </>
  ));
}

// Special card types: they show their type name under the title,
// followed only by the stat lines listed here.
// Add more types (lowercase) as needed. Any other type shows Affects + Range.
const SPECIAL_TYPES = {
  passive: ["range"],
  status: [],
};

function normType(t) {
  if (Array.isArray(t)) t = t[0];            // property saved as a list
  return String(t ?? "").trim().toLowerCase();
}

// The note's top-level type wins (so variants marked Major/Minor
// on a Status note still count as Status).
function specialType(card) {
  for (const t of [card.noteType, card.type]) {
    if (SPECIAL_TYPES[normType(t)]) return Array.isArray(t) ? t[0] : t;
  }
  return null;
}

// Lines shown under the title.
function headerLines(card) {
  const special = specialType(card);
  const fields = special ? SPECIAL_TYPES[normType(special)] : ["affects", "range"];
  const lines = special ? [special] : [];
  if (fields.includes("affects") && card.affects) lines.push(`Affects: ${card.affects}`);
  if (fields.includes("range") && card.range) lines.push(`Range: ${card.range}`);
  return lines;
}

// ---------- Build card data from a note's properties ----------
// Top-level properties are shared by every card in the note.
// Each entry in `variants` becomes its own card and can override any of them.
function fromPage(page) {
  // Prefer Obsidian's raw frontmatter (keeps line breaks exactly as written);
  // fall back to Datacore's parsed value.
  const raw = dc.app.metadataCache.getCache(page.$path)?.frontmatter ?? {};
  const v = (k) => (raw[k] !== undefined && raw[k] !== null ? raw[k] : page.value(k));
  const base = {
    path: page.$path,
    title: v("title") ?? page.$name,
    affects: v("affects") ?? null,
    range: v("range") ?? null,
    cost: v("cost") ?? "",
    image: v("image"),
    description: v("description") ?? "",
    pgRef: v("pgRef") ?? "PG Ref.",
    dataRef: v("dataRef"),
    type: v("type") ?? "",
    noteType: v("type") ?? "",   // the note's top-level type (variants can't override this)
  };

  const variants = v("variants");
  if (!Array.isArray(variants) || variants.length === 0) return [base];

  return variants.map((variant, i) => {
    const card = { ...base, key: `${page.$path}#${i}` };
    for (const [k, val] of Object.entries(variant ?? {})) {
      if (val !== null && val !== undefined && val !== "") card[k] = val;
    }
    return card;
  });
}

// Put the Major card first (front), everything else after it.
function orderSides(cards) {
  const i = cards.findIndex((c) => String(c.type).toLowerCase() === "major");
  if (i <= 0) return cards;
  return [cards[i], ...cards.slice(0, i), ...cards.slice(i + 1)];
}

// ---------- Flip card: Major on the front, Minor on the back ----------
// `side` (optional): "front" | "back" — lets a parent flip every card at once.
function FlipCard({ cards, clickable = false, side = "front" }) {
  const [front, back] = orderSides(cards);
  const [flipped, setFlipped] = dc.useState(side === "back");
  dc.useEffect(() => setFlipped(side === "back"), [side]);

  if (!back) return <AbilityCard card={front} clickable={clickable} />;

  const flip = (e) => {
    e.stopPropagation();
    setFlipped((f) => !f);
  };

  const face = {
    gridArea: "1 / 1",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    display: "flex",
  };

  return (
    <div style={{ perspective: "1200px", width: "300px" }}>
      <div
        style={{
          display: "grid",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s ease",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div style={face}>
          <AbilityCard card={front} clickable={clickable} onFlip={flip} />
        </div>
        <div style={{ ...face, transform: "rotateY(180deg)" }}>
          <AbilityCard card={back} clickable={clickable} onFlip={flip} />
        </div>
      </div>
    </div>
  );
}

function FlipButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Flip card"
      aria-label="Flip card"
      style={{
        position: "absolute",
        bottom: "-15px",
        left: "50%",
        transform: "translateX(-50%)",
        height: "30px",
        padding: "0 14px",
        borderRadius: "15px",
        border: "2px solid var(--text-normal)",
        background: "var(--background-primary)",
        color: "var(--text-normal)",
        fontFamily: FONT,
        fontSize: "0.9em",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer",
        boxShadow: "none",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 0 1-15.5 6.2" />
        <path d="M3 12a9 9 0 0 1 15.5-6.2" />
        <polyline points="18 2 18.5 5.8 14.7 6.3" />
        <polyline points="6 22 5.5 18.2 9.3 17.7" />
      </svg>
      Flip
    </button>
  );
}

// One flip card per note (cards from the same note share a card).
function AbilityCards({ cards, clickable = false, side = "front" }) {
  const groups = [];
  const byPath = new Map();
  for (const c of cards) {
    if (!byPath.has(c.path)) {
      byPath.set(c.path, []);
      groups.push(byPath.get(c.path));
    }
    byPath.get(c.path).push(c);
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px 24px", paddingBottom: "20px", rowGap: "40px" }}>
      {groups.map((g) => (
        <FlipCard key={g[0].path} cards={g} clickable={clickable} side={side} />
      ))}
    </div>
  );
}

// ---------- Card (one face) ----------
function AbilityCard({ card, clickable = false, onFlip = null }) {
  const img = resolveImage(card.image);
  const open = () => clickable && card.path && dc.app.workspace.openLinkText(card.path, "");

  return (
    <div
      style={{ ...styles.card, position: "relative", cursor: clickable ? "pointer" : "default" }}
      onClick={open}
    >
      {onFlip && <FlipButton onClick={onFlip} />}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>{card.title}</div>
          {headerLines(card).map((line, i) => (
            <div key={i} style={styles.sub}>{line}</div>
          ))}
        </div>
        <Hex value={card.cost} />
      </div>

      {img ? <img src={img} style={styles.image} /> : <div style={styles.image} />}

      <p style={styles.desc}><MultilineText text={card.description} /></p>

      <div style={styles.footer} onClick={(e) => e.stopPropagation()}>
        <span>
          <RefLink value={card.pgRef} />
          {card.dataRef && <> / <RefLink value={card.dataRef} /></>}
        </span>
        <span>{card.type}</span>
      </div>
    </div>
  );
}

return { AbilityCard, AbilityCards, FlipCard, fromPage };

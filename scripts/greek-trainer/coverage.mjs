#!/usr/bin/env node
// Coverage guard for the H&Q Greek trainer (public/grad-school/randolph/greek-1/trainer/index.html).
//
// hq-paradigms.json lists every paradigm Hansen & Quinn introduces, Units 1–20, taken from Austin's
// vault notes. This script runs the trainer's own code, asks what it actually serves for each unit
// (verb-drill forms and "Unit N only" ending tables) and compares the two.
//
//   node scripts/greek-trainer/coverage.mjs          check (runs before every build; exits 1 on failure)
//   node scripts/greek-trainer/coverage.mjs --write  regenerate TRAINER_COVERAGE in index.html and
//                                                    docs/greek-trainer-coverage.md, then check
//
// It fails when:
//   1. a unit ≤ supportedThrough has a manifest paradigm the trainer doesn't serve and that isn't
//      listed in knownGaps (with a reason);
//   2. "Unit N only" would show 0 ending tables (or 0 drill forms) for a unit ≤ supportedThrough
//      whose manifest entries need them;
//   3. a knownGaps entry is stale (the paradigm is served now) or names an unknown id;
//   4. the TRAINER_COVERAGE block in index.html or the coverage doc is out of date — so the
//      "Not in the trainer yet" lists on the unit screens can never drift from this audit;
//   5. any table the trainer serves, in ANY unit (ending tables, declensions, the article, the
//      Reference page's infinitives), has no English "Sounds like" line, or that line contains Greek
//      (it is shown on the fill-in prompt, so it must never give an ending away). A verb table also
//      needs a singular and a plural line. Add the gloss in index.html (EN_VERB / EN_FINITE / EN_INF /
//      EN_DECL) when a new table lands.
//   6. on the Reference page, a vocabulary verb (Unit N/Vocabulary.md, units ≤ supportedThrough) has no copy of
//      some served παιδεύω table (every tense/mood/voice through that unit) and no recorded reason from
//      build_vocab_drill.py (a missing principal part, a deponent, a rule it can't apply); a copy has no English
//      “Sounds like” line (check 5); a built copy isn't labelled ⚙ built; or a vocabulary verb is missing from
//      DRILL_BUILT altogether. Re-run `python3 build_vocab_drill.py --trainer <index.html>` after editing a
//      Vocabulary note.
//   7. the Principal parts page (#/parts) leaves out a vocabulary verb (every unit, 1–20, in both "Unit N only"
//      and "through Unit 20"), or a verb's row doesn't have exactly six part cells, each H&Q's text or a dash.
//      A compound or single form H&Q lists without parts (ἐπιβουλεύω, ἔξεστι(ν), Unit 1's παιδεύει) is the only
//      exception: its row must say so, and the simple verb it points to must itself be on the page. A headword
//      that splits into neither 1 nor 6 parts (a mangled Vocabulary row) fails too.
//   8. the Glossary (#/glossary, GLOSSARY_DATA = the vault's Glossary/glossary.json) can't find a vocabulary word:
//      every VOCAB_DATA headword must match a glossary headword (letters only, accents and notes ignored) and come
//      back as an exact hit when its first word is typed without accents, unless glossary-exceptions.json lists it
//      with a reason. Every glossary entry needs Greek, an English definition, a book page 775–792 and a unit 1–20
//      (or the Section H&Q prints instead). A stale exception fails too.
//   9. a verb table's "Formation:" line (the Reference tables and their per-verb copies, the quiz tables, the
//      flashcards: every served table with a tense) names a stem without naming its principal part, as
//      "stem (PP VI ἐπαιδεύθην − augment − ην → παιδευθ-)"; cites the wrong part for its tense/voice (H&Q §19:
//      present/imperfect I, future II, aorist III, perfect/pluperfect active IV, M/P V, aorist/future passive VI);
//      cites a form that isn't that verb's own part as H&Q prints it (πέμπω's copy must cite ἐπέμφθην, not
//      ἐπαιδεύθην) or a part H&Q prints as a dash; or shows a stem that isn't the part minus its ending (minus the
//      augment, for the unaugmented stems). Infinitive tables (παιδεύω's and every per-verb copy) need one Formation
//      clause per row that has a form, in row order, as "Perfect: PP IV πεπαίδευκα − α → πεπαιδευκ- + -έναι (…)",
//      held to the same rules for that row's tense and voice.
//  10. on the Reference page "through Unit N" (every N, 1–20), a verb's infinitive table for a voice leaves out an
//      infinitive tense taught through N (H&Q's printed παιδεύω infinitives with unit ≤ N): every tense must be a row,
//      with its form or a "—" carrying the builder's reason. A verb may have only ONE infinitive table per voice
//      (through N), and only one per voice and unit in "Unit N only" — no stray duplicates. A form H&Q prints for a
//      vocabulary verb (γεγράφθαι, p. 124) must be that row of the verb's table, citing its page.
//  11. on the Reference page (every unit 1–20, both "through Unit N" and "Unit N only"), a rendered verb table
//      (παιδεύω's and every per-verb copy, infinitives included) has no per-verb anchor (ref-<paradigm>--<verb>), two
//      anchors collide, or a Jump-menu verb link (#/reference/N?p=…&v=…) points at an element that isn't rendered.
//      Every paradigm with a verb list must list παιδεύω first, and a greyed (no-table) verb must carry a reason.
//  12. any table cell, anywhere (Reference tables and copies, quiz tables, units 1–20), is empty or renders the bare
//      word "Appendix"; or a perfect/pluperfect middle/passive indicative table has no 3rd plural. A consonant-stem
//      3rd plural must be H&Q's Appendix compound (pp. 665–666): PP V − μαι + μένοι + εἰσί(ν) (perfect) / ἦσαν
//      (pluperfect), citing "H&Q Appendix p. 665/666" in the source line, and the quiz must accept it with or
//      without the movable ν and with the participle's gendered forms ("…μένοι, -αι, -α εἰσί(ν)").
//  13. the Vocabulary list (#/words) leaves out a vocabulary word: for every unit that has vocabulary (VOCAB_DATA),
//      "Unit N only" must show exactly that unit's words and "Units 1–N" every word through N; and a verb's
//      "Reference tables →" link must land on a rendered per-verb anchor (#/reference/N?p=…&v=…), in both scopes.
//  14. on the Reference page (every unit 1–20, both scopes), the Verb · Tense · Mood · Voice jump form offers a
//      combo that doesn't resolve to a rendered table id (ref-<paradigm>--<verb>), or leaves a verb table that it
//      can't reach, or lists a verb with no table at all.
//  15. an Ending tables quiz/flashcard verb table (every unit 1–20, both scopes) shows a full verb form instead of an
//      ending: a cell that starts with a reduplication (πεπ-, κεκ-, ἐγεγ- …) or with its verb's stem, runs longer than
//      any personal ending, or isn't the tail of the table's own full form. The only multi-word cells allowed are the
//      consonant-stem 3rd plural compounds, stem consonant + "μένοι εἰσί(ν)" / "μένοι ἦσαν" (-γμένοι, -μμένοι, -σμένοι).
//      The Reference page keeps its whole forms; this guards the quiz only. Every Ending-tables verb table (each
//      tense · mood · voice) must also be a PAIR: its endings grid plus an example verb's full forms (t.full), H&Q's
//      printed forms (never ⚙ built), filled in the same cells, each form graded right by the verb half's grader.
//  16. two Ending tables (quiz and flashcards, every unit 1–20, both scopes) share a title or a key (id): a repeat
//      looks like a duplicate card and merges the two tables' history. The four perfect/pluperfect M/P stem types
//      (§43c: vowel, labial, palatal, dental) must each name their type in the title and sit together in book order.
//  17. an infinitive on the Reference page has no Ending-tables card in the same scope (every unit 1–20): each row of
//      παιδεύω's infinitive tables in "Unit N only" (that unit's tables) and "through Unit N" must be a card
//      (mood infinitive, same tense and voice) in the matching Ending-tables scope, holding the same form, and every
//      infinitive card must be such a row (no card outside its unit). The card is a one-row pair (check 15): its
//      ending is the tail of the form and is accepted, and the form is accepted by the verb half's grader.
//  18. an Ending-tables card's third, display-only table (t.unitVerb: a vocabulary verb ⚙ built by rule) shows forms
//      that aren't exactly that verb's ⚙ built copy on the Reference page (same tense · mood · voice, every cell, the
//      infinitive's row for an infinitive card); the copy isn't ⚙ built (a verb H&Q prints is never used); the verb isn't
//      from the card's unit and isn't labelled with its own (earlier) unit; or a §43c stem-type card's verb is of another
//      stem type. Checked on every unit 1–20, both scopes.
//  19. the Quiz page's test bank (#/quiz, every unit 1–20, both scopes) leaves out a form on the Reference page's per-verb
//      tables, has a verb item that isn't on the page, or puts an item in "Unit N only" that is neither a Unit N word nor a
//      form first taught in Unit N; the noun/adjective declension rule doesn't reproduce a printed 1st/2nd-declension
//      paradigm (τέχνη … νεᾱνίᾱς, ἀγαθός, ἄξιος, ἄδικος) cell for cell; a vocabulary noun or adjective (units ≤
//      supportedThrough) is neither in the bank nor listed as left out; an item has no answer, or a form shared with
//      other items in Units 1–N doesn't accept all their parses; a verb's Reference link doesn't land; a seed doesn't
//      reproduce its quiz; or Produce rejects H&Q's alternates (or accepts a form with no accent).
//  20. the Forms at a glance page (#/combos, every unit 1–20, both scopes) leaves out a tense · mood · voice that the Ending
//      tables or the Reference page show in the same scope (a verb card, an infinitive card, a παιδεύω table or an
//      infinitive-table row), has two rows for one, or has a row neither page shows; a row has no English or no
//      principal-part text, cites the wrong part (H&Q §19), or shows a stem that παιδεύω's printed 1st sg. doesn't start
//      with (the stem + ησ for the future passive); or its Reference link doesn't land on a rendered table.
// Units above supportedThrough are reported (and listed on the unit screens), not failed.
import fs from "node:fs";
import { loadTrainer, TRAINER } from "./load-trainer.mjs";

const MANIFEST = new URL("./hq-paradigms.json", import.meta.url);
const GLOSSARY_EXCEPTIONS = new URL("./glossary-exceptions.json", import.meta.url);
const DOC = new URL("../../docs/greek-trainer-coverage.md", import.meta.url);
const WRITE = process.argv.includes("--write");

const nfc = s => (s == null ? s : String(s).normalize("NFC"));
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const { supportedThrough } = manifest;
const knownGaps = new Map((manifest.knownGaps || []).map(g => [g.id, g.reason]));
const paradigms = manifest.paradigms;

// What each manifest entry needs from the trainer. Finite verb paradigms: a drill form set and an
// ending table. Infinitives have no person × number grid, so the drill only. Everything declined
// (nouns, adjectives, pronouns, the article, numerals, participles) and every endings chart: a table.
function needs(e) {
  if (e.kind !== "verb" || e.form === "endings") return ["tables"];
  if (e.mood === "infinitive") return ["drill"];
  if (e.mood === "participle") return ["tables"];
  return ["drill", "tables"];
}
const voiceOk = (have, want) => (have || "active") === (want || "active")
  || (want === "middle-passive" && (have === "middle" || have === "passive"));
const verbMatch = (x, e) => (!e.tense || x.tense === e.tense) && x.mood === e.mood && voiceOk(x.voice, e.voice)
  && (!e.lemma || nfc(x.lemma) === nfc(e.lemma));

function audit(trainer) {
  const onlyTables = new Map(), onlyDrill = new Map();
  for (let u = 1; u <= 20; u++) {
    onlyTables.set(u, trainer.tables({ unit: u, mode: "only" }));
    onlyDrill.set(u, trainer.pool.book.filter(it => it.tenseUnit === u));
  }
  const rows = paradigms.map(e => {
    const req = needs(e);
    const served = {};
    if (req.includes("tables")) served.tables = onlyTables.get(e.unit).some(t => e.kind === "verb"
      ? t.tense && verbMatch(t, e) : e.tableLabel != null && nfc(t.label) === nfc(e.tableLabel));
    if (req.includes("drill")) served.drill = onlyDrill.get(e.unit).some(it => verbMatch(it, e));
    const missing = req.filter(r => !served[r]);
    return { e, req, served, missing };
  });
  return { rows, onlyTables, onlyDrill };
}

// Every table served anywhere, units 1–20: the quiz/flashcard tables plus the Reference page's extras.
function soundsAudit(trainer) {
  const all = trainer.refTables(Infinity);
  const GREEK = /[\u0370-\u03ff\u1f00-\u1fff]/;
  const bad = [], kinds = {};
  for (const t of all) {
    const kind = t.id === "a:article" ? "article" : t.section === "inf" ? "infinitives" : t.tense ? "verb" : t.section;
    kinds[kind] = (kinds[kind] || 0) + 1;
    const s = t.sounds, why = !s || !Array.isArray(s.lines) || !s.lines.length ? "no English “Sounds like” line"
      : s.lines.some(([, txt]) => !txt || !String(txt).trim()) ? "an empty “Sounds like” line"
      : s.lines.some(([tag, txt]) => GREEK.test(tag + txt)) || GREEK.test(s.note || "") ? "Greek in the “Sounds like” line (it would give the answer away)"
      : t.tense && s.lines.length < 2 ? "a verb table needs a singular and a plural English line" : null;
    if (why) bad.push({ kind, msg: `Unit ${t.tenseUnit} table “${t.label}” (${t.id}) has ${why}` });
  }
  return { all, bad, kinds };
}

// Reference page: each vocabulary verb's copy of every served παιδεύω table (check 6).
function verbAudit(trainer) {
  // The headword is PP I, or PP II when H&Q prints a dash for PP I (ἐρήσομαι). Macrons/notes in brackets dropped.
  const lemmaOf = e => { const ps = e.greek.split(",").map(x => x.replace(/\(.*?\)|\*/g, "").trim().split(/\s+or\s+/)[0]);
    return nfc(/^[—–-]+$/.test(ps[0]) ? ps[1] : ps[0]); };
  const sixParts = e => e.greek.split(",").length >= 6;
  const vocabVerbs = trainer.vocab.entries.filter(e => e.cat === "verb" && sixParts(e));
  const built = new Set(trainer.built.verbs.map(v => nfc(v.lemma)));
  const bad = [], perUnit = {};
  for (const e of vocabVerbs) if (e.unit <= trainer.refVerbUnits && lemmaOf(e) !== nfc("παιδεύω") && !built.has(lemmaOf(e)))
    bad.push(`Unit ${e.unit} vocabulary verb ${lemmaOf(e)} is not in DRILL_BUILT: re-run build_vocab_drill.py --trainer`);
  const tabs = trainer.refTables(Infinity);
  const groups = tabs.filter(t => t.verbCopies);
  for (const g of groups) for (const c of g.verbCopies) {
    const u = (perUnit[c.unit] ||= { verbs: new Set(), tables: 0, missing: 0 });
    u.verbs.add(c.lemma);
    if (c.table) u.tables++;
    if (c.reason || !c.table) u.missing++;
    if (c.unit > supportedThrough) continue;
    const where = `Reference “${g.label}” (Unit ${g.tenseUnit})`;
    if (!c.table && !c.reason) bad.push(`${where} has no copy for the Unit ${c.unit} verb ${c.lemma}, and no reason is recorded`);
    else if (c.reason === "not built" || /not built$/.test(c.reason || "")) bad.push(`${where}: ${c.lemma} has a gap with no recorded reason (${c.reason})`);
    if (c.table && c.table.built && !/^⚙ Built by rule/.test(c.table.source || "")) bad.push(`${where}: ${c.lemma}'s copy isn't labelled ⚙ built`);
    if (c.table && !c.table.sounds) bad.push(`${where}: ${c.lemma}'s copy has no English “Sounds like” line`);
  }
  if (!groups.length) bad.push("the Reference page shows no vocabulary-verb copies at all");
  return { bad, perUnit, groups: groups.length };
}

// Reference page per-verb anchors and the Jump menu's verb links (check 11).
function jumpAudit(trainer) {
  const bad = [];
  let tables = 0, links = 0;
  for (let u = 1; u <= 20; u++) for (const only of [false, true]) {
    const where = `Reference ${only ? `“Unit ${u} only”` : `“through Unit ${u}”`}`;
    const j = trainer.refJump(u, only);
    const ids = new Map();
    const note = (id, what) => { if (ids.has(id)) bad.push(`${where}: anchor ${id} is used twice (${ids.get(id)}; ${what})`); else ids.set(id, what); };
    for (const id of j.paraIds) note(id, "paradigm");
    for (const t of j.tables) {
      tables++;
      if (!t.id) { bad.push(`${where}: “${t.label}” has no per-verb anchor`); continue; }
      if (!/^ref-[a-z0-9-]+--[a-z0-9-]+$/.test(t.id)) bad.push(`${where}: “${t.label}” has a non-ASCII or malformed anchor ${t.id}`);
      note(t.id, t.label);
      for (const s of t.spans) note(s, `${t.label} (tense anchor)`);
    }
    const byP = new Map();
    for (const l of j.links) {
      links++;
      if (!j.paraIds.includes(`ref-${l.p}`)) bad.push(`${where}: the menu's verb list for ${l.p} has no paradigm anchor ref-${l.p}`);
      if (l.id && !ids.has(l.id)) bad.push(`${where}: the Jump menu links ${l.lemma} (${l.p}&v=${l.v}) to ${l.id}, which isn't rendered`);
      if (l.id && l.id !== `ref-${l.p}--${l.v}`) bad.push(`${where}: ${l.lemma}'s link ${l.p}&v=${l.v} resolves to ${l.id}, not ref-${l.p}--${l.v}`);
      if (!l.id && !l.reason) bad.push(`${where}: ${l.lemma} is greyed for ${l.p} with no reason`);
      if (!byP.has(l.p)) byP.set(l.p, l);
    }
    for (const [p, first] of byP) if (first.lemma !== nfc("παιδεύω")) bad.push(`${where}: the verb list for ${p} starts with ${first.lemma}, not παιδεύω`);
  }
  return { bad, tables, links };
}

// The Reference page's four-dropdown jump form (check 14): every combo it can offer lands on a rendered table.
function jumpFormAudit(trainer) {
  const bad = [];
  let combos = 0;
  for (let u = 1; u <= 20; u++) for (const only of [false, true]) {
    const where = `Reference ${only ? `“Unit ${u} only”` : `“through Unit ${u}”`}`;
    const j = trainer.refJump(u, only), f = trainer.refJumpForm(u, only);
    const rendered = new Set([...j.tables.map(t => t.id), ...j.tables.flatMap(t => t.spans)].filter(Boolean));
    const reachable = new Set();
    for (const c of f.combos) {
      combos++;
      const what = `${c.lemma} ${c.tense} ${c.mood} ${c.voice}`;
      if (!c.id) { bad.push(`${where}: the jump form offers ${what}, which resolves to no table`); continue; }
      if (c.id !== `ref-${c.p}--${c.v}`) bad.push(`${where}: the jump form's ${what} (?p=${c.p}&v=${c.v}) resolves to ${c.id}, not ref-${c.p}--${c.v}`);
      if (!rendered.has(c.id)) bad.push(`${where}: the jump form's ${what} points at ${c.id}, which isn't rendered`);
      reachable.add(c.id);
    }
    for (const l of j.links) if (l.id && /^[a-z]+-(?:ind|subj|opt|inf)-(?:act|pass)$/.test(l.p) && !reachable.has(l.id))
      bad.push(`${where}: ${l.lemma}'s ${l.p} table (${l.id}) can't be reached from the jump form`);
    for (const v of f.verbs) if (!f.combos.some(c => c.v === v)) bad.push(`${where}: the jump form lists ${v} with no table`);
  }
  return { bad, combos };
}

// Principal parts page (check 7): every vocabulary verb, six parts each (or a recorded no-parts reason).
function partsAudit(trainer) {
  const verbs = trainer.vocab.entries.filter(e => e.cat === "verb");
  const bad = [], perUnit = {};
  const all = trainer.partsRows(20, "through");
  const byId = new Map(all.map(r => [r.id, r]));
  const lemmas = new Set(all.filter(r => r.parts).map(r => nfc(r.lemma)));
  for (let u = 1; u <= 20; u++) {
    const want = verbs.filter(e => e.unit === u), got = trainer.partsRows(u, "only");
    const gotIds = new Set(got.map(r => r.id));
    for (const e of want) if (!gotIds.has(e.id)) bad.push(`Principal parts “Unit ${u} only” is missing the vocabulary verb ${e.greek}`);
    for (const r of got) if (r.unit !== u) bad.push(`Principal parts “Unit ${u} only” shows ${r.lemma}, a Unit ${r.unit} verb`);
    perUnit[u] = { verbs: want.length, six: got.filter(r => r.parts).length, none: got.filter(r => !r.parts).length };
  }
  for (const e of verbs) {
    const r = byId.get(e.id);
    if (!r) { bad.push(`Principal parts “through Unit 20” is missing the Unit ${e.unit} verb ${e.greek}`); continue; }
    if (r.parts) {
      if (r.parts.length !== 6) bad.push(`Principal parts: ${r.lemma} (Unit ${e.unit}) has ${r.parts.length} part cells, not 6`);
      r.parts.forEach((p, i) => { if (!p || !String(p).trim()) bad.push(`Principal parts: ${r.lemma} (Unit ${e.unit}) part ${i + 1} is empty (H&Q prints a dash for a missing part)`); });
    } else {
      if (r.count !== 1) bad.push(`Principal parts: the Unit ${e.unit} headword “${e.greek}” splits into ${r.count} parts (want 6, or 1 for a form listed without parts): check Unit ${e.unit}/Vocabulary.md`);
      if (!r.noParts) bad.push(`Principal parts: ${r.lemma} (Unit ${e.unit}) has no parts and no reason`);
      else if (r.noParts.base && !lemmas.has(nfc(r.noParts.base))) bad.push(`Principal parts: ${r.lemma} points to ${r.noParts.base}, which isn't on the page`);
    }
  }
  return { bad, perUnit, total: verbs.length };
}

// Vocabulary list (check 13): every unit's words, in both scopes, and every verb link lands on a table.
function wordsAudit(trainer) {
  const bad = [], perUnit = {};
  const all = trainer.vocab.entries;
  const units = [...new Set(all.map(e => e.unit))].sort((a, b) => a - b);
  const max = Math.max(...units);
  const same = (got, want) => got.length === want.length && got.every((w, i) => w.id === want[i].id);
  const jumpIds = new Map();
  const idsAt = (u, only) => { const k = `${u}|${only}`;
    if (!jumpIds.has(k)) jumpIds.set(k, new Set(trainer.refJump(u, only).tables.flatMap(t => [t.id, ...t.spans]).filter(Boolean)));
    return jumpIds.get(k); };
  let links = 0;
  for (let u = 1; u <= max; u++) {
    const only = trainer.words(u, "only"), through = trainer.words(u, "through");
    const wantOnly = all.filter(e => e.unit === u), wantThrough = all.filter(e => e.unit <= u);
    if (wantOnly.length && !only.length) bad.push(`Vocabulary list “Unit ${u} only” is empty, but Unit ${u} has ${wantOnly.length} words`);
    if (!same(only, wantOnly)) bad.push(`Vocabulary list “Unit ${u} only” shows ${only.length} words, want the ${wantOnly.length} in VOCAB_DATA`);
    if (!same(through, wantThrough)) bad.push(`Vocabulary list “Units 1–${u}” shows ${through.length} words, want ${wantThrough.length}`);
    perUnit[u] = only.length;
    for (const w of only) if (w.href) {
      links++;
      const m = w.href.match(/^#\/reference\/(\d+)\?p=([\w-]+)&v=([\w-]+)$/);
      if (!m) { bad.push(`Vocabulary list: ${w.greek} links to a malformed Reference URL ${w.href}`); continue; }
      const id = `ref-${m[2]}--${m[3]}`;
      for (const o of [false, true]) if (!idsAt(Number(m[1]), o).has(id))
        bad.push(`Vocabulary list: ${w.greek}'s link ${w.href} doesn't land on a table (no #${id} on Reference Unit ${m[1]}${o ? ", Unit-only verbs" : ""})`);
    }
  }
  for (const u of units) if (!perUnit[u]) bad.push(`Vocabulary list: Unit ${u} has vocabulary but no page`);
  return { bad, perUnit, links, total: all.length };
}

// Glossary (check 8): every vocabulary word is findable in the back-of-book glossary.
function glossaryAudit(trainer) {
  const fold = s => nfc(s).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/ς/g, "σ");
  const clean = s => String(s).replace(/\([^()]*\)/g, " ");
  const key = s => fold(clean(s)).replace(/[^\p{Script=Greek}]/gu, "").replace(/\p{M}/gu, "");
  const firstWord = s => clean(s).split(/[\s,/]+/).map(w => w.trim()).find(w => key(w)) || "";
  const g = trainer.glossary.entries;
  const exceptions = new Map(JSON.parse(fs.readFileSync(GLOSSARY_EXCEPTIONS, "utf8")).exceptions.map(x => [nfc(x.greek), x.reason]));
  const bad = [], byKey = new Map(), byFirst = new Map();
  g.forEach((e, i) => {
    const where = `Glossary entry ${i + 1} (p. ${e.page})`;
    if (!e.headword || !String(e.headword).trim() || !/\p{Script=Greek}/u.test(e.headword)) bad.push(`${where} has no Greek headword`);
    if (!e.definition || !String(e.definition).trim()) bad.push(`${where} “${e.headword}” has no English definition`);
    if (!(e.page >= 775 && e.page <= 792)) bad.push(`${where} “${e.headword}” has page ${e.page}, outside H&Q's pp. 775–792`);
    if (e.unit == null ? !e.section && !e.refPages : !(e.unit >= 1 && e.unit <= 20)) bad.push(`${where} “${e.headword}” has no unit 1–20, Section or page reference`);
    (byKey.get(key(e.headword)) || byKey.set(key(e.headword), []).get(key(e.headword))).push(e);
    const fk = key(firstWord(e.headword));
    (byFirst.get(fk) || byFirst.set(fk, []).get(fk)).push(e);
  });
  let exact = 0, found = 0;
  const used = new Set();
  for (const v of trainer.vocab.entries) {
    const hit = (byKey.get(key(v.greek)) || [])[0] || (byFirst.get(key(firstWord(v.greek))) || [])[0];
    if (!hit) {
      if (exceptions.has(nfc(v.greek))) { used.add(nfc(v.greek)); continue; }
      bad.push(`Glossary: the Unit ${v.unit} vocabulary word “${v.greek}” isn't in GLOSSARY_DATA (add it, or list it in glossary-exceptions.json with a reason)`);
      continue;
    }
    found++;
    if (nfc(hit.headword) === nfc(clean(v.greek)).replace(/\s+/g, " ").trim() || nfc(hit.headword) === nfc(v.greek)) exact++;
    // The page's own search: the first word typed with no accents must come back as an exact (rank 0) hit.
    const plain = key(firstWord(v.greek));
    const res = trainer.glossarySearch(plain);
    if (!res.some(r => r.rank === 0 && nfc(r.headword) === nfc(hit.headword)))
      bad.push(`Glossary search: typing “${plain}” doesn't return “${hit.headword}” as an exact hit (Unit ${v.unit} word “${v.greek}”)`);
  }
  for (const k of exceptions.keys()) if (!used.has(k)) bad.push(`glossary-exceptions.json lists “${k}”, which is in the glossary now or not in the vocabulary: remove it`);
  return { bad, entries: g.length, vocab: trainer.vocab.entries.length, found, exact, exceptions: exceptions.size,
    uncertain: g.filter(e => e.uncertain).length };
}

// Check 12: no "Appendix" placeholders; every perfect/pluperfect M/P table has its 3rd plural.
function appendixAudit(trainer) {
  const bad = [];
  if (/h\("td"[^;]*?"Appendix"\)/.test(trainer.html)) bad.push("index.html still renders a table cell reading \"Appendix\"");
  const builtPP = new Map(trainer.built.verbs.map(v => [nfc(v.lemma), v.pp.map(nfc)]));
  const bookPP = new Map(trainer.partsRows(20, "through").filter(r => r.parts).map(r => [nfc(r.lemma), r.parts.map(nfc)]));
  const deAcc = s => nfc(s).normalize("NFD").replace(/[\u0300\u0301\u0342]/g, "").normalize("NFC");
  const seen = new Set();
  let mp = 0, compounds = 0;
  const check = (t, where) => {
    if (!t.cells) return;
    t.cells.forEach((row, r) => row.forEach((cell, c) => {
      if (t.dash?.[r]) return;
      const vals = [cell, t.full?.[r]?.[c]].filter(x => x != null).flat();
      if (!cell || !cell.length) bad.push(`${where}: ${t.rows[r]} ${t.cols[c]} is empty`);
      else if (vals.some(v => /Appendix/i.test(v))) bad.push(`${where}: ${t.rows[r]} ${t.cols[c]} shows “Appendix”`);
    }));
    const isMP = (t.voice === "passive" || t.voice === "middle") && t.mood === "indicative" && /^(perfect|pluperfect)$/.test(t.tense);
    if (!isMP || seen.has(t.id)) return;
    seen.add(t.id); mp++;
    const f3 = t.full?.[2]?.[1] || t.cells?.[2]?.[1];
    if (!f3 || !f3.length) return bad.push(`${where}: no 3rd plural`);
    if (!f3.some(f => /μένοι /.test(f))) return;
    compounds++;
    const aux = t.tense === "perfect" ? "εἰσί(ν)" : "ἦσαν";
    const pp5 = (bookPP.get(nfc(t.lemma)) || builtPP.get(nfc(t.lemma)))?.[4];
    const want = String(pp5 || "").split(/\s+or\s+/).map(x => x.replace(/\([^)]*\)/g, "").trim())
      .filter(x => /μαι$/.test(x)).map(x => deAcc(deAcc(x).slice(0, -3) + "μένοι " + aux));
    for (const f of f3) {
      if (!want.includes(deAcc(f)) || !/μένοι /.test(f)) bad.push(`${where}: 3rd plural ${f} isn't PP V ${pp5} − μαι + μένοι ${aux}`);
    }
    if (!new RegExp(`H&Q Appendix p\\. ${t.tense === "perfect" ? 665 : 666} \\(PDF p\\. ${t.tense === "perfect" ? 692 : 693}\\)`).test(t.source || ""))
      bad.push(`${where}: the source line doesn't cite H&Q Appendix p. ${t.tense === "perfect" ? 665 : 666}`);
    // An endings-only quiz table (check 15): its 3rd plural cell is the stem consonant + the compound (γμένοι εἰσί(ν)).
    const e3 = t.full && t.cells?.[2]?.[1];
    if (t.accepts && e3 && e3.join() !== f3.join()) {
      const m = e3[0].replace(/ .*$/, ""), fem = m.replace(/οι$/, "αι"), neu = m.replace(/οι$/, "α"), a = aux.replace("(ν)", "");
      for (const g of [`${m} ${a}`, `-${m} ${a}`, `${m} ${a}${t.tense === "perfect" ? "ν" : ""}`, `${m}, -αι, -α ${aux}`, `${m}, ${fem}, ${neu} ${a}`])
        if (!t.accepts(g, e3)) bad.push(`${where}: the quiz doesn't accept the ending “${g}”`);
    }
    const fullAccepts = e3 && e3.join() !== f3.join() ? t.acceptsFull : t.accepts;
    if (fullAccepts) {
      const m = f3[0].replace(/ .*$/, ""), fem = m.replace(/οι$/, "αι"), neu = m.replace(/οι$/, "α"), a = aux.replace("(ν)", "");
      for (const g of [`${m} ${a}`, `${m} ${a}${t.tense === "perfect" ? "ν" : ""}`, `${m}, -αι, -α ${aux}`, `${m}, ${fem}, ${neu} ${a}`])
        if (!fullAccepts(g, f3)) bad.push(`${where}: the quiz doesn't accept “${g}”`);
    }
  };
  for (const t of trainer.refTables(Infinity)) check(t, `Reference “${t.label}” (${t.id})`);
  for (let u = 1; u <= 20; u++) for (const t of trainer.tables({ unit: u, mode: "through" })) check(t, `Unit ${u} quiz “${t.label}” (${t.id})`);
  if (!compounds) bad.push("no consonant-stem 3rd plural compound found at all");
  return { bad, mp, compounds };
}

// Check 15: Ending tables (the quiz and flashcards) are endings only, never whole verb forms.
function endingsOnlyAudit(trainer) {
  const deAcc = s => nfc(s).normalize("NFD").replace(/[\u0300\u0301\u0342\u0313\u0314\u0304\u0306\u0308]/g, "").normalize("NFC");
  const stemOf = lemma => deAcc(lemma).replace(/(ομαι|ω)$/, "").slice(0, 4);
  const COMPOUND = /^\S{0,2}μενοι (εισι\(ν\)|εισιν?|ησαν)$/;
  const bad = [], seen = new Set();
  let cells = 0, pairs = 0;
  for (let u = 1; u <= 20; u++) for (const mode of ["only", "through"]) for (const t of trainer.tables({ unit: u, mode })) {
    if (!t.tense || seen.has(t.id)) continue;
    seen.add(t.id);
    const where = `Ending tables “${t.label}” (${t.id})`, stem = stemOf(t.lemma || "");
    if (!t.pair || !t.full || typeof t.acceptsFull !== "function") bad.push(`${where}: not a pair (Endings + an example verb's forms)`);
    else {
      pairs++;
      if (t.built) bad.push(`${where}: the example verb's forms are ⚙ built, not printed in H&Q`);
      t.cells.forEach((row, r) => row.forEach((cell, c) => {
        const f = t.full[r]?.[c];
        if (!!cell !== !!f) bad.push(`${where}: ${t.rows[r]} ${t.cols[c]} has ${cell ? "an ending but no verb form" : "a verb form but no ending"}`);
        for (const x of f || []) if (!t.acceptsFull(x, f)) bad.push(`${where}: the verb half doesn't accept its own form “${x}”`);
      }));
    }
    t.cells.forEach((row, r) => row.forEach((cell, c) => (cell || []).forEach(v => {
      cells++;
      const d = deAcc(v), slot = `${t.rows[r]} ${t.cols[c]} “${v}”`;
      if (COMPOUND.test(d)) return;
      const len = [...d.replace(/\(ν\)$/, "")].length;
      if (/\s/.test(d)) bad.push(`${where}: ${slot} is more than one word (only the -μένοι εἰσί(ν) / ἦσαν compound may be)`);
      else if (/^ε?(\S)ε\1/.test(d)) bad.push(`${where}: ${slot} starts with a reduplication: a full form, not an ending`);
      else if (stem.length >= 3 && d.startsWith(stem)) bad.push(`${where}: ${slot} starts with ${t.lemma}'s stem: a full form, not an ending`);
      else if (len > 6) bad.push(`${where}: ${slot} is too long for a personal ending`);
      const full = t.full?.[r]?.[c];
      if (full && !full.some(f => deAcc(f).endsWith(d))) bad.push(`${where}: ${slot} isn't the end of its full form (${full.join(" / ")})`);
    })));
  }
  return { bad, tables: seen.size, cells, pairs };
}

// Check 16: no two Ending tables in a scope share a title or a key; stem-type variants are titled and grouped.
function uniqueTablesAudit(trainer) {
  const bad = [], STEMS = ["vowel stems", "labial stems", "palatal stems", "dental stems"];
  let scopes = 0;
  for (let u = 1; u <= 20; u++) for (const mode of ["only", "through"]) {
    const tabs = trainer.tables({ unit: u, mode }), labels = new Map(), ids = new Map(), where = `Unit ${u} ${mode} Ending tables`;
    scopes++;
    for (const t of tabs) {
      const l = nfc(t.label);
      if (labels.has(l)) bad.push(`${where}: two tables are titled “${t.label}” (${labels.get(l)} and ${t.id})`);
      if (ids.has(t.id)) bad.push(`${where}: “${ids.get(t.id)}” and “${t.label}” share the key ${t.id}`);
      labels.set(l, t.id); ids.set(t.id, t.label);
    }
    const kinds = new Map();
    tabs.forEach((t, i) => { if (t.stemType) { const k = `${t.tense}|${t.mood}|${t.voice}`; (kinds.get(k) || kinds.set(k, []).get(k)).push([t, i]); } });
    for (const [k, xs] of kinds) {
      const rank = xs.map(([t]) => STEMS.findIndex(s => t.stemType.startsWith(s)));
      if (rank.some(r => r < 0)) bad.push(`${where}: ${k} has an unknown stem type (${xs.map(([t]) => t.stemType).join(", ")})`);
      if (rank.some((r, i) => i && r <= rank[i - 1])) bad.push(`${where}: ${k} stem types aren't in book order (vowel, labial, palatal, dental)`);
      if (xs.some(([, i], j) => j && i !== xs[j - 1][1] + 1)) bad.push(`${where}: ${k} stem types aren't together`);
      for (const [t] of xs) if (!nfc(t.label).includes(nfc(t.stemType))) bad.push(`${where}: “${t.label}” doesn't name its stem type (${t.stemType})`);
    }
  }
  return { bad, scopes };
}

// Check 17: every Reference-page infinitive (παιδεύω's tables) has a matching Ending-tables card in the same scope.
function infinitiveCardsAudit(trainer) {
  const bad = [], PAI = nfc("παιδεύω"), deAcc = s => nfc(s).normalize("NFD").replace(/[\u0300\u0301\u0342\u0313\u0314\u0304\u0306\u0308]/g, "").normalize("NFC");
  let cards = 0;
  const perUnit = {};
  for (let n = 1; n <= 20; n++) for (const mode of ["only", "through"]) {
    const only = mode === "only", where = `Unit ${n} ${mode}`;
    const rows = trainer.refTables(n, only).filter(t => t.section === "inf" && !t.group && nfc(t.lemma) === PAI && (!only || t.tenseUnit === n))
      .flatMap(t => t.rows.map((r, i) => ({ tense: r.toLowerCase(), voice: t.voice || "active", forms: (t.cells[i]?.[0] || []).map(nfc), label: t.label })));
    const got = trainer.tables({ unit: n, mode }).filter(t => t.mood === "infinitive");
    if (only) perUnit[n] = got.map(t => t.label);
    for (const r of rows) {
      const c = got.find(t => t.tense === r.tense && (t.voice || "active") === r.voice);
      if (!c) { bad.push(`${where}: the Reference page's ${r.tense} ${r.voice} infinitive (“${r.label}”) has no Ending-tables card`); continue; }
      cards++;
      const full = (c.full?.[0]?.[0] || []).map(nfc), ends = c.cells?.[0]?.[0] || [];
      if (full.join() !== r.forms.join()) bad.push(`${where}: “${c.label}” shows ${full.join(" / ")}, the Reference page ${r.forms.join(" / ")}`);
      if (!c.pair || typeof c.acceptsFull !== "function") { bad.push(`${where}: “${c.label}” is not a pair`); continue; }
      for (const e of ends) {
        if (!full.some(f => deAcc(f).endsWith(deAcc(e)))) bad.push(`${where}: “${c.label}” ending ${e} isn't the end of ${full.join(" / ")}`);
        if (!c.accepts(e, ends)) bad.push(`${where}: “${c.label}” doesn't accept its own ending ${e}`);
      }
      for (const f of full) if (!c.acceptsFull(f, c.full[0][0])) bad.push(`${where}: “${c.label}” doesn't accept its own form ${f}`);
    }
    for (const c of got) if (!rows.some(r => r.tense === c.tense && r.voice === (c.voice || "active")))
      bad.push(`${where}: Ending-tables card “${c.label}” has no infinitive on the Reference page in this scope`);
  }
  return { bad, cards, perUnit };
}

// Check 19: the Quiz page's test bank (#/quiz), every unit 1–20, both scopes.
//   a. every form on the Reference page's per-verb tables (finite cells and infinitive rows, H&Q's and ⚙ built) is a
//      bank item with that verb, tense, mood, voice, person and number: "through Unit N" holds every one; "Unit N only"
//      holds every form of a Unit N verb (the Reference page's "Unit N verbs only") and every form whose tense · mood ·
//      voice is new in Unit N; and the bank has no verb item that isn't on the page;
//   b. the noun/adjective declension rule reproduces every printed 1st/2nd-declension noun and -ος adjective paradigm
//      cell for cell (τέχνη … νεᾱνίᾱς, ἀγαθός, ἄξιος, ἄδικος), declines none of them it can't, and a vocabulary noun
//      or adjective in Units ≤ supportedThrough is either in the bank or listed as left out with a reason;
//   c. every item has forms (its answers) and its parse set contains itself;
//   d. ambiguity: recomputed here, every item sharing a surface form (any variant: movable ν, accents graded, macrons and
//      grave/acute not) with another item of its kind in Units 1–N lists that item's parse (παιδεύῃ: three; λόγοι: nom.
//      and voc. pl.);
//   e. every verb item's "Reference table →" link lands on a rendered per-verb table;
//   f. a seed reproduces the same quiz, and Produce accepts H&Q's alternates (both optative plurals, -ῃ/-ει, movable ν,
//      the -μένοι compound with its gendered forms), a grave for an acute, and no macrons.
function quizAudit(trainer) {
  const bad = [], Q = trainer.quiz, sizes = {};
  const ACC = /[̀́͂]/;
  const key = f => nfc(String(f)).normalize("NFD").replace(/[̄̆]/g, "").replace(/̀/g, "́").normalize("NFC").toLowerCase().replace(/\s+/g, " ").trim();
  const vars = f => { const out = new Set([f]); const n = (f.match(/\(([^()\s]+)\)/g) || []).length;
    for (let m = 0; m < 1 << n; m++) { let i = 0; out.add(f.replace(/(?<=\S)\(([^()\s]+)\)/g, (_, x) => (m >> i++) & 1 ? x : "")); } return [...out]; };
  const grp = pos => pos === "verb" ? "verb" : pos === "noun" ? "noun" : "g";
  const vparse = (lemma, tense, mood, voice, person, number) => `${lemma}|${tense}|${mood}|${voice || "active"}|${person ?? ""}|${number ?? ""}`;
  let verbForms = 0, items = 0, ambiguous = 0, links = 0;
  const linkSeen = new Map(), jumpIds = new Map();
  const rendered = unit => { if (!jumpIds.has(unit)) jumpIds.set(unit, new Set(trainer.refJump(unit, false).tables.map(t => t.id))); return jumpIds.get(unit); };
  for (let u = 1; u <= 20; u++) {
    const through = Q.bank(u, "through").items, only = Q.bank(u, "only").items;
    sizes[u] = { only: only.length, through: through.length, pos: {} };
    for (const it of through) sizes[u].pos[it.pos] = (sizes[u].pos[it.pos] || 0) + 1;
    const index = items => { const m = new Map(); for (const it of items) if (it.pos === "verb")
      m.set(vparse(it.lemma, it.parse.tense, it.parse.mood, it.parse.voice, it.parse.person, it.parse.number), it); return m; };
    const T = index(through), O = index(only);
    // a. Reference forms → bank.
    const want = new Map();
    const walk = (tabs, cb) => { for (const t of tabs) {
      if (!t.lemma || !(t.tense || t.section === "inf")) continue;
      if (t.section === "inf") t.rows.forEach((r, i) => { if (!t.dash?.[i]) for (const f of t.cells[i]?.[0] || []) cb(t, vparse(nfc(t.lemma), r.toLowerCase(), "infinitive", t.voice), f, r.toLowerCase()); });
      else for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) for (const f of ((t.full || t.cells)[r]?.[c] || []))
        cb(t, vparse(nfc(t.lemma), t.tense, t.mood, t.voice, r + 1, c ? "plural" : "singular"), f, t.tense);
    } };
    const infUnit = new Map(trainer.pool.book.filter(it => it.mood === "infinitive" && it.src === "book").map(it => [`${it.tense}|${it.voice}`, it.tenseUnit]));
    walk(trainer.refTables(u, false), (t, k, f, tense) => {
      verbForms++; want.set(k, true);
      const it = T.get(k);
      if (!it || !it.forms.includes(nfc(f))) bad.push(`Quiz Units 1–${u}: the Reference form ${f} (${k}) isn't in the test bank`);
      const newHere = (t.section === "inf" ? infUnit.get(`${tense}|${t.voice || "active"}`) : t.tenseUnit) === u;
      if (newHere && !O.has(k)) bad.push(`Quiz Unit ${u} only: ${f} (${k}) is new in Unit ${u} but not in the bank`);
    });
    // The page's "Unit N verbs only" also shows παιδεύω and H&Q's printed tables: hold it to the Unit N verbs' copies.
    walk(trainer.refTables(u, true), (t, k, f) => { if (T.get(k)?.vocabUnit === u && !O.get(k)?.forms.includes(nfc(f))) bad.push(`Quiz Unit ${u} only: the Unit ${u} verb form ${f} (${k}) isn't in the bank`); });
    for (const k of T.keys()) if (!want.has(k)) bad.push(`Quiz Units 1–${u}: verb item ${k} isn't on the Reference page`);
    for (const it of only) if (!(it.vocabUnit === u || it.tenseUnit === u)) bad.push(`Quiz Unit ${u} only: ${it.id} is neither a Unit ${u} word nor a Unit ${u} form`);
    // c + d. Answers and ambiguity, recomputed.
    const bySurface = new Map();
    for (const it of through) for (const f of it.forms) for (const v of vars(f)) {
      const k = `${grp(it.pos)}|${key(v)}`;
      if (!bySurface.has(k)) bySurface.set(k, new Set());
      bySurface.get(k).add(it.id);
    }
    for (const it of through) {
      items++;
      if (!it.forms.length || it.forms.some(f => !String(f).trim())) bad.push(`Quiz Units 1–${u}: ${it.id} has no answer`);
      if (!it.forms.every(f => ACC.test(nfc(f).normalize("NFD")) || /^[οἡαἱ]ἱ?$|^[ὁἡοἱαἱ]$/.test(f) || it.pos === "article" || it.pos === "pron"))
        bad.push(`Quiz Units 1–${u}: ${it.id} has an unaccented form (${it.forms.join(" / ")})`);
      const ids = new Set(it.parses.map(p => p.id));
      if (!ids.has(it.id)) bad.push(`Quiz Units 1–${u}: ${it.id}'s parses leave out its own`);
      const need = new Set();
      for (const f of it.forms) for (const v of vars(f)) for (const id of bySurface.get(`${grp(it.pos)}|${key(v)}`) || []) need.add(id);
      for (const id of need) if (!ids.has(id)) bad.push(`Quiz Units 1–${u}: ${it.forms[0]} (${it.id}) is also ${id}, but that parse isn't accepted`);
      if (need.size > 1) ambiguous++;
      // e. Reference links (each verb + paradigm once).
      if (it.pos === "verb") {
        const lu = Math.max(it.vocabUnit, it.tenseUnit), lk = `${lu}|${it.lemma}|${it.parse.tense}|${it.parse.mood}|${it.parse.voice}`;
        if (!linkSeen.has(lk)) {
          const href = trainer.refHref(lu, it.lemma, it.parse.tense, it.parse.mood, it.parse.voice);
          const m = href && href.match(/^#\/reference\/(\d+)\?p=([^&]+)&v=(.+)$/);
          const ok = !!m && rendered(Number(m[1])).has(`ref-${m[2]}--${m[3]}`);
          linkSeen.set(lk, ok); links++;
          if (!ok) bad.push(`Quiz: ${it.id}'s Reference link ${href} doesn't land on a rendered table`);
        }
      }
    }
  }
  // Spot checks of the ambiguity the user named.
  const b5 = Q.through(5).items;
  const pai = b5.find(it => it.lemma === nfc("παιδεύω") && it.forms.includes(nfc("παιδεύῃ")));
  if (!pai || pai.parses.length !== 3) bad.push(`Quiz: παιδεύῃ should have 3 parses in Units 1–5, has ${pai?.parses.length}`);
  const logoi = b5.find(it => it.lemma === nfc("λόγος") && it.forms.includes(nfc("λόγοι")));
  if (!logoi || logoi.parses.map(p => p.parse.case).sort().join() !== "nominative,vocative") bad.push("Quiz: λόγοι should parse as nom. and voc. pl.");
  // b. The declension rule against every printed 1st/2nd-declension noun and -ος adjective.
  const lemmaKey = s => nfc(String(s).split(/[,\s]/)[0].replace(/["“”]/g, ""));
  const vocabOf = new Map();
  for (const e of trainer.vocab.entries) vocabOf.set(`${e.cat}|${lemmaKey(e.greek)}`, e);
  const NOT_BY_RULE = new Set([nfc("νοῦς")]);   // §152: a contracted 2nd-declension noun; printed, so served as printed
  const paradigms = [];
  for (const t of trainer.refTables(Infinity)) {
    if (t.lemma || t.tense || t.kind === "ending" || !["n1", "n2", "adj"].includes(t.section)) continue;
    const lemma = lemmaKey(t.label), adj = t.section === "adj";
    const e = vocabOf.get(`${adj ? "adjective" : "noun"}|${lemma}`);
    const r = Q.printedSlots(t);
    if (r.skip) continue;
    let d;
    if (adj) { const hw = e && Q.adjHead(e); d = hw ? Q.declineAdj(hw) : { error: "no headword" }; }
    else d = e ? Q.declineNoun(Q.nounHead(e)) : { error: "not in the vocabulary" };
    if (d.error) {
      if (!adj && !NOT_BY_RULE.has(lemma)) bad.push(`Quiz: the declension rule can't decline H&Q's printed ${t.label} (${d.error})`);
      continue;
    }
    const miss = r.slots.filter(s => !s.forms.includes(d.forms[adj ? `${s.case}|${s.number}|${s.gender}` : `${s.case}|${s.number}`]));
    for (const s of miss) bad.push(`Quiz: the declension rule gives ${t.label} ${s.gender || ""} ${s.case} ${s.number} = ${d.forms[adj ? `${s.case}|${s.number}|${s.gender}` : `${s.case}|${s.number}`]}, H&Q prints ${s.forms.join(" / ")}`);
    paradigms.push({ label: t.label, cells: r.slots.length });
  }
  for (const need of ["τέχνη", "ψῡχή", "χώρᾱ", "ἀγορᾱ́", "λόγος", "ἄνθρωπος", "ἀδελφός", "νῆσος", "δῶρον", "ἔργον", "θάλαττα", "μοῦσα", "γέφῡρα", "μοῖρα",
    "πολῑ́της", "ποιητής", "νεᾱνίᾱς", "ἀγαθός", "ἄξιος", "ἄδικος"])
    if (!paradigms.some(p => lemmaKey(p.label) === nfc(need))) bad.push(`Quiz: H&Q's printed ${need} wasn't checked against the declension rule`);
  // Every vocabulary noun/adjective through supportedThrough is in the bank or listed as left out.
  const all = Q.through(supportedThrough);
  const inBank = new Set(all.items.map(it => `${it.pos === "adj" ? "adjective" : it.pos}|${it.lemma}`));
  const left = new Set(all.excluded.map(x => nfc(x.lemma)));
  for (const e of trainer.vocab.entries) if ((e.cat === "noun" || e.cat === "adjective") && e.unit <= supportedThrough) {
    const l = lemmaKey(e.greek);
    if (!inBank.has(`${e.cat}|${l}`) && !left.has(l)) bad.push(`Quiz: the Unit ${e.unit} ${e.cat} ${e.greek} is neither in the bank nor listed as left out`);
  }
  // f. Seeds and grading.
  const s = { unit: 5, mode: "through", types: ["parse", "produce", "translate"], pos: ["verb", "noun", "adj", "article"], n: "25" };
  const a = Q.sample(s, "abc123").map(q => q.it.id + q.type), b = Q.sample(s, "abc123").map(q => q.it.id + q.type);
  if (a.length !== 25 || a.join() !== b.join()) bad.push("Quiz: the same seed doesn't give the same 25 questions");
  const accepts = (given, forms) => Q.gradeForm(given, forms.map(nfc)) === "right";
  for (const [g, fs] of [["παιδευθεῖμεν", ["παιδευθεῖμεν", "παιδευθείημεν"]], ["παιδευθείημεν", ["παιδευθεῖμεν", "παιδευθείημεν"]],
    ["παιδεύει", ["παιδεύῃ", "παιδεύει"]], ["παιδεύουσιν", ["παιδεύουσι(ν)"]], ["παιδεύουσι", ["παιδεύουσι(ν)"]],
    ["γεγραμμέναι εἰσίν", ["γεγραμμένοι εἰσί(ν)"]], ["γεγραμμένοι, -αι, -α εἰσί", ["γεγραμμένοι εἰσί(ν)"]],
    ["τὸν", ["τόν"]], ["αγορας", ["ἀγορᾱ́ς"]].slice(0, 0), ["ἀγοράς", ["ἀγορᾱ́ς"]]])
    if (g && !accepts(g, fs)) bad.push(`Quiz: Produce doesn't accept ${g} for ${fs.join(" / ")}`);
  if (accepts("ἀγορας", ["ἀγορᾱ́ς"])) bad.push("Quiz: Produce accepts a form with no accent (accents count)");
  return { bad, sizes, verbForms, items, ambiguous, links, paradigms };
}

// Check 18: the unit verb's display-only table equals the Reference page's ⚙ built copy for that verb.
function unitVerbAudit(trainer) {
  const bad = [], seen = new Set(), ref = trainer.refTables(Infinity);
  const famOf = lemma => { const pp5 = (trainer.built.verbs.find(v => nfc(v.lemma) === nfc(lemma))?.pp || [])[4] || "";
    const d = nfc(pp5).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return /μμαι$/.test(d) ? "labial" : /γμαι$/.test(d) ? "palatal" : /σμαι$/.test(d) ? "dental" : "vowel"; };
  let tables = 0;
  for (let u = 1; u <= 20; u++) for (const mode of ["only", "through"]) for (const t of trainer.tables({ unit: u, mode })) {
    const uv = t.unitVerb;
    if (!uv || seen.has(t.id)) continue;
    seen.add(t.id); tables++;
    const where = `Ending tables “${t.label}” (${t.id}): e.g. ${uv.lemma}`, voice = t.voice || "active";
    let want = null, copy = null;
    if (t.mood === "infinitive") {
      copy = ref.find(r => r.section === "inf" && nfc(r.lemma) === nfc(uv.lemma) && (r.voice || "active") === voice);
      const i = copy ? copy.rows.findIndex(r => r.toLowerCase() === t.tense) : -1;
      want = i >= 0 && !copy.dash?.[i] ? [[(copy.cells[i]?.[0] || []).map(nfc)]] : null;
    } else {
      copy = ref.find(r => r.tense === t.tense && r.mood === t.mood && (r.voice || "active") === voice && nfc(r.lemma) === nfc(uv.lemma));
      want = copy ? (copy.full || copy.cells).map(row => row.map(f => f && f.map(nfc))) : null;
    }
    if (!want) { bad.push(`${where} has no matching table on the Reference page`); continue; }
    if (!copy.built) bad.push(`${where}: the Reference copy is H&Q's printed table, not ⚙ built`);
    if (JSON.stringify(uv.full) !== JSON.stringify(want)) bad.push(`${where}: forms ${JSON.stringify(uv.full)} aren't the Reference copy's ${JSON.stringify(want)}`);
    const vu = trainer.built.verbs.find(v => nfc(v.lemma) === nfc(uv.lemma))?.unit;
    if (vu !== uv.unit) bad.push(`${where}: labelled Unit ${uv.unit}, but the verb is Unit ${vu} vocabulary`);
    if (vu > t.tenseUnit) bad.push(`${where}: Unit ${vu} vocabulary on a Unit ${t.tenseUnit} card`);
    if (vu < t.tenseUnit && !uv.earlier) bad.push(`${where}: Unit ${vu} vocabulary on a Unit ${t.tenseUnit} card, not labelled with its unit`);
    if (t.stemType && !t.stemType.startsWith(famOf(uv.lemma))) bad.push(`${where}: a ${famOf(uv.lemma)} stem on the ${t.stemType} card`);
  }
  return { bad, tables };
}

// Check 10: one infinitive table per verb and voice, holding every infinitive tense taught so far.
function combosAudit(trainer) {
  const bad = [];
  let rows = 0;
  const MODEL = nfc("παιδεύω"), ROMAN = ["I", "II", "III", "IV", "V", "VI"];
  const deAcc = x => nfc(x).normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC");
  const jumpIds = new Map();
  const rendered = unit => { if (!jumpIds.has(unit)) { const j = trainer.refJump(unit, false);
    jumpIds.set(unit, new Set([...j.tables.map(t => t.id), ...j.tables.flatMap(t => t.spans || [])].filter(Boolean))); } return jumpIds.get(unit); };
  const ppNum = (tense, voice) => tense === "present" || tense === "imperfect" ? 1
    : tense === "perfect" || tense === "pluperfect" ? (voice === "active" ? 4 : 5)
    : tense === "future" ? (voice === "passive" ? 6 : 2) : tense === "aorist" ? (voice === "passive" ? 6 : 3) : 0;
  for (let u = 1; u <= 20; u++) for (const mode of ["only", "through"]) {
    const where = `Forms at a glance, ${mode === "only" ? `Unit ${u} only` : `Units 1–${u}`}`;
    const want = new Set();
    for (const t of trainer.tables({ unit: u, mode })) if (t.tense && t.mood) want.add(`${t.tense}|${t.mood}|${t.voice || "active"}`);
    for (const t of trainer.refTables(u, mode === "only")) {
      // The Reference page's "Unit N only" keeps every παιδεύω table through N (it narrows the vocabulary verbs), so a
      // Unit N only row is a table (or infinitive table) from Unit N itself.
      if (nfc(t.lemma || "") !== MODEL || (mode === "only" && t.tenseUnit !== u)) continue;
      if (t.section === "inf") t.rows.forEach((r, i) => { if (!t.dash?.[i]) want.add(`${r.toLowerCase()}|infinitive|${t.voice || "active"}`); });
      else if (t.tense && t.mood) want.add(`${t.tense}|${t.mood}|${t.voice || "active"}`);
    }
    const got = trainer.combos(u, mode);
    rows += got.length;
    const count = new Map();
    for (const r of got) count.set(r.key, (count.get(r.key) || 0) + 1);
    for (const k of want) if (!count.has(k)) bad.push(`${where}: no row for ${k.replace(/\|/g, " ")} (it is on the Ending tables or the Reference page)`);
    for (const [k, n] of count) {
      if (n > 1) bad.push(`${where}: ${n} rows for ${k.replace(/\|/g, " ")}`);
      if (!want.has(k)) bad.push(`${where}: row ${k.replace(/\|/g, " ")} is on neither the Ending tables nor the Reference page`);
    }
    for (const r of got) {
      const id = `${where}, ${r.label}`;
      if (!String(r.english || "").trim()) bad.push(`${id}: no English`);
      if (!String(r.ppText || "").trim()) { bad.push(`${id}: no principal part`); continue; }
      const n = ppNum(r.tense, r.voice);
      if (!r.ppText.startsWith(`PP ${ROMAN[n - 1]} `)) bad.push(`${id}: cites “${r.ppText}”, but H&Q §19 builds it on PP ${ROMAN[n - 1]}`);
      const stem = deAcc(r.part.stem), form = deAcc(r.form);
      if (!form.startsWith(stem)) bad.push(`${id}: stem ${r.part.stem}- isn't the start of παιδεύω's ${r.form}`);
      const mustAug = r.tense === "imperfect" || r.tense === "pluperfect" || (r.tense === "aorist" && r.mood === "indicative");
      const noAug = (r.tense === "aorist" && r.mood !== "indicative") || (r.tense === "future" && r.voice === "passive");
      if (mustAug !== r.ppText.includes("+ augment") || noAug !== r.ppText.includes("− augment"))
        bad.push(`${id}: “${r.ppText}” has the augment wrong`);
      if (!r.href) bad.push(`${id}: no Reference link`);
      else {
        const m = r.href.match(/^#\/reference\/(\d+)\?p=([^&]+)&v=(.+)$/);
        if (!m || !rendered(Number(m[1])).has(`ref-${m[2]}--${m[3]}`)) bad.push(`${id}: Reference link ${r.href} doesn't land on a rendered table`);
      }
    }
  }
  return { bad, rows };
}

function infinitiveAudit(trainer) {
  const bad = [];
  const book = trainer.pool.book.filter(it => it.src === "book" && it.mood === "infinitive");
  const PAI = nfc("παιδεύω");
  for (let n = 1; n <= 20; n++) for (const only of [false, true]) {
    const mode = only ? `“Unit ${n} verbs only”` : `“through Unit ${n}”`;
    const infs = trainer.refTables(n, only).filter(t => t.section === "inf");
    const seen = new Map();
    for (const t of infs) {
      const k = `${nfc(t.lemma)}|${t.voice || "active"}` + (only ? `|${t.tenseUnit}` : "");
      if (seen.has(k)) bad.push(`Reference ${mode}: ${t.lemma} has two ${t.voice || "active"} infinitive tables${only ? ` in Unit ${t.tenseUnit}` : ""} (“${seen.get(k)}” and “${t.label}”)`);
      seen.set(k, t.label);
      const dup = t.rows.find((r, i) => t.rows.indexOf(r) !== i);
      if (dup) bad.push(`Reference ${mode}: “${t.label}” has the ${dup} row twice`);
    }
    if (only) continue;
    for (const voice of ["active", "passive"]) {
      const taught = [...new Set(book.filter(it => nfc(it.lemma) === PAI && (it.voice || "active") === voice && it.tenseUnit <= n).map(it => it.tense))];
      if (!taught.length) continue;
      const model = infs.filter(t => nfc(t.lemma) === PAI && (t.voice || "active") === voice);
      if (model.length !== 1) { bad.push(`Reference ${mode}: παιδεύω has ${model.length} ${voice} infinitive tables, want 1`); continue; }
      for (const t of [model[0], ...(model[0].members || [])]) {
        const rows = t.rows.map(r => r.toLowerCase());
        for (const tn of taught) if (!rows.includes(tn)) bad.push(`Reference ${mode}: “${t.label}” leaves out the ${tn} ${voice} infinitive (taught by Unit ${n})`);
        t.rows.forEach((r, i) => { const has = t.cells[i]?.[0]?.length && t.cells[i][0][0];
          if (!has && !t.dash?.[i]) bad.push(`Reference ${mode}: “${t.label}” row ${r} has neither a form nor a reason`); });
      }
    }
  }
  // H&Q's own forms for vocabulary verbs (the §43.14 perfect passives) sit in the verb's table and cite their page.
  const all = trainer.refTables(Infinity).filter(t => t.section === "inf");
  for (const it of book.filter(it => nfc(it.lemma) !== nfc("παιδεύω"))) {
    const voice = it.voice || "active", t = all.find(t => nfc(t.lemma) === nfc(it.lemma) && (t.voice || "active") === voice);
    const i = t ? t.rows.findIndex(r => r.toLowerCase() === it.tense) : -1;
    if (i < 0) { bad.push(`Reference: H&Q's printed ${it.tense} ${voice} infinitive of ${it.lemma} is in no table`); continue; }
    if (nfc(t.cells[i][0][0]) !== nfc(it.forms[0])) bad.push(`Reference “${t.label}”: ${it.tense} shows ${t.cells[i][0][0]}, not H&Q's ${it.forms[0]}`);
    if (!new RegExp(`${it.tense[0].toUpperCase() + it.tense.slice(1)}: H&Q's .*p\\. ${it.page}\\b`).test(t.source)) bad.push(`Reference “${t.label}”: the ${it.tense} row doesn't cite H&Q p. ${it.page}`);
  }
  return { bad };
}

// Check 9: every Formation line names its stem's principal part, the right one, and the verb's own.
const ROMAN = ["I", "II", "III", "IV", "V", "VI"];
const expectedPP = (tense, voice) => {   // H&Q §19, written out independently of the trainer's ppNumOf
  const mp = voice === "passive" || voice === "middle";
  return { present: 1, imperfect: 1, future: voice === "passive" ? 6 : 2, aorist: voice === "passive" ? 6 : 3,
    perfect: mp ? 5 : 4, pluperfect: mp ? 5 : 4 }[tense];
};
const bare = s => nfc(s).normalize("NFD").replace(/\p{M}/gu, "").normalize("NFC");
const isDashPart = s => !s || /^[—–-]+$/.test(String(s).trim());
function formationAudit(trainer) {
  const printed = new Map(trainer.partsRows(20, "through").filter(r => r.parts).map(r => [nfc(r.lemma), r.parts.map(nfc)]));
  const builtPP = new Map(trainer.built.verbs.map(v => [nfc(v.lemma), v.pp.map(nfc)]));
  const bad = [], perPP = {};
  let lines = 0;
  const texts = new Set();
  for (const t of trainer.refTables(Infinity)) {
    if (t.section === "inf") { infFormationAudit(t); continue; }
    if (!t.tense) continue;
    const voice = t.voice || "active", where = `Unit ${t.tenseUnit} “${t.label}” (${t.id})`;
    const { text } = trainer.formation(t);
    if (!text) { bad.push(`${where} has no Formation line`); continue; }
    lines++; texts.add(text);
    // "the stem consonant" is a consonant, not a stem.
    if (/\bstem\b(?! \(PP (?:I|II|III|IV|V|VI)\b)(?! consonant)/.test(text)) bad.push(`${where}: a stem with no principal part named: “${text}”`);
    const cites = [...text.matchAll(/\(PP (VI|V|IV|III|II|I)\b([^)]*)\)/g)];
    if (!cites.length) { bad.push(`${where}: the Formation line names no principal part: “${text}”`); continue; }
    const n = expectedPP(t.tense, voice), parts = printed.get(nfc(t.lemma)) || builtPP.get(nfc(t.lemma));
    const part = parts?.[n - 1];
    if (!parts) bad.push(`${where}: no principal parts on file for ${t.lemma}`);
    else if (isDashPart(part)) bad.push(`${where}: built on PP ${ROMAN[n - 1]}, which H&Q prints as a dash for ${t.lemma}`);
    const alts = String(part || "").split(/\s+or\s+/).map(x => x.replace(/\([^)]*\)/g, "").trim()).filter(Boolean).map(nfc);
    for (const [, num, rest] of cites) {
      perPP[num] = (perPP[num] || 0) + 1;
      if (num !== ROMAN[n - 1]) bad.push(`${where}: cites PP ${num}, but the ${t.tense} ${voice} is built on PP ${ROMAN[n - 1]}`);
      const body = nfc(rest.trim());
      if (!body || !alts.some(a => body.startsWith(a))) bad.push(`${where}: cites “PP ${num} ${body}”, not ${t.lemma}'s own PP ${ROMAN[n - 1]} (${part})`);
      // "A − [augment − ]END → S-" (also "A or B − END → S- / T-", and ", or "-joined segments): check each stem.
      for (const seg of body.split(/;/)[0].split(/, or /)) {
        const m = seg.match(/^(.+?) − (augment − )?(\S+) → (.+)$/);
        if (!m) continue;
        const forms = m[1].split(/ or /).map(bare), end = bare(m[3]), stems = m[4].split(" / ").map(x => bare(x.replace(/-$/, "")));
        for (const st of stems) {
          const fit = forms.some(f => {
            const b = f.replace(/^-/, "");
            if (!b.endsWith(end)) return false;
            const base = b.slice(0, b.length - end.length);
            if (!m[2]) return base === st;
            const strip = x => x.replace(/^[αεηιουω\u0345]+/, "");
            return strip(base).endsWith(strip(st));   // ἐπαιδευθ → παιδευθ, ἠχθ → ἀχθ
          });
          if (!fit) bad.push(`${where}: “${seg}” — ${st}- isn't ${m[1]} minus ${m[2] ? "the augment and " : ""}-${end}`);
        }
      }
    }
  }
  // Infinitive tables: one clause per row with a form, "Row: PP N PART − [augment − ]END → STEM- + -ENDING …".
  function infFormationAudit(t) {
    const voice = t.voice || "active", where = `Unit ${t.tenseUnit} “${t.label}” (${t.id})`;
    const { lines: ls } = trainer.formation(t);
    const want = t.rows.filter((_, i) => !t.dash?.[i]);
    if (!ls || ls.length !== want.length) { bad.push(`${where}: ${ls ? ls.length : 0} Formation clauses for ${want.length} rows`); return; }
    const parts = printed.get(nfc(t.lemma)) || builtPP.get(nfc(t.lemma));
    ls.forEach((line, i) => {
      lines++; texts.add(line);
      const tense = want[i].toLowerCase(), n = expectedPP(tense, voice);
      const m = line.match(/^(\w+): PP (VI|V|IV|III|II|I) (.*)$/);
      if (!m || m[1] !== want[i]) { bad.push(`${where}: clause ${i + 1} isn't “${want[i]}: PP …”: “${line}”`); return; }
      perPP[m[2]] = (perPP[m[2]] || 0) + 1;
      if (m[2] !== ROMAN[n - 1]) bad.push(`${where}: the ${tense} cites PP ${m[2]}, but the ${tense} ${voice} infinitive is built on PP ${ROMAN[n - 1]}`);
      const part = parts?.[n - 1];
      if (!parts) { bad.push(`${where}: no principal parts on file for ${t.lemma}`); return; }
      if (isDashPart(part)) { bad.push(`${where}: the ${tense} is built on PP ${ROMAN[n - 1]}, which H&Q prints as a dash for ${t.lemma}`); return; }
      const alts = String(part).split(/\s+or\s+/).map(x => x.replace(/\([^)]*\)/g, "").trim()).filter(Boolean).map(nfc);
      const body = nfc(m[3]);
      if (!alts.some(a => body.startsWith(a))) bad.push(`${where}: the ${tense} cites “PP ${m[2]} ${body}”, not ${t.lemma}'s own PP ${ROMAN[n - 1]} (${part})`);
      const seg = body.match(/^(.+?) − (augment − )?(\S+) → (\S+)- \+ -/);
      if (!seg) return;   // no clean stem (a fallback clause names the part and the form only)
      const f = bare(seg[1]).replace(/^-/, ""), end = bare(seg[3]), st = bare(seg[4]);
      const base = f.endsWith(end) ? f.slice(0, f.length - end.length) : null;
      const strip = x => x.replace(/^[αεηιουω\u0345]+/, "");
      if (base == null || (seg[2] ? !strip(base).endsWith(strip(st)) : base !== st))
        bad.push(`${where}: “${line}” — ${st}- isn't ${seg[1]} minus ${seg[2] ? "the augment and " : ""}-${end}`);
    });
  }
  return { bad, lines, texts: texts.size, perPP };
}

const gapLabel = e => e.label + (e.kind === "verb" && e.lemma && e.lemma !== "παιδεύω" ? ` of ${e.lemma}` : "")
  + (e.kind !== "verb" && e.lemma && !e.label.includes(e.lemma) ? `: ${e.lemma}` : "");

function coverageBlock(rows) {
  const units = {}, gaps = {};
  for (const { e, req, missing } of rows) {
    const u = (units[e.unit] ||= { drill: 0, tables: 0 });
    for (const r of req) u[r]++;
    if (missing.length) (gaps[e.unit] ||= []).push({ id: e.id, section: e.section, label: gapLabel(e), missing });
  }
  return { supportedThrough, units, gaps };
}

function doc(rows, onlyTables, onlyDrill, sounds, verbs, parts, glossary, formation, quiz) {
  const L = [];
  L.push("# Greek trainer coverage (H&Q Units 1–20)", "");
  L.push("Generated by `node scripts/greek-trainer/coverage.mjs --write`. Do not edit by hand.", "");
  L.push("The manifest (`scripts/greek-trainer/hq-paradigms.json`) lists every paradigm Hansen & Quinn introduces, taken from the vault's",
    "per-§ notes. The audit runs the trainer's own code and checks, unit by unit, what the **verb drill** and the **“Unit N only” ending",
    "tables** actually serve. Finite verb paradigms need both; infinitives need the drill; declined forms need a table.", "");
  L.push(`**Supported through Unit ${supportedThrough}.** Any gap in Units 1–${supportedThrough} fails the build unless it is listed in`,
    "`knownGaps` with a reason. Gaps in later units are listed here and on each unit's screen (“Not in the trainer yet”).", "");
  L.push("| Unit | Paradigms | Served | Gaps | “Unit N only” tables | “Unit N only” drill forms | Status |", "|---|---|---|---|---|---|---|");
  for (let u = 1; u <= 20; u++) {
    const mine = rows.filter(r => r.e.unit === u);
    const gaps = mine.filter(r => r.missing.length);
    const status = !mine.length ? "nothing new" : !gaps.length ? "covered"
      : u <= supportedThrough ? "known gaps" : gaps.length === mine.length ? "not yet" : "partial";
    L.push(`| ${u} | ${mine.length} | ${mine.length - gaps.length} | ${gaps.length} | ${onlyTables.get(u).length} | ${onlyDrill.get(u).length} | ${status} |`);
  }
  L.push("");
  for (let u = 1; u <= 20; u++) {
    const mine = rows.filter(r => r.e.unit === u);
    if (!mine.length) continue;
    L.push(`## Unit ${u}`, "", "| § | Paradigm | Needs | Drill | Tables | Note |", "|---|---|---|---|---|---|");
    for (const { e, req, served, missing } of mine) {
      const mark = k => !req.includes(k) ? "–" : served[k] ? "✓" : "✗";
      const note = missing.length ? (knownGaps.get(e.id) ? `known gap: ${knownGaps.get(e.id)}` : "**not in the trainer yet**") : "";
      L.push(`| ${e.section} | ${gapLabel(e)} | ${req.join(", ")} | ${mark("drill")} | ${mark("tables")} | ${note} |`);
    }
    L.push("");
  }
  const KIND = { article: "The article", n1: "Nouns: 1st declension", n2: "Nouns: 2nd declension", n3: "Nouns: 3rd declension",
    adj: "Adjectives", pron: "Pronouns", verb: "Verb ending tables", infinitives: "Infinitives (Reference page)" };
  L.push("## English “Sounds like” lines", "",
    "Every table the trainer serves, in any unit, shows what its forms mean in English (the model word, by person or by case)",
    "on the quiz prompt, the reveal, both flashcard faces and the Reference page. The check fails if a served table has no line,",
    "or if the line contains Greek.", "", "| Kind | Tables | With English |", "|---|---|---|");
  for (const [k, n] of Object.entries(sounds.kinds)) L.push(`| ${KIND[k] || k} | ${n} | ${n - sounds.bad.filter(b => b.kind === k).length} |`);
  L.push(`| **All** | **${sounds.all.length}** | **${sounds.all.length - sounds.bad.length}** |`, "");
  L.push("## Vocabulary verbs on the Reference page", "",
    `Each of the ${verbs.groups} παιδεύω tables on the Reference page is followed by a copy for every verb in the vocabulary`,
    "(H&Q's own table where it prints one, otherwise ⚙ built by rule by `build_vocab_drill.py`). A verb that lacks a paradigm",
    `(a dash in H&Q's principal parts, a deponent, a rule not built yet) is listed under the tables with the reason. Verbs in Units ≤ ${supportedThrough}`,
    "fail the build if a copy is missing without a reason.", "",
    "| Vocabulary unit | Verbs | Copies | Not shown (with reason) |", "|---|---|---|---|");
  for (const [u, x] of Object.entries(verbs.perUnit)) L.push(`| ${u} | ${x.verbs.size} | ${x.tables} | ${x.missing} |`);
  L.push("");
  L.push("## Principal parts page", "",
    `The Principal parts page (\`#/parts\`) lists all ${parts.total} vocabulary verbs, one per row, with H&Q's six principal parts`,
    "(a dash where a part doesn't exist). A compound or single form H&Q lists without parts says so and names the verb it follows.",
    "The check fails if a vocabulary verb is missing, or a row doesn't have six part cells.", "",
    "| Vocabulary unit | Verbs | With six parts | Listed without parts |", "|---|---|---|---|");
  for (const [u, x] of Object.entries(parts.perUnit)) L.push(`| ${u} | ${x.verbs} | ${x.six} | ${x.none} |`);
  L.push("");
  L.push("## Glossary", "",
    `The Glossary page (\`#/glossary\`) searches H&Q's back-of-book Greek–English Vocabulary (pp. 775–792): ${glossary.entries} entries,`,
    `${glossary.uncertain} flagged as low-confidence transcriptions. ${glossary.found} of the ${glossary.vocab} vocabulary words match a glossary headword`,
    `(${glossary.exact} character for character); ${glossary.exceptions} are listed in \`glossary-exceptions.json\` with a reason.`,
    "The check fails if a vocabulary word can't be found, or typing its first word without accents doesn't return it as an exact hit.", "");
  L.push("## Formation lines name their principal part", "",
    `Every served verb table (${formation.lines} of them, ${formation.texts} distinct lines) has a “Formation:” line, and every stem in it names`,
    "the principal part it comes from, in that table's own verb: “Unaugmented aorist passive stem (PP VI ἐπαιδεύθην − augment − ην → παιδευθ-)”.",
    "The check fails if a stem has no PP, the PP is the wrong one for the tense and voice, the cited form isn't the verb's own part",
    "(or is a dash in H&Q), or the stem shown isn't the part minus its ending. Infinitive tables get one clause per row",
    "(“Perfect: PP IV πεπαίδευκα − α → πεπαιδευκ- + -έναι (accent on the penult)”), each held to its own tense's part.", "",
    "Infinitives (check 10): “through Unit N” shows ONE infinitive table per verb and voice, with every infinitive tense",
    "taught through N as a row (a “—” row with the reason when the verb lacks the part); duplicates fail.", "",
    "| Principal part | Citations |", "|---|---|");
  for (const r of ROMAN) if (formation.perPP[r]) L.push(`| PP ${r} | ${formation.perPP[r]} |`);
  L.push("");
  L.push("## Quiz test bank", "",
    "The Quiz page (`#/quiz?u=N&mode=only|through`) asks from a test bank generated from the trainer's own data: every form on the",
    "Reference page's per-verb tables (H&Q's printed forms and the ⚙ built copies, finite forms and infinitives), H&Q's printed",
    "declension tables (nouns, adjectives, the article, case × number × gender pronoun tables), and every other 1st/2nd-declension",
    "vocabulary noun and -ος adjective ⚙ declined by rule. The rule reproduces every printed 1st/2nd-declension paradigm cell for cell",
    `(${quiz.paradigms.map(p => p.label.split(/[,\s]/)[0]).join(", ")}); a word it can't decline is listed on the page as left out.`,
    "“Unit N only” = every form (through N) of a word first taught in Unit N, plus every form first taught in Unit N (its tenseUnit) on",
    "earlier words. A parse is graded against every parse its form has in Units 1–N.", "",
    "| Unit | Unit N only | Units 1–N | Verbs | Nouns | Adjectives | Article | Pronouns |", "|---|---|---|---|---|---|---|---|");
  for (const [u, x] of Object.entries(quiz.sizes))
    L.push(`| ${u} | ${x.only} | ${x.through} | ${x.pos.verb || 0} | ${x.pos.noun || 0} | ${x.pos.adj || 0} | ${x.pos.article || 0} | ${x.pos.pron || 0} |`);
  L.push("");
  return L.join("\n");
}

const COVERAGE_LINE = /^const TRAINER_COVERAGE = .*;$/m;
const trainer = await loadTrainer();
const { rows, onlyTables, onlyDrill } = audit(trainer);
const block = coverageBlock(rows);
const blockLine = `const TRAINER_COVERAGE = ${JSON.stringify(block)};`;
const sounds = soundsAudit(trainer);
const verbs = verbAudit(trainer);
const parts = partsAudit(trainer);
const glossary = glossaryAudit(trainer);
const formation = formationAudit(trainer);
const infinitives = infinitiveAudit(trainer);
const jumps = jumpAudit(trainer);
const jumpForm = jumpFormAudit(trainer);
const appendix = appendixAudit(trainer);
const words = wordsAudit(trainer);
const endingsOnly = endingsOnlyAudit(trainer);
const unique = uniqueTablesAudit(trainer);
const infCards = infinitiveCardsAudit(trainer);
const unitVerbs = unitVerbAudit(trainer);
const quiz = quizAudit(trainer);
const combos = combosAudit(trainer);
const docText = doc(rows, onlyTables, onlyDrill, sounds, verbs, parts, glossary, formation, quiz);

if (WRITE) {
  if (!COVERAGE_LINE.test(trainer.html)) throw new Error("index.html has no TRAINER_COVERAGE line");
  fs.writeFileSync(TRAINER, trainer.html.replace(COVERAGE_LINE, () => blockLine));
  fs.mkdirSync(new URL(".", DOC), { recursive: true });
  fs.writeFileSync(DOC, docText + "\n");
  console.log("greek-trainer: wrote TRAINER_COVERAGE and docs/greek-trainer-coverage.md");
}

const failures = [];
const ids = new Set();
for (const e of paradigms) {
  if (ids.has(e.id)) failures.push(`duplicate manifest id ${e.id}`);
  ids.add(e.id);
}
for (const id of knownGaps.keys()) if (!ids.has(id)) failures.push(`knownGaps names an unknown manifest id: ${id}`);
for (const { e, missing } of rows) {
  if (e.unit > supportedThrough) continue;
  if (missing.length && !knownGaps.has(e.id))
    failures.push(`Unit ${e.unit} ${e.section} “${gapLabel(e)}” (${e.id}) is not served in: ${missing.join(", ")}`);
  if (!missing.length && knownGaps.has(e.id)) failures.push(`knownGaps entry ${e.id} is stale: the trainer serves it now`);
}
for (let u = 1; u <= supportedThrough; u++) {
  const mine = rows.filter(r => r.e.unit === u);
  if (mine.some(r => r.req.includes("tables")) && !onlyTables.get(u).length)
    failures.push(`“Unit ${u} only” would show 0 ending tables, but the manifest says Unit ${u} introduces ${mine.filter(r => r.req.includes("tables")).length} tables`);
  if (mine.some(r => r.req.includes("drill")) && !onlyDrill.get(u).length)
    failures.push(`“Unit ${u} only” would show 0 verb-drill forms, but the manifest says Unit ${u} introduces verb forms`);
}
for (const b of sounds.bad) failures.push(b.msg);
for (const b of verbs.bad) failures.push(b);
for (const b of parts.bad) failures.push(b);
for (const b of glossary.bad) failures.push(b);
for (const b of formation.bad) failures.push(b);
for (const b of infinitives.bad) failures.push(b);
for (const b of jumps.bad) failures.push(b);
for (const b of jumpForm.bad) failures.push(b);
for (const b of appendix.bad) failures.push(b);
for (const b of words.bad) failures.push(b);
for (const b of endingsOnly.bad) failures.push(b);
for (const b of unique.bad) failures.push(b);
for (const b of infCards.bad) failures.push(b);
for (const b of unitVerbs.bad) failures.push(b);
for (const b of quiz.bad) failures.push(b);
for (const b of combos.bad) failures.push(b);
const live = loadTrainerCoverage(trainer.html);
if (!WRITE && JSON.stringify(live) !== JSON.stringify(block))
  failures.push("index.html's TRAINER_COVERAGE is out of date: run `node scripts/greek-trainer/coverage.mjs --write`");
if (!WRITE && (!fs.existsSync(DOC) || fs.readFileSync(DOC, "utf8") !== docText + "\n"))
  failures.push("docs/greek-trainer-coverage.md is out of date: run `node scripts/greek-trainer/coverage.mjs --write`");

function loadTrainerCoverage(html) {
  const m = html.match(COVERAGE_LINE);
  return m ? JSON.parse(m[0].replace(/^const TRAINER_COVERAGE = /, "").replace(/;$/, "")) : null;
}

const gapCount = rows.filter(r => r.missing.length).length;
console.log(`greek-trainer: ${paradigms.length} manifest paradigms, ${paradigms.length - gapCount} served, ${gapCount} not yet `
  + `(supported through Unit ${supportedThrough}; ${[...knownGaps.keys()].length} known gaps declared).`);
if (failures.length) {
  console.error("greek-trainer coverage check FAILED:\n" + failures.map(f => "  - " + f).join("\n"));
  process.exit(1);
}
console.log(`greek-trainer: Reference per-verb anchors: ${jumps.tables} verb tables, ${jumps.links} Jump-menu verb links checked (Units 1–20, both scopes).`);
console.log(`greek-trainer: ${appendix.mp} perfect/pluperfect M/P tables checked, ${appendix.compounds} with H&Q's Appendix 3rd plural compound.`);
console.log(`greek-trainer: Vocabulary list: ${words.total} words over ${Object.keys(words.perUnit).length} units, ${words.links} verb links to the Reference page checked.`);
console.log(`greek-trainer: Reference jump form: ${jumpForm.combos} Verb · Tense · Mood · Voice combos resolve to rendered tables (Units 1–20, both scopes).`);
console.log(`greek-trainer: Ending tables: ${endingsOnly.tables} verb tables, ${endingsOnly.cells} cells checked as endings only, ${endingsOnly.pairs} paired with an example verb (Units 1–20, both scopes).`);
console.log(`greek-trainer: Ending tables: no repeated title or key in ${unique.scopes} unit scopes; stem types titled and in book order.`);
console.log(`greek-trainer: Ending tables: ${infCards.cards} Reference infinitives matched by an infinitive card (Units 1–20, both scopes).`);
console.log(`greek-trainer: Ending tables: ${unitVerbs.tables} unit-verb (⚙ built) tables match their Reference copies (Units 1–20, both scopes).`);
console.log(`greek-trainer: Quiz test bank: ${quiz.items} items checked over Units 1–20 (${quiz.verbForms} Reference verb forms found in it, ${quiz.ambiguous} with several parses, ${quiz.links} Reference links); the declension rule reproduces ${quiz.paradigms.length} printed paradigms.`);
console.log(`greek-trainer: Forms at a glance: ${combos.rows} rows checked against the Ending tables and the Reference page (Units 1–20, both scopes).`);
console.log("greek-trainer coverage check passed.");

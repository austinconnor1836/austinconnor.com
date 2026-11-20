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
// Units above supportedThrough are reported (and listed on the unit screens), not failed.
import fs from "node:fs";
import { loadTrainer, TRAINER } from "./load-trainer.mjs";

const MANIFEST = new URL("./hq-paradigms.json", import.meta.url);
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
  const lemmaOf = e => nfc(e.greek.split(",")[0].trim());
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

function doc(rows, onlyTables, onlyDrill, sounds, verbs) {
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
  return L.join("\n");
}

const COVERAGE_LINE = /^const TRAINER_COVERAGE = .*;$/m;
const trainer = await loadTrainer();
const { rows, onlyTables, onlyDrill } = audit(trainer);
const block = coverageBlock(rows);
const blockLine = `const TRAINER_COVERAGE = ${JSON.stringify(block)};`;
const sounds = soundsAudit(trainer);
const verbs = verbAudit(trainer);
const docText = doc(rows, onlyTables, onlyDrill, sounds, verbs);

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
console.log("greek-trainer coverage check passed.");

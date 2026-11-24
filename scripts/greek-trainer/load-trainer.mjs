// Runs the trainer page's own script in a Node vm (no DOM needed: nothing renders until a route fires)
// and hands back what it serves: the verb-drill pool, the ending tables for any unit scope and the
// Reference page's tables (which add the infinitives and the vocabulary verbs' copies), the Principal parts
// page's rows, the Vocabulary list's words, plus the vocabulary and the Glossary page's data and search, and the
// Quiz page's test bank (quiz.bank / quiz.through) and its noun/adjective declension rule, and the
// Forms at a glance rows (combos(unit, mode)).
import fs from "node:fs";
import vm from "node:vm";

export const TRAINER = process.env.GREEK_TRAINER_HTML || new URL("../../public/grad-school/randolph/greek-1/trainer/index.html", import.meta.url);

export async function loadTrainer(file = TRAINER) {
  const html = fs.readFileSync(file, "utf8");
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  if (!m) throw new Error("trainer: no inline <script> found");
  const noop = () => {};
  const ctx = {
    console, Element: class {}, Node: class {}, Event: class {},
    document: { addEventListener: noop, removeEventListener: noop, querySelector: () => null },
    localStorage: { getItem: () => null, setItem: noop },
    location: { hash: "" }, setTimeout, clearTimeout, URLSearchParams,
  };
  ctx.window = ctx;
  ctx.addEventListener = noop;
  vm.createContext(ctx);
  vm.runInContext(m[1] + "\n;globalThis.__trainer = { loadDrillPool, setPool: p => { drillPoolCache = p; }, TRAINER_COVERAGE, VOCAB_DATA, DRILL_BUILT, GLOSSARY_DATA };",
    ctx, { filename: "trainer/index.html" });
  const t = ctx.__trainer;
  const pool = await t.loadDrillPool();
  t.setPool(pool);
  return { html, pool, tables: scope => ctx.trainerTables(scope), refTables: (unit, only) => ctx.trainerRefTables(unit, only),
    refVerbUnits: ctx.trainerRefVerbUnits, refJump: (unit, only) => ctx.trainerRefJump(unit, only), refJumpForm: (unit, only) => ctx.trainerRefJumpForm(unit, only), formation: t => ctx.trainerFormation(t), partsRows: (unit, mode) => ctx.trainerPartsRows(unit, mode), words: (unit, mode) => ctx.trainerWordsInScope(unit, mode), vocab: t.VOCAB_DATA, glossary: t.GLOSSARY_DATA, glossarySearch: q => ctx.trainerGlossarySearch(q), built: t.DRILL_BUILT, coverage: t.TRAINER_COVERAGE,
    quiz: ctx.trainerQuiz, refHref: (...a) => ctx.trainerRefHref(...a), combos: (unit, mode) => ctx.trainerCombos(unit, mode),
    ppMap: (unit, mode) => ctx.trainerPPMap(unit, mode) };
}

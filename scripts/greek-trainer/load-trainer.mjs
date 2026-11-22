// Runs the trainer page's own script in a Node vm (no DOM needed: nothing renders until a route fires)
// and hands back what it serves: the verb-drill pool, the ending tables for any unit scope and the
// Reference page's tables (which add the infinitives and the vocabulary verbs' copies), the Principal parts
// page's rows, plus the vocabulary and the Glossary page's data and search.
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
    location: { hash: "" }, setTimeout, clearTimeout,
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
    refVerbUnits: ctx.trainerRefVerbUnits, formation: t => ctx.trainerFormation(t), partsRows: (unit, mode) => ctx.trainerPartsRows(unit, mode), vocab: t.VOCAB_DATA, glossary: t.GLOSSARY_DATA, glossarySearch: q => ctx.trainerGlossarySearch(q), built: t.DRILL_BUILT, coverage: t.TRAINER_COVERAGE };
}

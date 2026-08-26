/**
 * Runs the label extractor against the fixtures and prints a pass/fail table.
 *
 *     npx tsx scripts/checkExtraction.ts
 *
 * No device, no rebuild, no test framework — `labelExtract.ts` is pure, so this is
 * the fast loop for tuning weights and reject patterns. Add a real capture to
 * `labelExtract.fixtures.ts` every time a scan goes wrong and this becomes a
 * regression suite for free.
 */

import { FIXTURES, type Fixture } from "../src/services/labelExtract.fixtures";
import { CONFIDENT, UNCERTAIN, extractProduct } from "../src/services/labelExtract";

type Failure = { fixture: string; field: string; expected: string; actual: string };

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const OFF = "\x1b[0m";

const failures: Failure[] = [];
let checks = 0;

function compare(fixture: Fixture, field: string, expected: string | undefined, actual: string | undefined) {
  if (expected === undefined) return;
  checks += 1;
  if (expected !== actual) {
    failures.push({
      fixture: fixture.label,
      field,
      expected,
      actual: actual ?? "(none)"
    });
  }
}

console.log(`\n${BOLD}Label extraction — ${FIXTURES.length} fixtures${OFF}\n`);

for (const fixture of FIXTURES) {
  const { result, confidence, candidates } = extractProduct(fixture.blocks);

  compare(fixture, "name", fixture.expect.name, result.name);
  compare(fixture, "category", fixture.expect.category, result.category);
  compare(fixture, "packageSize", fixture.expect.packageSize, result.packageSize);
  compare(fixture, "unit", fixture.expect.unit, result.unit);

  if (fixture.expectLowConfidence) {
    checks += 1;
    if (confidence >= CONFIDENT) {
      failures.push({
        fixture: fixture.label,
        field: "confidence",
        expected: `< ${CONFIDENT}`,
        actual: confidence.toFixed(2)
      });
    }
  }

  const band = confidence >= CONFIDENT ? "confident" : confidence >= UNCERTAIN ? "uncertain" : "no guess";
  const failedHere = failures.filter((f) => f.fixture === fixture.label).length;
  const mark = failedHere === 0 ? `${GREEN}pass${OFF}` : `${RED}fail${OFF}`;

  console.log(`  ${mark}  ${fixture.label}`);
  console.log(`        ${DIM}name${OFF}  ${result.name ?? "(none)"}`);
  console.log(
    `        ${DIM}meta${OFF}  ${result.category ?? "—"} · ${result.packageSize ?? "—"} · ${result.unit ?? "—"}`
  );
  console.log(`        ${DIM}conf${OFF}  ${confidence.toFixed(2)} (${band})`);
  console.log(
    `        ${DIM}alts${OFF}  ${candidates.slice(1, 4).map((c) => c.text).join(" · ") || "—"}\n`
  );
}

if (failures.length === 0) {
  console.log(`${GREEN}${BOLD}All ${checks} assertions passed.${OFF}\n`);
} else {
  console.log(`${RED}${BOLD}${failures.length} of ${checks} assertions failed:${OFF}\n`);
  for (const failure of failures) {
    console.log(`  ${failure.fixture} → ${BOLD}${failure.field}${OFF}`);
    console.log(`    expected  ${failure.expected}`);
    console.log(`    actual    ${RED}${failure.actual}${OFF}\n`);
  }
  // Throwing rather than `process.exit` keeps this file free of Node types, so the
  // project's own `tsc --noEmit` covers it without extra @types.
  throw new Error(`${failures.length} extraction assertion(s) failed`);
}

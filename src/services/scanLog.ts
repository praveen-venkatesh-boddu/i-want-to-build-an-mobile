/**
 * Records what the reader guessed and what the user actually kept.
 *
 * This is the point of running the deterministic version for a week. The gap
 * between `guess` and `kept` is the entire case for or against adding a model:
 *
 *   · edit rate under ~20%  → the rules are carrying it, skip the model
 *   · edit rate over ~50%   → a model has real work to do
 *
 * And because every entry keeps its blocks, each one doubles as a test case with
 * a human-verified answer — which is normally the tedious part of evaluating a
 * prompt. Feed them back into `labelExtract.fixtures.ts`.
 *
 * Images are never stored: they are large, they are the private part, and the
 * blocks are what a model would receive anyway.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import type { ExtractionResult, LookupSource, OcrBlock, ScanLogEntry } from "../types/label";

const STORAGE_KEY = "pantry-pocket-scan-log";

/** Ring buffer bound. A week of household scanning lands nowhere near this. */
const MAX_ENTRIES = 200;

export async function loadScanLog(): Promise<ScanLogEntry[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ScanLogEntry[]) : [];
  } catch {
    return [];
  }
}

export async function recordScan(input: {
  source: LookupSource;
  barcode?: string;
  blocks?: OcrBlock[];
  guess: ExtractionResult["result"];
  confidence?: number;
  kept: ExtractionResult["result"];
}): Promise<void> {
  try {
    const entry: ScanLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: new Date().toISOString(),
      source: input.source,
      barcode: input.barcode,
      // Text and geometry only — never the photo.
      blocks: input.blocks?.map(({ text, y, h }) => ({ text, y, h })),
      guess: input.guess,
      confidence: input.confidence,
      kept: input.kept,
      edited: normalise(input.guess.name) !== normalise(input.kept.name)
    };

    const existing = await loadScanLog();
    const next = [entry, ...existing].slice(0, MAX_ENTRIES);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Logging must never break a save. A dropped entry costs one data point.
  }
}

export async function clearScanLog(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing useful to do here.
  }
}

/** Headline numbers for the Settings row, so the week's result is visible in-app. */
export type ScanLogSummary = {
  total: number;
  fromOcr: number;
  editedOcr: number;
  /** Share of OCR reads the user corrected, 0–1. The number the AI decision turns on. */
  editRate: number;
};

export function summarise(entries: ScanLogEntry[]): ScanLogSummary {
  const ocr = entries.filter((entry) => entry.source === "ocr");
  const edited = ocr.filter((entry) => entry.edited);

  return {
    total: entries.length,
    fromOcr: ocr.length,
    editedOcr: edited.length,
    editRate: ocr.length === 0 ? 0 : edited.length / ocr.length
  };
}

/** Pretty-printed JSON, ready to write to a file and share. */
export function toExportJson(entries: ScanLogEntry[]): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      summary: summarise(entries),
      entries
    },
    null,
    2
  );
}

export type ExportOutcome = { ok: true; count: number } | { ok: false; reason: string };

/**
 * Writes the log to a file and opens the share sheet.
 *
 * Getting this off the device is the point — the entries become fixtures for
 * `labelExtract.fixtures.ts` and, if you do add a model later, a ready-made eval
 * set with human-verified answers.
 */
export async function exportScanLog(): Promise<ExportOutcome> {
  const entries = await loadScanLog();
  if (entries.length === 0) {
    return { ok: false, reason: "Nothing scanned yet — the log is empty." };
  }

  try {
    const stamp = new Date().toISOString().slice(0, 10);
    const path = `${FileSystem.cacheDirectory}scan-log-${stamp}.json`;

    await FileSystem.writeAsStringAsync(path, toExportJson(entries));

    if (!(await Sharing.isAvailableAsync())) {
      return { ok: false, reason: "Sharing isn't available on this device." };
    }

    await Sharing.shareAsync(path, {
      mimeType: "application/json",
      dialogTitle: "Export scan log"
    });

    return { ok: true, count: entries.length };
  } catch {
    return { ok: false, reason: "Couldn't write the export file." };
  }
}

function normalise(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

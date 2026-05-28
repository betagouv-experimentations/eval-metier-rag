import ExcelJS from "exceljs";

export interface ExcelRow {
  question: string;
  response_a: string;
  response_b?: string;
  sources_a?: string;
  sources_b?: string;
}

export interface ParsedCampaignData {
  mode: "comparison" | "single";
  rows: ExcelRow[];
}

/**
 * Split a cell containing multiple source URLs into an array of clean URLs.
 * Supports: newline, semicolon, comma separators.
 */
export function splitSources(raw: string | undefined | null): string[] {
  if (!raw || String(raw).trim() === "") return [];
  const str = String(raw).trim();
  // Try newline first (most common in Excel multi-line cells)
  let parts: string[];
  if (str.includes("\n")) {
    parts = str.split(/\r?\n/);
  } else if (str.includes(";")) {
    parts = str.split(";");
  } else {
    // Split on comma only if it doesn't look like URL parameters
    parts = str.split(",").filter((p) => !p.trim().startsWith("http") || p.includes("://"));
    // If splitting on comma yields only URLs with http we likely had one URL — keep as-is
    if (parts.length > 1) {
      parts = str.split(",");
    } else {
      parts = [str];
    }
  }
  return parts.map((p) => p.trim()).filter((p) => p.length > 0);
}

/** Normalize a column header: lowercase, remove accents, non-alphanum → underscore. */
function normalize(key: string): string {
  return key
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove combining diacritics
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

/** Convert an exceljs CellValue to a plain string. */
function cellToString(v: ExcelJS.CellValue): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") {
    // Rich text: { richText: [{ text: "..." }] }
    if ("richText" in v && Array.isArray((v as { richText: unknown }).richText)) {
      return (v as { richText: Array<{ text?: string }> }).richText
        .map((rt) => rt.text ?? "")
        .join("");
    }
    // Hyperlink: { text: "...", hyperlink: "..." }
    if ("hyperlink" in v && "text" in v) {
      return String((v as { text: unknown }).text ?? "");
    }
    // Formula result: { formula: "...", result: ... }
    if ("result" in v) {
      return cellToString((v as { result: ExcelJS.CellValue }).result);
    }
  }
  return String(v);
}

/** Parse a CSV text into rows, handling quoted fields and escaped quotes. */
function parseCSV(text: string): Record<string, string>[] {
  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const next = line[i + 1];
      if (ch === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  };

  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 2) return [];

  const headerLine = lines[0] ?? "";
  const headers = parseRow(headerLine).map(normalize);

  return lines.slice(1).map((line) => {
    const values = parseRow(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] ?? "";
    });
    return obj;
  });
}

/**
 * Parse an Excel (.xlsx) or CSV file buffer into campaign data.
 * Expected columns (case-insensitive, accent-insensitive):
 *   question, réponse_A (or response_a), réponse_B, sources_A, sources_B
 *
 * Note: .xls (legacy binary format) is not supported — ask users to save as .xlsx or .csv.
 */
export async function parseExcelFile(buffer: ArrayBuffer): Promise<ParsedCampaignData> {
  const uint8 = new Uint8Array(buffer);
  const isXlsx = uint8[0] === 0x50 && uint8[1] === 0x4b; // ZIP magic (PK)
  const isXls = uint8[0] === 0xd0 && uint8[1] === 0xcf; // OLE2 magic

  if (isXls) {
    throw new Error(
      "Format XLS (.xls) non supporté. Veuillez enregistrer votre fichier au format XLSX (.xlsx) ou CSV (.csv).",
    );
  }

  let rawRows: Record<string, string>[];

  if (isXlsx) {
    // Parse XLSX with exceljs (no known high CVEs)
    const workbook = new ExcelJS.Workbook();
    // exceljs's type declarations use an older Buffer type that isn't generic.
    // We cast via the function's own parameter type to avoid the version mismatch.
    const xlsxLoad = workbook.xlsx.load.bind(workbook.xlsx) as (
      b: ArrayBuffer | Uint8Array,
    ) => Promise<ExcelJS.Workbook>;
    await xlsxLoad(uint8);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) throw new Error("Le fichier ne contient aucune feuille.");

    const headers: string[] = [];
    const rows: Record<string, string>[] = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      // row.values is 1-indexed (index 0 is always null in exceljs)
      const vals = (row.values as ExcelJS.CellValue[]).slice(1).map(cellToString);

      if (rowNumber === 1) {
        headers.push(...vals.map(normalize));
      } else {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[h] = vals[i] ?? "";
        });
        rows.push(obj);
      }
    });

    rawRows = rows;
  } else {
    // CSV: decode bytes as UTF-8 to correctly handle accented characters
    const text = new TextDecoder("utf-8").decode(uint8);
    rawRows = parseCSV(text);
  }

  if (rawRows.length === 0) {
    throw new Error("Le fichier ne contient aucune ligne de données.");
  }

  const rows: ExcelRow[] = rawRows.map((rowData, index) => {
    const question = rowData["question"] ?? "";
    const responseA = rowData["reponse_a"] ?? rowData["response_a"] ?? "";
    const responseB = rowData["reponse_b"] ?? rowData["response_b"];
    const sourcesA = rowData["sources_a"];
    const sourcesB = rowData["sources_b"];

    if (!question.trim()) {
      throw new Error(`La ligne ${index + 2} ne contient pas de question.`);
    }
    if (!responseA.trim()) {
      throw new Error(`La ligne ${index + 2} ne contient pas de réponse A.`);
    }

    return {
      question: question.trim(),
      response_a: responseA.trim(),
      response_b: responseB?.trim() || undefined,
      sources_a: sourcesA || undefined,
      sources_b: sourcesB || undefined,
    };
  });

  // Determine mode: comparison if at least one row has response_b
  const mode: "comparison" | "single" = rows.some((r) => r.response_b)
    ? "comparison"
    : "single";

  return { mode, rows };
}

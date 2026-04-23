import Database from "better-sqlite3";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "app.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS briefs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      business_name TEXT NOT NULL,
      main_revenue_goal TEXT NOT NULL,
      brief_json TEXT NOT NULL,
      response_json TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at DESC);
  `);
  return db;
}

export type BriefRow = {
  id: number;
  created_at: string;
  business_name: string;
  main_revenue_goal: string;
  brief_json: string;
  response_json: string;
};

export type BriefSummary = {
  id: number;
  created_at: string;
  business_name: string;
  main_revenue_goal: string;
};

export function saveBrief(input: {
  businessName: string;
  mainRevenueGoal: string;
  brief: unknown;
  response: unknown;
}): number {
  const stmt = getDb().prepare(
    `INSERT INTO briefs (business_name, main_revenue_goal, brief_json, response_json)
     VALUES (?, ?, ?, ?)`
  );
  const result = stmt.run(
    input.businessName,
    input.mainRevenueGoal,
    JSON.stringify(input.brief),
    JSON.stringify(input.response)
  );
  return Number(result.lastInsertRowid);
}

export function listBriefs(limit = 100): BriefSummary[] {
  return getDb()
    .prepare(
      `SELECT id, created_at, business_name, main_revenue_goal
       FROM briefs
       ORDER BY created_at DESC
       LIMIT ?`
    )
    .all(limit) as BriefSummary[];
}

export function getBrief(id: number): BriefRow | null {
  return (
    (getDb()
      .prepare(`SELECT * FROM briefs WHERE id = ?`)
      .get(id) as BriefRow | undefined) ?? null
  );
}

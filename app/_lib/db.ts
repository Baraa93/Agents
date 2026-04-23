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

    CREATE TABLE IF NOT EXISTS actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brief_id INTEGER NOT NULL REFERENCES briefs(id) ON DELETE CASCADE,
      day INTEGER NOT NULL,
      task TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_actions_brief_id ON actions(brief_id);

    CREATE TABLE IF NOT EXISTS drafts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action_id INTEGER NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
      output TEXT NOT NULL,
      user_notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_drafts_action_id ON drafts(action_id);
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

/* ----- actions ----- */

export type ActionStatus = "open" | "done" | "skipped";

export type ActionRow = {
  id: number;
  brief_id: number;
  day: number;
  task: string;
  status: ActionStatus;
  created_at: string;
  completed_at: string | null;
};

export function saveActionsFromSections(
  briefId: number,
  sections: Array<{ title?: string; items?: string[] }>
): void {
  const plan = sections.find((s) =>
    typeof s.title === "string" && /7[-\s]?day/i.test(s.title)
  );
  if (!plan?.items?.length) return;
  const stmt = getDb().prepare(
    `INSERT INTO actions (brief_id, day, task) VALUES (?, ?, ?)`
  );
  const insertMany = getDb().transaction((items: string[]) => {
    items.slice(0, 7).forEach((task, i) => {
      stmt.run(briefId, i + 1, task);
    });
  });
  insertMany(plan.items);
}

export function listActionsForBrief(briefId: number): ActionRow[] {
  return getDb()
    .prepare(
      `SELECT * FROM actions WHERE brief_id = ? ORDER BY day ASC, id ASC`
    )
    .all(briefId) as ActionRow[];
}

export function getAction(id: number): ActionRow | null {
  return (
    (getDb()
      .prepare(`SELECT * FROM actions WHERE id = ?`)
      .get(id) as ActionRow | undefined) ?? null
  );
}

export function setActionStatusDb(id: number, status: ActionStatus): void {
  if (status === "done") {
    getDb()
      .prepare(
        `UPDATE actions SET status = ?, completed_at = datetime('now') WHERE id = ?`
      )
      .run(status, id);
  } else {
    getDb()
      .prepare(
        `UPDATE actions SET status = ?, completed_at = NULL WHERE id = ?`
      )
      .run(status, id);
  }
}

/* ----- drafts ----- */

export type DraftRow = {
  id: number;
  action_id: number;
  output: string;
  user_notes: string | null;
  created_at: string;
};

export function saveDraft(input: {
  actionId: number;
  output: string;
  userNotes?: string | null;
}): number {
  const result = getDb()
    .prepare(
      `INSERT INTO drafts (action_id, output, user_notes) VALUES (?, ?, ?)`
    )
    .run(input.actionId, input.output, input.userNotes ?? null);
  return Number(result.lastInsertRowid);
}

export function getLatestDraftPerAction(briefId: number): Map<number, DraftRow> {
  const rows = getDb()
    .prepare(
      `SELECT d.*
         FROM drafts d
         INNER JOIN (
           SELECT action_id, MAX(created_at) AS latest
             FROM drafts
             GROUP BY action_id
         ) t ON d.action_id = t.action_id AND d.created_at = t.latest
        WHERE d.action_id IN (SELECT id FROM actions WHERE brief_id = ?)`
    )
    .all(briefId) as DraftRow[];
  const map = new Map<number, DraftRow>();
  for (const row of rows) map.set(row.action_id, row);
  return map;
}

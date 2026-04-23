"use server";

import { revalidatePath } from "next/cache";
import { setActionStatusDb, type ActionStatus } from "@/app/_lib/db";

export async function setActionStatus(
  actionId: number,
  status: ActionStatus,
  briefId: number
): Promise<void> {
  if (!Number.isInteger(actionId) || actionId <= 0) return;
  if (status !== "open" && status !== "done" && status !== "skipped") return;
  setActionStatusDb(actionId, status);
  revalidatePath(`/history/${briefId}`);
}

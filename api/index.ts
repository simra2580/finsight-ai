import { createApp } from "../backend/src/app.js";
import { connectDb } from "../backend/src/config/db.js";

let dbReady: Promise<void> | undefined;

export default async function handler(req: any, res: any) {
  dbReady ??= connectDb();
  try {
    await dbReady;
  } catch (error) {
    dbReady = undefined;
    console.error("MongoDB connection failed", error);
    return res.status(503).json({
      success: false,
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "FinSight backend database is unavailable.",
      },
    });
  }
  return createApp()(req, res);
}

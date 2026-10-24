export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { rawExec } = await import("./lib/db");
  const { SCHEMA_SQL } = await import("./lib/sql");
  await rawExec(SCHEMA_SQL);
  if (!process.env.DATABASE_URL || process.env.SEED_DEMO === "1") {
    const { seedDemo } = await import("./lib/seed");
    if (await seedDemo()) console.log("[seed] демо өгөгдөл үүслээ");
  }
}

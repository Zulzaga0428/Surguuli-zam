export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return; // build үед DB рүү хандахгүй
  const { rawExec } = await import("./lib/db");
  const { SCHEMA_SQL } = await import("./lib/sql");
  // Railway-ийн дотоод сүлжээ асахад хэдэн секунд хоцордог — хэд дахин оролдоно.
  for (let i = 1; ; i++) {
    try {
      await rawExec(SCHEMA_SQL);
      break;
    } catch (e) {
      console.error(`[db] хүснэгт үүсгэж чадсангүй (${i}):`, e instanceof Error ? e.message : e);
      if (i >= 10) return;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  // Хоосон DB-д демо өгөгдөл (SEED_DEMO=0 бол үгүй).
  if (process.env.SEED_DEMO !== "0") {
    const { seedDemo } = await import("./lib/seed");
    try {
      if (await seedDemo()) console.log("[seed] демо өгөгдөл үүслээ");
    } catch (e) {
      console.error("[seed] алдаа:", e);
    }
  }
}

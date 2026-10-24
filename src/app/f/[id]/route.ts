import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/schema";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id)) return new Response("Not found", { status: 404 });
  const [f] = await db.select().from(files).where(eq(files.id, id));
  if (!f) return new Response("Not found", { status: 404 });
  const inline = f.mime.startsWith("image/") || f.mime === "application/pdf";
  return new Response(Buffer.from(f.data), {
    headers: {
      "Content-Type": f.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(f.name)}`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

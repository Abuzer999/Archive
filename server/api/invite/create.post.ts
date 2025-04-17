import { v4 as uuidv4 } from "uuid";
import { redis } from "~/lib/redis";
import { z } from "zod";

const bodySchema = z.object({
  workspaceId: z.string(),
  role: z.enum(["USER", "ADMIN", "CREATOR"]).default("USER"),
  ttl: z.number().default(86400),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { workspaceId, role, ttl } = bodySchema.parse(body);

  const token = uuidv4();

  await redis.set(
    `invite:${token}`,
    JSON.stringify({ workspaceId, role }),
    "EX",
    ttl
  );

  return { token, link: `http://localhost:3000/api/invite/${token}` };
});

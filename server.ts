import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import sharp from "sharp";
import TextToSVG from "text-to-svg";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(ROOT, "public");
const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";
const IMAGE_SUFFIXES = [".png", ".jpg", ".jpeg"];

const textToSvg = TextToSVG.loadSync(
  path.join(PUBLIC_DIR, "poppins-v20-latin-ext_latin_devanagari-600.woff"),
);

const fullLogo = await readFile(
  path.join(ROOT, "assets", "full_logo.svg"),
  "utf8",
);
const logoMark = [...fullLogo.matchAll(/<path\b[^>]*\/>/g)]
  .slice(0, 5)
  .map(([element]) => element)
  .join("");

if (!logoMark) {
  throw new Error("Could not load the logo font or mark");
}

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".eot": "application/vnd.ms-fontobject",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function send(
  reply: FastifyReply,
  status: number,
  contentType: string,
  body: string | Buffer,
) {
  const content = Buffer.isBuffer(body) ? body : Buffer.from(body);
  return reply
    .code(status)
    .type(contentType)
    .header("Content-Length", content.length)
    .header("X-Content-Type-Options", "nosniff")
    .send(content);
}

async function serveStatic(
  pathname: string,
  reply: FastifyReply,
): Promise<boolean> {
  const filePath =
    pathname === "/brand.svg"
      ? path.join(ROOT, "assets", "full_logo.svg")
      : path.resolve(PUBLIC_DIR, `.${pathname}`);
  const relativePath =
    pathname === "/brand.svg"
      ? "brand.svg"
      : path.relative(PUBLIC_DIR, filePath);

  if (
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath) ||
    pathname.endsWith("/")
  ) {
    return false;
  }

  try {
    const content = await readFile(filePath);
    const contentType =
      contentTypes[path.extname(filePath)] || "application/octet-stream";
    send(reply, 200, contentType, content);
    return true;
  } catch (error: unknown) {
    const code =
      error instanceof Error && "code" in error ? String(error.code) : "";
    if (code === "ENOENT" || code === "EISDIR") {
      return false;
    }
    throw error;
  }
}

function createLogoSvg(text: string): string {
  const fontSize = 102;
  const xOffset = 120;
  const options: TextToSVG.GenerationOptions = {
    x: xOffset,
    y: fontSize * (182 / 130),
    fontSize,
    anchor: "left bottom",
    attributes: {
      stroke: "black",
      fill: "black",
    },
  };

  const textPath = textToSvg.getD(text, options);
  const metrics = textToSvg.getMetrics(text, options);
  const width = metrics.width + 102 + xOffset;
  const height = metrics.height;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path d="${textPath}" />${logoMark}</svg>`;
}

const fastify = Fastify({ logger: true });

async function handleRequest(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const method = request.method;

  if (method !== "GET" && method !== "HEAD") {
    reply.header("Allow", "GET, HEAD");
    return send(
      reply,
      405,
      "text/plain; charset=utf-8",
      "Method not allowed\n",
    );
  }

  const url = new URL(request.url, "http://localhost");

  if (url.pathname === "/") {
    const text = (url.searchParams.get("text") || "").trim();
    if (text) {
      return reply
        .code(302)
        .header("Location", `/${encodeURIComponent(text)}`)
        .send();
    }

    const index = await readFile(path.join(PUBLIC_DIR, "index.html"));
    return send(reply, 200, contentTypes[".html"], index);
  }

  if (await serveStatic(url.pathname, reply)) {
    return reply;
  }

  let rawText: string;
  try {
    rawText = decodeURIComponent(url.pathname.slice(1));
  } catch {
    return send(reply, 400, "text/plain; charset=utf-8", "Bad request\n");
  }

  if (!rawText) {
    return send(reply, 404, "text/plain; charset=utf-8", "Not found\n");
  }

  const suffix = IMAGE_SUFFIXES.find((item) => rawText.endsWith(item));
  const text = suffix ? rawText.slice(0, -suffix.length) : rawText;
  const svg = createLogoSvg(text);
  const wantsImage =
    Boolean(suffix) ||
    String(request.headers["user-agent"] || "").includes("Discordbot");

  if (wantsImage) {
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    return send(reply, 200, "image/png", png);
  }

  return send(reply, 200, "image/svg+xml", svg);
}

fastify.all("/", handleRequest);
fastify.all("/*", handleRequest);

fastify.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  send(reply, 500, "text/plain; charset=utf-8", "Internal server error\n");
});

await fastify.listen({ port: PORT, host: HOST });

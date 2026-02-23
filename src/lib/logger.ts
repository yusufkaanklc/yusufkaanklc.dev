type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const MIN_LEVEL = process.env.NODE_ENV === "production" ? LEVELS.info : LEVELS.debug;

function formatError(err: unknown): string {
  if (err instanceof Error) {
    return err.stack ?? `${err.name}: ${err.message}`;
  }
  return String(err);
}

function write(level: LogLevel, context: string, message: string, err?: unknown) {
  if (LEVELS[level] < MIN_LEVEL) return;

  const ts = new Date().toISOString();
  const tag = `${ts} [${level.toUpperCase()}] [${context}]`;
  const line = err ? `${tag} ${message} — ${formatError(err)}` : `${tag} ${message}`;

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export function logger(context: string) {
  return {
    debug: (msg: string) => write("debug", context, msg),
    info: (msg: string) => write("info", context, msg),
    warn: (msg: string, err?: unknown) => write("warn", context, msg, err),
    error: (msg: string, err?: unknown) => write("error", context, msg, err),
  };
}

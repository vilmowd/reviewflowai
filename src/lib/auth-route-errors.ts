import { Prisma } from "@prisma/client";

/**
 * Maps thrown errors from auth routes to a safe client message and HTTP status.
 */
export function mapAuthRouteError(
  error: unknown,
  fallback: string,
): { status: number; message: string } {
  if (error instanceof Error && error.message === "Missing AUTH_SECRET") {
    return {
      status: 500,
      message:
        "Server is missing AUTH_SECRET. Add a long random string in your host’s environment variables.",
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2021") {
      return {
        status: 503,
        message:
          "Database tables are missing. Run `npx prisma db push` (or `migrate deploy`) using your production DATABASE_URL.",
      };
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      status: 503,
      message:
        "Cannot reach the database. Check DATABASE_URL on your host (and SSL settings for Postgres).",
    };
  }

  return { status: 500, message: fallback };
}

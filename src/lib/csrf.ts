import { cookies } from "next/headers";

const CSRF_COOKIE = "rf_csrf";

export function verifyCsrf(request: Request) {
  const cookieToken = cookies().get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get("x-csrf-token");
  return Boolean(cookieToken && headerToken && cookieToken === headerToken);
}

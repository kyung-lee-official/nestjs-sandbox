import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { HttpError } from "@repo/types";
import type { NextFunction, RequestHandler } from "express";

export const medusaAuthBlocker: RequestHandler = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: NextFunction,
) => {
  const medusaAuthPattern = /^\/auth\/([^\/]+)\/([^\/]+)\/?$/;
  if (medusaAuthPattern.test(req.originalUrl)) {
    /* allow user authentication routes, otherwise admin dashboard auth will be blocked */
    if (req.originalUrl === "/auth/user/emailpass") {
      return next();
    }
    /* block this API route to exposing token in response body */
    throw new HttpError(
      "AUTH.FORBIDDEN",
      "This route has been disabled for security reasons as it exposes tokens in the response body. Use 'POST /auth/sign-in/:actor_type/:auth_provider' instead.",
    );
  }
  next();
};

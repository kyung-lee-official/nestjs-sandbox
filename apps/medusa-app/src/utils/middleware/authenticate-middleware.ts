import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import type { NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "@/api/test-errors/errors/src";

type JwtContext = {
  actor_id?: string;
  actor_type?: string;
  auth_identity_id?: string;
  iat?: number;
  exp?: number;
};

export const authenticateJwt = (
  actorType: string | string[],
  authType: "bearer" | ["bearer"] = "bearer",
): RequestHandler => {
  const authenticateMiddleware = async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: NextFunction,
  ): Promise<void> => {
    // const authTypes = Array.isArray(authType) ? authType : [authType];
    const actorTypes = Array.isArray(actorType) ? actorType : [actorType];

    if (!req.headers.authorization) {
      throw new HttpError("AUTH.UNAUTHORIZED");
    }

    const token = req.headers.authorization.split(" ")[1];

    // try to extract the auth context from a JWT token
    const jwtAuthContext = jwt.decode(token || "", {
      json: true,
    }) as JwtContext | null;

    if (!jwtAuthContext) {
      throw new HttpError("AUTH.UNAUTHORIZED");
    }

    if (
      !jwtAuthContext.actor_type ||
      !actorTypes.includes(jwtAuthContext.actor_type)
    ) {
      throw new HttpError("AUTH.ACTOR_TYPE_MISMATCH");
    }

    if (jwtAuthContext.exp && Date.now() >= jwtAuthContext.exp * 1000) {
      throw new HttpError("AUTH.JWT_EXPIRED");
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      throw new HttpError("AUTH.INVALID_TOKEN");
    }

    return next();
  };

  return authenticateMiddleware as unknown as RequestHandler;
};

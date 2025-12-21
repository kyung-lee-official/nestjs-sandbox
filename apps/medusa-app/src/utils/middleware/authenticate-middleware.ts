import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  generateJwtToken,
} from "@medusajs/framework/utils";
import type { NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { setCookieTokenString } from "../auth/set-cookie-token-string";
import { HttpError } from "@repo/types";

interface CookieData {
  medusa_token?: string;
}

interface JwtContext {
  actor_id?: string;
  actor_type?: string;
  auth_identity_id?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  iat?: number;
  exp?: number;
}

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

    // get token from cookies
    const { medusa_token: token } = req.cookies as CookieData;

    if (!token) {
      throw new HttpError("AUTH.UNAUTHORIZED");
    }

    // try to extract the auth context from a JWT token
    const jwtAuthContext = jwt.decode(token || "", {
      json: true,
    }) as JwtContext | null;

    if (!jwtAuthContext) {
      throw new HttpError("AUTH.UNAUTHORIZED");
    }

    if (!jwtAuthContext.actor_id) {
      throw new HttpError(
        "AUTH.ACTOR_ID_MISSING",
        "actor_id is missing in the token payload",
      );
    }

    if (
      !jwtAuthContext.actor_type ||
      !actorTypes.includes(jwtAuthContext.actor_type)
    ) {
      throw new HttpError("AUTH.ACTOR_TYPE_MISMATCH");
    }

    if (!jwtAuthContext.auth_identity_id) {
      throw new HttpError(
        "AUTH.AUTH_IDENTITY_ID_MISSING",
        "auth_identity_id is missing in the token payload",
      );
    }

    if (jwtAuthContext.exp && Date.now() >= jwtAuthContext.exp * 1000) {
      throw new HttpError("AUTH.JWT_EXPIRED");
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      throw new HttpError("AUTH.INVALID_TOKEN");
    }

    const { http } = req.scope.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE,
    ).projectConfig;

    // refresh token if it's close to expiration (within 1 hour)
    const oneHourInSeconds = 3600;
    if (
      jwtAuthContext.exp &&
      jwtAuthContext.exp - Date.now() / 1000 < oneHourInSeconds
    ) {
      const newToken = generateJwtToken(
        {
          actor_id: jwtAuthContext.actor_id,
          actor_type: jwtAuthContext.actor_type,
          auth_identity_id: jwtAuthContext.auth_identity_id,
          app_metadata: jwtAuthContext.app_metadata,
          user_metadata: jwtAuthContext.user_metadata,
        },
        {
          secret: http.jwtSecret,
          expiresIn: http.jwtExpiresIn,
        },
      );
      res.setHeader("Set-Cookie", [setCookieTokenString(newToken)]);
    }

    // set the authorization header for downstream medusa built-in 'authenticate' middleware
    req.headers.authorization = `Bearer ${token}`;

    return next();
  };

  return authenticateMiddleware as unknown as RequestHandler;
};

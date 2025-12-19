import type {
  ConfigModule,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import type { AuthenticationInput } from "@medusajs/types/dist/auth/common/provider";
import type { IAuthModuleService } from "@medusajs/types/dist/auth/service";
import { HttpError } from "@repo/types";
import { generateJwtTokenForAuthIdentity } from "@/utils/auth/generate-jwt-token";

const convertToSeconds = (timeString: string): number => {
  const unit = timeString.slice(-1);
  const value = parseInt(timeString.slice(0, -1), 10);
  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 3600;
    case "d":
      return value * 86400;
    default:
      return parseInt(timeString, 10); // fallback for plain numbers
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { actor_type, auth_provider } = req.params;
  const config: ConfigModule = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE,
  );

  const service: IAuthModuleService = req.scope.resolve(Modules.AUTH);

  const authData = {
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    protocol: req.protocol,
  } as AuthenticationInput;

  const { success, error, authIdentity, location } = await service.authenticate(
    auth_provider,
    authData,
  );

  if (location) {
    return res.status(200).json({ location });
  }

  if (success && authIdentity) {
    const { http } = config.projectConfig;

    const token = generateJwtTokenForAuthIdentity(
      {
        authIdentity,
        actorType: actor_type,
        authProvider: auth_provider,
      },
      {
        secret: http.jwtSecret!,
        expiresIn: http.jwtExpiresIn,
        options: http.jwtOptions,
      },
    );

    return res
      .status(200)
      .setHeader("Set-Cookie", [
        `medusa_token=${token}; HttpOnly;${process.env.NODE_ENV === "production" ? "Secure;" : ""} Path=/; Max-Age=${convertToSeconds(
          process.env.JWT_EXPIRES_IN || "3600",
        )}; SameSite=Lax`,
      ])
      .json({
        message: "Signed in successfully, token set in http-only cookie.",
      });
  }

  throw new HttpError("AUTH.UNAUTHORIZED", "Authentication failed");
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  await GET(req, res);
};

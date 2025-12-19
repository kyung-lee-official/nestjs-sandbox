import {
  authenticate,
  type ConfigModule,
  defineMiddlewares,
  errorHandler,
  logger,
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
} from "@medusajs/framework";
import { MedusaError, parseCorsOrigins } from "@medusajs/framework/utils";
import { HttpError, MedusaErrorTypes } from "@repo/types";
import cors from "cors";
import { authenticateJwt } from "@/utils/middleware/authenticate-middleware";

const originalErrorHandler = errorHandler();

export default defineMiddlewares({
  routes: [
    {
      /**
       * astrisk matcher to apply to all routes, including non-existent ones
       */
      matcher: "*",
      middlewares: [
        (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
          const configModule: ConfigModule = req.scope.resolve("configModule");
          /**
           * here you can use req.originalUrl to access the request URL, req.url or req.path won't work
           * for example, /store/customers/me
           */
          //   logger.info(`URL >>>>>>>>>>>>>>>>>>>>>>>>> ${req.originalUrl}`);

          /**
           * throwing HttpErrors from middleware will be handled by the errorHandler below
           * uncomment the following lines to test
           */
          //   throw new HttpError("AUTH.FORBIDDEN");

          return cors({
            origin: parseCorsOrigins(configModule.projectConfig.http.storeCors),
            credentials: true,
          })(req, res, next);
        },
      ],
    },
    {
      matcher: "/auth/:actor_type/:auth_provider",
      middlewares: [
        (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
          /* block this API route to exposing token in response body */
          throw new HttpError(
            "AUTH.FORBIDDEN",
            "This route has been disabled for security reasons as it exposes tokens in the response body. Use 'POST /auth/sign-in/:actor_type/:auth_provider' instead.",
          );
        },
      ],
    },
    {
      matcher: "/store/customers*",
      middlewares: [
        (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
          // some custom logic, remember to call next() to proceed to the next middleware
          return next();
        },
        authenticateJwt("customer", ["bearer"]),
      ],
    },
    {
      method: ["POST"],
      matcher: "/commerce-modules/customer/create-customer",
      middlewares: [
        authenticate("customer", ["bearer"], {
          allowUnregistered: true,
        }),
      ],
    },
    {
      method: ["POST"],
      matcher: "/commerce-modules/user/create-user",
      middlewares: [
        authenticate("user", ["bearer"], {
          allowUnregistered: true,
        }),
      ],
    },
    {
      method: ["POST"],
      matcher: "/tester",
      middlewares: [
        authenticate("tester", ["bearer"], {
          allowUnregistered: true,
        }),
      ],
    },
  ],

  errorHandler: (
    error: HttpError | MedusaError,
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction,
  ) => {
    if (MedusaError.isMedusaError(error)) {
      const medusaError = error as MedusaError;
      const map = MedusaErrorTypes[medusaError.type];
      res.status(Object.values(map)[0]).json({
        error: {
          code: Object.keys(map)[0],
          message: medusaError.message,
          details: {},
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }
    res.status(error.status || 500).json({
      error: {
        code: error.code || "SYSTEM_INTERNAL_ERROR",
        message: error.message || "",
        details: error.details || {},
        timestamp: error.timestamp || new Date().toISOString(),
      },
    });
    return;
  },
});

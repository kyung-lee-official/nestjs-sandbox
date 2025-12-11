import {
  authenticate,
  type ConfigModule,
  defineMiddlewares,
  errorHandler,
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
} from "@medusajs/framework";
import { MedusaError, parseCorsOrigins } from "@medusajs/framework/utils";
import cors from "cors";
import type { HttpError } from "./test-errors/errors/src";
import { MedusaErrorTypes } from "./test-errors/medusa-errors/medusa-error-types";

const originalErrorHandler = errorHandler();

export default defineMiddlewares({
  routes: [
    {
      matcher: "*",
      middlewares: [
        (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
          const configModule: ConfigModule = req.scope.resolve("configModule");
          /**
           * here you can use req.originalUrl to access the request URL, req.url or req.path won't work
           * for example, /store/customers/me
           */
          //   console.log(
          //     "URL >>>>>>>>>>>>>>>>>>>>>>>>> ",
          //     req.originalUrl,
          //   );
          return cors({
            origin: parseCorsOrigins(configModule.projectConfig.http.storeCors),
            credentials: true,
          })(req, res, next);
        },
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

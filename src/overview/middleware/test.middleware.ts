import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class TestMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		(req as any).testMiddleware = "test middleware";
		next();
	}
}

import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class TestInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest();
		req.beforeHandlerData = "before handler data";
		return next.handle().pipe(
			map((data) => ({
				...data,
				afterHandlerData: "after handler data",
			}))
		);
	}
}

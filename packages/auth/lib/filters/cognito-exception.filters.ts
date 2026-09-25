import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";

/** Sends authentication errors to socket.io clients as an `exception` event with the HTTP body. */
@Catch(HttpException)
export class CognitoWsExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    host
      .switchToWs()
      .getClient<{ emit(event: string, data: unknown): void }>()
      .emit("exception", exception.getResponse());
  }
}

/** Returns authentication errors to microservice clients with the HTTP body. */
@Catch(HttpException)
export class CognitoRpcExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException): Observable<never> {
    return throwError(() => exception.getResponse());
  }
}

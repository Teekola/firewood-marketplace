import { ErrorBase } from "./errorBase";

type AuthErrorName = "SESSION_ERROR";
type DatabaseErrorName = "DATABASE_ERROR";
type UnknownErrorName = "UNHANDLED_ERROR";

export class AuthError extends ErrorBase<AuthErrorName> {}
export class DatabaseError extends ErrorBase<DatabaseErrorName> {}
export class UnknownError extends ErrorBase<UnknownErrorName> {}

export function parseError(error: unknown): ErrorBase<string> {
   if (error instanceof ErrorBase) return error;

   return {
      name: "UNHANDLED_ERROR",
      message: "An error occurred",
      code: 500,
   };
}

export class ErrorBase<T extends string> extends Error {
   name: T;
   message: string;
   code: string;

   constructor({ name, message, code }: { name: T; message: string; code?: string }) {
      super();
      this.name = name;
      this.message = message;
      this.code = code ?? "500";
   }
}

import { Thing, WithContext } from "schema-dts";

export function JsonLd<T extends Thing>(json: WithContext<T>): string {
   return JSON.stringify(json);
}

import type { InferTypeOf } from "@medusajs/framework/types";
import type { Tester } from "../models/tester";
import type TesterModuleService from "../service";

export type CreateTester = Omit<InferTypeOf<typeof Tester>, "id">;

/* This augmentation adds `TesterModuleService` to Medusa's dependency injection system, making it available throughout the application. */
declare module "@medusajs/framework/types" {
  export interface ModuleImplementations {
    TesterModuleService: TesterModuleService;
  }
}

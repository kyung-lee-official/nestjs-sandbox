import { createContext } from "react";

export const defaultVal = 5;

export const TestContext = createContext<number>(defaultVal);

"use client";

import { User } from "@tma.js/sdk-react";
import { createContext } from "react";

export interface ITmaContext {
  user: User;
}

export const TmaContext = createContext<ITmaContext>({} as ITmaContext);

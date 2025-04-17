"use client";

import { lazy } from "react";

// Move error content to a separate chunk and load it only when needed
export default lazy(() => import("@/components/errors/default-error"));

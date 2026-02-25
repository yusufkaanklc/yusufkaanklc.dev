import { z } from "zod";
import type { ZodOpenApiPathsObject } from "zod-openapi";
import {
  errorResponse,
  successResponse,
  authCheckResponse,
} from "../schemas";

export const authPaths: ZodOpenApiPathsObject = {
  "/api/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Admin login",
      description: "Authenticate with admin password and receive a session cookie.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: z.object({
              password: z.string().min(1),
            }),
          },
        },
      },
      responses: {
        "200": {
          description: "Login successful — sets httpOnly `admin-token` cookie",
          content: {
            "application/json": { schema: successResponse },
          },
        },
        "400": {
          description: "Missing password",
          content: { "application/json": { schema: errorResponse } },
        },
        "401": {
          description: "Invalid password",
          content: { "application/json": { schema: errorResponse } },
        },
        "429": {
          description: "Too many login attempts",
          content: { "application/json": { schema: errorResponse } },
        },
      },
    },
  },

  "/api/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "Admin logout",
      description: "Clear the admin session cookie.",
      responses: {
        "200": {
          description: "Logout successful",
          content: {
            "application/json": { schema: successResponse },
          },
        },
      },
    },
  },

  "/api/auth/check": {
    get: {
      tags: ["Auth"],
      summary: "Check authentication status",
      description: "Verify whether the current session cookie is valid.",
      security: [{ cookieAuth: [] }],
      responses: {
        "200": {
          description: "Authentication status",
          content: {
            "application/json": { schema: authCheckResponse },
          },
        },
        "401": {
          description: "Not authenticated",
          content: { "application/json": { schema: errorResponse } },
        },
      },
    },
  },
};

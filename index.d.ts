import { FastifyRequest, FastifyReply, Plugin } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";

export type HttpContext = {
  get: <T>(key: string) => T | undefined;
  set: <T>(key: string, value: T) => void;
};

export type Hook =
  | "onRequest"
  | "preParsing"
  | "preValidation"
  | "preHandler"
  | "preSerialization"
  | "onError"
  | "onSend"
  | "onResponse";

export type HttpContextOptions = {
  defaults?: Record<string, any>;
  hook?: Hook;
};

declare const fastifyHttpContextPlugin: Plugin<
  Server,
  IncomingMessage,
  ServerResponse,
  HttpContextOptions
>;

declare const httpContext: HttpContext;

export { fastifyHttpContextPlugin, httpContext };

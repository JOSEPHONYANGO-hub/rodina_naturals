import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function badRequest(message: string) {
  return ok({ error: message }, { status: 400 });
}

export function unauthorized() {
  return ok({ error: "Unauthorized" }, { status: 401 });
}

export function notFound(message: string) {
  return ok({ error: message }, { status: 404 });
}

export function conflict(message: string) {
  return ok({ error: message }, { status: 409 });
}

export function serverError(message: string) {
  return ok({ error: message }, { status: 500 });
}

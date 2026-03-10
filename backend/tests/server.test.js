import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../server.js";

describe("backend server", () => {
  it("responds to the health route", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Scenely API is running");
  });
});

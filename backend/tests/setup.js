import { beforeEach, vi, beforeAll, afterAll } from "vitest";
import resetDb from "./utils/reset-db.js";

beforeAll(() => {
  vi.stubEnv("SECRET", "test-secret");
});

beforeEach(async () => {
  await resetDb();
});

afterAll(() => {
  vi.unstubAllEnvs();
});

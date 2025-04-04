import { beforeEach } from "vitest";
import resetDb from "./utils/reset-db.js";

beforeEach(async () => {
  await resetDb();
});

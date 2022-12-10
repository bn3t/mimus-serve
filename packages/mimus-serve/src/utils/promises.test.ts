/* eslint-disable @typescript-eslint/no-floating-promises */
import { delay } from "./promises";

describe("promises", () => {
  test("delay 1 ms", () => {
    expect(delay(1)).resolves.toBeUndefined();
  });
  test("delay 0 ms", () => {
    expect(delay(0)).resolves.toBeUndefined();
  });
});

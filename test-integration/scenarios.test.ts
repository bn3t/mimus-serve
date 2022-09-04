import { myaxios, resetScenarios } from "./test-utils";

describe("Scenarios", () => {
  beforeEach(async () => {
    await resetScenarios();
  });

  test("should get /get-login-state and receive Is Not logged in", async () => {
    const response = await myaxios.get("/get-login-state");
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBe("Is Not logged in");
  });

  test("should post to /login to log in", async () => {
    let response = await myaxios.post("/login", {});
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBe("Logged in");
    // get /get-login-state should now return "Is Logged in"
    response = await myaxios.get("/get-login-state");
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBe("Is logged in");
    // post     /logout to log out

    response = await myaxios.post("/logout", {});
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBe("Logged out");
    // get /get-login-state should now return "Is Not logged in"
    response = await myaxios.get("/get-login-state");
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBe("Is Not logged in");
  });
});

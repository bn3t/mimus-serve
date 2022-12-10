import { myaxios, resetScenarios } from "./test-utils";

describe("Admin Mapping Routes", () => {
  beforeEach(async () => {
    await resetScenarios();
  });

  test("should reply with mappings", async () => {
    const response = await myaxios.get("/__admin/mappings");
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.meta).toBeDefined();
    expect(response.data.meta.total).toBeDefined();
    expect(response.data.meta.total).toBeGreaterThanOrEqual(28);
    expect(response.data.mappings).toBeDefined();
    expect(response.data.mappings.length).toBeGreaterThanOrEqual(28);
    expect(response.data.mappings[0].id).toBe(
      "51111a10-9016-4426-93d8-9c7c5897707f",
    );
    expect(response.data.mappings[0].name).toBe("Catch all undefined routes");
  });

  test("should reply with mappings with limit and offset (10, 0)", async () => {
    const response = await myaxios.get("/__admin/mappings?limit=10&offset=0");
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.meta).toBeDefined();
    expect(response.data.meta.total).toBeDefined();
    expect(response.data.meta.total).toBe(10);
    expect(response.data.mappings.length).toBe(10);
  });

  test("should reply with mappings with limit and offset (5, 5)", async () => {
    const response = await myaxios.get("/__admin/mappings?limit=5&offset=5");
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.meta).toBeDefined();
    expect(response.data.meta.total).toBeDefined();
    expect(response.data.meta.total).toBe(5);
    expect(response.data.mappings.length).toBe(5);
  });

  test("should reply with mappings with only offset (5)", async () => {
    const response = await myaxios.get("/__admin/mappings?offset=5");
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.mappings.length).toBeGreaterThanOrEqual(20);
  });

  test("should reply with one mapping givent its id", async () => {
    const response = await myaxios.get(
      "/__admin/mappings/51111a10-9016-4426-93d8-9c7c5897707f",
    );
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.id).toBe("51111a10-9016-4426-93d8-9c7c5897707f");
    expect(response.data.name).toBe("Catch all undefined routes");
  });
});

describe("Admin Scenarios Routes", () => {
  test("should reply with scenarios", async () => {
    const response = await myaxios.get("/__admin/scenarios");
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.length).toBe(1);
    expect(response.data[0].name).toBe("Login");
    expect(response.data[0].state).toBe("Started");
  });

  test("should reset change the state of one", async () => {
    const response = await myaxios.put("/__admin/scenarios/Login/state", {
      state: "Stopped",
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    // Check the state has changed
    const response2 = await myaxios.get("/__admin/scenarios");
    expect(response2).toBeDefined();
    expect(response2.status).toBe(200);
    expect(response2.data).toBeDefined();
    expect(response2.data.length).toBe(1);
    expect(response2.data[0].name).toBe("Login");
    expect(response2.data[0].state).toBe("Stopped");
  });
});

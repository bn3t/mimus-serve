import { Runtime } from "./runtime";

describe("Scenario", () => {
  test("should be able to start a scenario", () => {
    const runtime = new Runtime([], new Map<string, any>());
    runtime.startScenario("scenario1");
    expect(runtime.getScenarioState("scenario1")).toBe("Started");
  });

  test("should be able to change the state of a scenario", () => {
    const runtime = new Runtime([], new Map<string, any>());
    runtime.startScenario("scenario1");
    runtime.changeScenarioState("scenario1", "Finished");
    expect(runtime.getScenarioState("scenario1")).toBe("Finished");
  });

  test("should throw an error if the scenario does not exist", () => {
    const runtime = new Runtime([], new Map<string, any>());
    expect(() => runtime.getScenarioState("scenario1")).toThrowError(
      "Scenario scenario1 does not exist",
    );
  });

  test("should throw an error changing the state of a scenario that does not exist", () => {
    const runtime = new Runtime([], new Map<string, any>());
    expect(() =>
      runtime.changeScenarioState("scenario1", "Finished"),
    ).toThrowError("Scenario scenario1 does not exist");
  });

  test("should be able to reset the state of all scenarios", () => {
    const runtime = new Runtime([], new Map<string, any>());
    runtime.startScenario("scenario1");
    runtime.changeScenarioState("scenario1", "Finished");
    runtime.resetScenariosStates();
    expect(runtime.getScenarioState("scenario1")).toBe("Started");
  });
});

describe("Datasets", () => {
  test("should be able to get a dataset", () => {
    const runtime = new Runtime(
      [],
      new Map<string, any>([["dataset1", "data1"]]),
    );
    expect(runtime.getDataset("dataset1")).toBe("data1");
  });

  test("should be able to set a dataset", () => {
    const runtime = new Runtime(
      [],
      new Map<string, any>([["dataset1", "data1"]]),
    );
    runtime.setDataset("dataset1", "data2");
    expect(runtime.getDataset("dataset1")).toBe("data2");
  });

  test("should be able to check if a dataset exists", () => {
    const runtime = new Runtime(
      [],
      new Map<string, any>([["dataset1", "data1"]]),
    );
    expect(runtime.hasDataset("dataset1")).toBe(true);
  });

  test("should be able to reset the datasets", () => {
    const runtime = new Runtime(
      [],
      new Map<string, any>([["dataset1", "data1"]]),
    );
    runtime.setDataset("dataset1", "data2");
    runtime.resetDatasets();
    expect(runtime.getDataset("dataset1")).toBe("data1");
  });
});

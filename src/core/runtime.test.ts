import { Runtime } from "./runtime";

describe("Scenario", () => {
  test("should be able to start a scenario", () => {
    const runtime = new Runtime();
    runtime.startScenario("scenario1");
    expect(runtime.getScenarioState("scenario1")).toBe("Started");
  });

  test("should be able to change the state of a scenario", () => {
    const runtime = new Runtime();
    runtime.startScenario("scenario1");
    runtime.changeScenarioState("scenario1", "Finished");
    expect(runtime.getScenarioState("scenario1")).toBe("Finished");
  });

  test("should throw an error if the scenario does not exist", () => {
    const runtime = new Runtime();
    expect(() => runtime.getScenarioState("scenario1")).toThrowError(
      "Scenario scenario1 does not exist",
    );
  });

  test("should throw an error changing the state of a scenario that does not exist", () => {
    const runtime = new Runtime();
    expect(() =>
      runtime.changeScenarioState("scenario1", "Finished"),
    ).toThrowError("Scenario scenario1 does not exist");
  });

  test("should be able to reset the state of all scenarios", () => {
    const runtime = new Runtime();
    runtime.startScenario("scenario1");
    runtime.changeScenarioState("scenario1", "Finished");
    runtime.resetScenariosStates();
    expect(runtime.getScenarioState("scenario1")).toBe("Started");
  });
});

const STARTED = "Started";

export class Runtime {
  // Map of scenario names to states
  private scenarios: Map<string, string> = new Map();

  // constuct runtime with scenario names initalized to STARTED
  constructor(scenarioNames?: string[]) {
    if (scenarioNames !== undefined) {
      scenarioNames.forEach((scenarioName) =>
        this.scenarios.set(scenarioName, STARTED),
      );
    }
  }

  // Start scenario (it has the state STARTED at start)
  public startScenario(scenarioName: string) {
    this.scenarios.set(scenarioName, STARTED);
  }

  // change scenario state to a new state
  public changeScenarioState(scenarioName: string, newState: string) {
    // verify that the scenario exists
    if (!this.scenarios.has(scenarioName)) {
      throw new Error(`Scenario ${scenarioName} does not exist`);
    }
    this.scenarios.set(scenarioName, newState);
  }

  // Return the state of a scenario
  public getScenarioState(scenarioName: string): string {
    // verify that the scenario exists
    if (!this.scenarios.has(scenarioName)) {
      throw new Error(`Scenario ${scenarioName} does not exist`);
    }
    return this.scenarios.get(scenarioName) as string;
  }

  // Reset the state of all scenarios to STARTED
  public resetScenariosStates() {
    this.scenarios.forEach((_, scenarioName) =>
      this.changeScenarioState(scenarioName, STARTED),
    );
  }
}

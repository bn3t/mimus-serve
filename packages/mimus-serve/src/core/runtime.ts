import { STARTED } from "../constants";
import { Scenario } from "../types";

export class Runtime {
  // Map of scenario names to states
  private scenariosPossibleStates = new Map<string, string[]>();
  private scenariosCurrentState = new Map<string, string>();
  private loadedDatasets: Map<string, any>;
  private _datasets: Map<string, any>;

  // constuct runtime with scenario names initalized to STARTED
  constructor(scenarios: Map<string, string[]>, datasets: Map<string, any>) {
    if (scenarios !== undefined) {
      Array.from(scenarios.keys()).forEach((scenarioName) =>
        this.scenariosCurrentState.set(scenarioName, STARTED),
      );
    }
    this.scenariosPossibleStates = scenarios;
    this.loadedDatasets = datasets;
    this._datasets = new Map(this.loadedDatasets);
  }

  public resetDatasets() {
    this._datasets = new Map(this.loadedDatasets);
  }

  // get one dataset by name
  public getDataset(datasetName: string): any {
    return this._datasets.get(datasetName);
  }

  // set one dataset by name
  public setDataset(datasetName: string, data: any) {
    this._datasets.set(datasetName, data);
  }

  // has dataset by name
  public hasDataset(datasetName: string): boolean {
    return this._datasets.has(datasetName);
  }

  // Start scenario (it has the state STARTED at start)
  public startScenario(scenarioName: string) {
    this.scenariosCurrentState.set(scenarioName, STARTED);
  }

  // change scenario state to a new state
  public changeScenarioState(scenarioName: string, newState: string) {
    // verify that the scenario exists
    if (!this.scenariosCurrentState.has(scenarioName)) {
      throw new Error(`Scenario ${scenarioName} does not exist`);
    }
    this.scenariosCurrentState.set(scenarioName, newState);
  }

  // Verify that a scenarion exists
  public hasScenario(scenarioName: string): boolean {
    return this.scenariosCurrentState.has(scenarioName);
  }

  // Return the state of a scenario
  public getScenarioState(scenarioName: string): string {
    // verify that the scenario exists
    if (!this.scenariosCurrentState.has(scenarioName)) {
      throw new Error(`Scenario ${scenarioName} does not exist`);
    }
    return this.scenariosCurrentState.get(scenarioName) as string;
  }

  // Reset the state of all scenarios to STARTED
  public resetScenariosStates() {
    this.scenariosCurrentState.forEach((_, scenarioName) =>
      this.changeScenarioState(scenarioName, STARTED),
    );
  }

  // get all scenarios as an array of strings and states
  public getScenarios(): Scenario[] {
    return Array.from(this.scenariosCurrentState.entries()).map(
      ([name, state]) => ({
        name,
        state,
        possibleStates: this.scenariosPossibleStates.get(name) ?? [],
      }),
    );
  }
}

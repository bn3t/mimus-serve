import { STARTED } from "../constants";
import { Scenario } from "../types";

/**
 * The `Runtime` class represents the runtime environment for Mimus Serve.
 * It manages the state of scenarios and datasets, and provides methods for
 * accessing and modifying them.
 */
export class Runtime {
  /**
   * Map of scenario names to possible states.
   */
  private scenariosPossibleStates = new Map<string, string[]>();
  /**
   * Map of scenario names to their current state.
   */
  private scenariosCurrentState = new Map<string, string>();
  /**
   * Map of dataset names to their original loaded state.
   */
  private loadedDatasets: Map<string, any>;
  /**
   * Map of dataset names to their current state.
   */
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

  /**
   * Resets all datasets to their original loaded state.
   */
  public resetDatasets() {
    this._datasets = new Map(this.loadedDatasets);
  }

  /**
   * Returns the dataset with the given name.
   * @param datasetName The name of the dataset to retrieve.
   * @returns The dataset with the given name.
   */
  public getDataset(datasetName: string): any {
    return this._datasets.get(datasetName);
  }

  /**
   * Sets the dataset with the given name to the provided data.
   * @param datasetName The name of the dataset to set.
   * @param data The data to set for the dataset.
   */
  public setDataset(datasetName: string, data: any) {
    this._datasets.set(datasetName, data);
  }

  /**
   * Returns a boolean indicating whether a dataset with the given name exists.
   * @param datasetName The name of the dataset to check for existence.
   * @returns A boolean indicating whether a dataset with the given name exists.
   */
  public hasDataset(datasetName: string): boolean {
    return this._datasets.has(datasetName);
  }

  /**
   * Sets the state of the specified scenario to STARTED.
   * @param scenarioName The name of the scenario to start.
   */
  public startScenario(scenarioName: string) {
    this.scenariosCurrentState.set(scenarioName, STARTED);
  }

  /**
   * Changes the state of the specified scenario to the provided new state.
   * @param scenarioName The name of the scenario to change the state of.
   * @param newState The new state to set for the scenario.
   * @throws An error if the specified scenario does not exist.
   */
  public changeScenarioState(scenarioName: string, newState: string) {
    // verify that the scenario exists
    if (!this.scenariosCurrentState.has(scenarioName)) {
      throw new Error(`Scenario ${scenarioName} does not exist`);
    }
    this.scenariosCurrentState.set(scenarioName, newState);
  }

  /**
   * Returns a boolean indicating whether a scenario with the given name exists.
   * @param scenarioName The name of the scenario to check for existence.
   * @returns A boolean indicating whether a scenario with the given name exists.
   */
  public hasScenario(scenarioName: string): boolean {
    return this.scenariosCurrentState.has(scenarioName);
  }

  /**
   * Returns the current state of the specified scenario.
   * @param scenarioName The name of the scenario to retrieve the state of.
   * @returns The current state of the specified scenario.
   * @throws An error if the specified scenario does not exist.
   */
  public getScenarioState(scenarioName: string): string {
    // verify that the scenario exists
    if (!this.scenariosCurrentState.has(scenarioName)) {
      throw new Error(`Scenario ${scenarioName} does not exist`);
    }
    return this.scenariosCurrentState.get(scenarioName) as string;
  }

  /**
   * Resets the state of all scenarios to STARTED.
   */
  public resetScenariosStates() {
    this.scenariosCurrentState.forEach((_, scenarioName) =>
      this.changeScenarioState(scenarioName, STARTED),
    );
  }

  /**
   * Returns an array of objects representing all scenarios and their current state.
   * Each object contains the name of the scenario, its current state, and the possible states it can be in.
   * @returns An array of objects representing all scenarios and their current state.
   */
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

const STARTED = "Started";

export class Runtime {
  // Map of scenario names to states
  private scenarios: Map<string, string> = new Map();
  private loadedDatasets: Map<string, any>;
  private _datasets: Map<string, any>;

  // constuct runtime with scenario names initalized to STARTED
  constructor(scenarioNames: string[], datasets: Map<string, any>) {
    if (scenarioNames !== undefined) {
      scenarioNames.forEach((scenarioName) =>
        this.scenarios.set(scenarioName, STARTED),
      );
    }
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

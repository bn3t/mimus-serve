import {
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";

import mimusServeAdmin from "$lib/api/mimus-serve-admin";

type SetScenarioStateMutationVariables = {
  scenarioName: string;
  state: string;
};
export const useScenariosQuery = () => {
  return useQuery(["scenarios"], mimusServeAdmin.getScenarios);
};

export const useResetScenariosMutation = (
  options: UseMutationOptions<void, Error>,
) =>
  useMutation<void, Error>(
    ["scenarios"],
    mimusServeAdmin.resetScenarios,
    options,
  );

export const useResetScenarioStateMutation = (
  options: UseMutationOptions<void, Error, string>,
) =>
  useMutation<void, Error, string>(
    ["scenarios"],
    (scenarioName: string) => mimusServeAdmin.resetScenarioState(scenarioName),
    options,
  );

export const useSetScenarioStateMutation = (
  options: UseMutationOptions<void, Error, SetScenarioStateMutationVariables>,
) =>
  useMutation<void, Error, SetScenarioStateMutationVariables>(
    ["scenarios"],
    ({ scenarioName, state }: SetScenarioStateMutationVariables) =>
      mimusServeAdmin.setScenarioState(scenarioName, state),
    options,
  );

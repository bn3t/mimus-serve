import { vi } from "vitest";

export const useScenariosQuery = () => ({
  data: [
    {
      name: "Login",
      state: "Started",
      possibleStates: ["Started", "Logged in"],
    },
  ],
  isLoading: false,
  isError: false,
  isSuccess: true,
  error: null,
});

export const resetScenariosMutationMutateMock = vi.fn();

export const useResetScenariosMutation = () => ({
  mutate: resetScenariosMutationMutateMock,
  isLoading: false,
  isError: false,
  isSuccess: true,
  error: null,
});

export const useResetScenarioStateMutation = () => ({
  mutate: () => {},
  isLoading: false,
  isError: false,
  isSuccess: true,
  error: null,
});

export const useSetScenarioStateMutation = () => ({
  mutate: () => {},
  isLoading: false,
  isError: false,
  isSuccess: true,
  error: null,
});

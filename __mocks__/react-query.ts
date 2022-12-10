import { vi } from 'vitest';

export const useQuery = (queryKey: unknown, _queryFn: unknown, _config: unknown) => {
  if (Array.isArray(queryKey)) {
    return { data: { secretKey: 'secret_1' }, isLooading: false, isError: false, error: null };
  }
};

export const useQueryClient = () => {
  return {
    invalidateQueries: () => {},
  };
};

export const mutationMock = vi.fn();

export const useMutation = (_mutationFn: unknown, _config: unknown) => {
  return { mutate: mutationMock };
};

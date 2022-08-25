export const matchRegexp = (regexp: string, value: string) =>
  (value.match(regexp)?.length ?? 0) > 0;

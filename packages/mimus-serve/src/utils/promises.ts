export const delay = (delay: number) =>
  delay > 0
    ? new Promise((resolve) => setTimeout(resolve, delay))
    : Promise.resolve();

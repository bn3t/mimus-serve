/**
 * Delays the execution of a Promise by a specified amount of time.
 * @param delay - The amount of time to delay the Promise execution, in milliseconds.
 * @returns A Promise that resolves after the specified delay time has elapsed.
 */
export const delay = (delay: number) =>
  delay > 0
    ? new Promise((resolve) => setTimeout(resolve, delay))
    : Promise.resolve();

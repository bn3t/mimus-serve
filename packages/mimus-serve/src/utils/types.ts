/**
 * Constructs a new type that is a partial version of the provided type `T`, where all nested properties are also partial.
 *
 * @template T The type to make partial.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer I>
    ? Array<DeepPartial<I>>
    : DeepPartial<T[P]>;
};

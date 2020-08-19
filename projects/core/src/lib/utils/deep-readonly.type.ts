export type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? DeepReadonlyArray<U>
  : T extends Map<infer K, infer V>
  ? DeepReadonlyMap<K, V>
  : DeepReadonlyObject<T>;

type Primitive = undefined | null | boolean | string | number;
interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
interface DeepReadonlyMap<K, V> extends ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> {}
type DeepReadonlyObject<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>;
};

// const test: DeepReadonly<{test: number, test2: number[], test3: {test4: number, test5?: number}}> = {
//   test: 1,
//   test2: [1, 2],
//   test3: {
//     test4: 1
//   }
// };
// test.test = 2;
// test.test3.test4 = 2;
//

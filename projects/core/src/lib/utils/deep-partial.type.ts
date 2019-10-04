export type DeepPartial<P> = {
  [K in keyof P]?: DeepPartial<P[K]>;
};

// interface TestInterface {
//   test: number;
//   test2: number[];
//   test3: {
//     test4: number;
//     test5: number;
//   }
// }
//
// const d1: DeepPartial<TestInterface> = {};
// const d2: DeepPartial<TestInterface> = {test2: [1, 2]};
// const d3: DeepPartial<TestInterface> = {test3: {}};
// const d4: DeepPartial<TestInterface> = {test3: {test4: 1}};

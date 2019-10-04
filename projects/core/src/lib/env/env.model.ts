export interface FlexyEnv {
  [key: string]: FlexyEnvValue | FlexyEnvValue[];
}

export type FlexyEnvValue = string | number | boolean | FlexyEnv;

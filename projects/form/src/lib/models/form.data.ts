export type FlexyFormData = FlexyFormDataKV | FlexyFormDataKV[];

interface FlexyFormDataKV {
  [paramKey: string]: any;
}

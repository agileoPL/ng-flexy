export enum FlexyOrderDirectionEnum {
  Asc = 'asc',
  Desc = 'desc'
}
export interface FlexyOrderBy {
  field: string;
  direction: FlexyOrderDirectionEnum;
}

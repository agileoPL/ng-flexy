export type SelectOption = SelectOptionData;

export interface SelectOptionMapper {
  value: string;
  text: string;
  prefixHtml?: string;
}

export interface SelectOptionData {
  value: any;
  text: string;
  prefixHtml?: string;
  _raw?: any;
}

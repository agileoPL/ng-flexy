export interface FlexyListAction<T> {
  key: string;
  isActive: (item: T) => boolean;
  isDisabled?: (item: T) => boolean;
  label?: string;
  hoverIcon?: string;
  callback?: (item: T) => any | Promise<any>;
  separator?: boolean;
}

export interface FlexyListHeaderAction {
  key: string;
  isActive: () => boolean;
  isDisabled?: () => boolean;
  label?: string;
  hoverIcon?: string;
  callback?: () => any | Promise<any>;
  separator?: boolean;
}

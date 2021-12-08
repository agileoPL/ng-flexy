export enum FlexyCrudChangesEventEnum {
  Update = 'update',
  Add = 'add',
  Delete = 'delete',
  MultiUpdate = 'multi-update',
  MultiAdd = 'multi-add',
  MultiDelete = 'multi-delete'
}

export class FlexyCrudChangesEvent<T> {
  source?: T;
  type: FlexyCrudChangesEventEnum;

  constructor(type: FlexyCrudChangesEventEnum, source?: T) {
    this.type = type;
    this.source = source;
  }

  isUpdated() {
    return this.type === FlexyCrudChangesEventEnum.Update;
  }

  isAdded() {
    return this.type === FlexyCrudChangesEventEnum.Add;
  }

  isDeleted() {
    return this.type === FlexyCrudChangesEventEnum.Delete;
  }

  isMulti() {
    return (
      this.type === FlexyCrudChangesEventEnum.MultiAdd ||
      this.type === FlexyCrudChangesEventEnum.MultiUpdate ||
      this.type === FlexyCrudChangesEventEnum.MultiDelete
    );
  }
}

export class FlexyCrudAddEvent<T> extends FlexyCrudChangesEvent<T> {
  constructor(source?: T) {
    super(FlexyCrudChangesEventEnum.Add, source);
  }
}

export class FlexyCrudUpdateEvent<T> extends FlexyCrudChangesEvent<T> {
  constructor(source?: T) {
    super(FlexyCrudChangesEventEnum.Update, source);
  }
}

export class FlexyCrudDeleteEvent<T> extends FlexyCrudChangesEvent<T> {
  constructor(source?: T) {
    super(FlexyCrudChangesEventEnum.Delete, source);
  }
}

export class FlexyCrudMultiAddEvent<T> extends FlexyCrudChangesEvent<T> {
  constructor() {
    super(FlexyCrudChangesEventEnum.MultiAdd);
  }
}

export class FlexyCrudMultiUpdateEvent<T> extends FlexyCrudChangesEvent<T> {
  constructor() {
    super(FlexyCrudChangesEventEnum.MultiUpdate);
  }
}

export class FlexyCrudMultiDeleteEvent<T> extends FlexyCrudChangesEvent<T> {
  constructor() {
    super(FlexyCrudChangesEventEnum.MultiDelete);
  }
}

import { FlexyDateUtils } from '../utils/date.utils';
import { FlexyData } from './data';

export class FlexyModel<T extends FlexyData> {
  protected data: T;

  get id(): number | string {
    return this.data && this.data.hasOwnProperty('id') ? this.data.id : void 0;
  }

  get createdAt(): Date {
    return this.data && this.data.created_at && FlexyDateUtils.toLocalDate(this.data.created_at);
  }

  get modifiedAt(): Date {
    return this.data && this.data.modified_at && FlexyDateUtils.toLocalDate(this.data.modified_at);
  }

  get createdBy(): string {
    return this.data && this.data.created_by;
  }

  get modifiedBy(): string {
    return this.data && this.data.modified_by;
  }

  constructor(data: T) {
    this.data = data;
  }

  toJSON() {
    const json = JSON.parse(JSON.stringify(this.data));

    if (json.created_at) {
      json.created_at = json.created_at ? FlexyDateUtils.toUtcDate(json.created_at) : void 0;
    }
    if (json.modified_at) {
      json.modified_at = json.modified_at ? FlexyDateUtils.toUtcDate(json.modified_at) : void 0;
    }

    return json;
  }
}

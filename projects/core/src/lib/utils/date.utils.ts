import * as momentImported from 'moment';

const moment = momentImported;

export class FlexyDateUtils {
  static toLocalDate(date: Date | string | number): Date {
    return moment(date)
      .utc()
      .local()
      .toDate();
  }

  static toUtcDate(date: Date | string | number): Date {
    return moment(date)
      .utc()
      .toDate();
  }
}

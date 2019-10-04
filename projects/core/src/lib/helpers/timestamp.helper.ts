export class TimestampHelper {
  public static isExpired(timestamp, seconds) {
    return TimestampHelper.now() - timestamp > seconds;
  }

  public static now() {
    return Math.floor(Date.now() / 1000);
  }
}

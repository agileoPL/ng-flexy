export class ExecutionTimeHelper {
  private static mapTimers: { [id: string]: ExecutionTime } = {};

  static start(id: string, description?: string): ExecutionTime {
    return (ExecutionTimeHelper.mapTimers[id] = new ExecutionTime(id, description));
  }

  static stop(id: string) {
    if (ExecutionTimeHelper.mapTimers[id]) {
      ExecutionTimeHelper.mapTimers[id].stop();
    }
  }

  static tap(id: string, desc: string, data?: any) {
    if (ExecutionTimeHelper.mapTimers[id]) {
      const timer = ExecutionTimeHelper.mapTimers[id];
      timer.lap(desc, data);
    }
  }

  static log(id: string) {
    if (ExecutionTimeHelper.mapTimers[id]) {
      const timer = ExecutionTimeHelper.mapTimers[id];
      console.log('' + timer, timer);
    }
  }
}

export class ExecutionTime {
  get laps() {
    return this._laps;
  }

  private _id: string;
  private _start: number;
  private _description: string;
  private _stop?: number;
  private _laps?: {
    lap: number; // miniseconds
    lapBefore?: number; // miniseconds
    message?: string;
    data?: any;
  }[] = [];

  constructor(id: string, description?: string) {
    this._id = id;
    this._start = Date.now();
    this._description = description;
  }

  lap(message?: string, data?: any) {
    const lap = Date.now() - this._start;
    this._laps.push({
      lap,
      lapBefore: this._laps.length ? lap - this._laps[this._laps.length - 1].lap : void 0,
      message,
      data
    });
  }

  stop() {
    this._stop = Date.now();
  }

  toString() {
    return `[${this._id}]: ` + (!this._stop ? 'Not finished' : +((this._stop - this._start) / 1000).toFixed(2));
  }
}

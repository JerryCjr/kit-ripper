import LoggerInterface from './interface';
import commonPara from '../lib/commonPara';
import * as util from '../lib/util';

const MAX_CHARACTERS = 1 * 1024 * 1000 / 2; // 最大字符长度
const MAX_COUNTS = 30; // 最大条数

/**
 * Localstorage protocol
 * @class LocalStorageLogger
 */
export default class LocalStorageLogger extends LoggerInterface {
  /**
   * Localstorage protocol constructor
   * @constructor
   * @param {String} namespace - namespace to use
   */
  constructor(...args) {
    super(...args);
  }

  /**
   * add a log record
   * @method _reocrd
   * @private
   * @parma {String} level - log level
   * @param {String} descriptor - to speed up search and improve understanding
   * @param {Mixed} [data] - additional data
   */
  _record(level, descriptor, data) {
    var logs = window.localStorage.getItem(LocalStorageLogger._database) ? JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)) : [];
    const log = [
      commonPara.uid,
      commonPara.sessionId,
      commonPara.deviceId,
      Date.now(),
      this._namespace,
      level,
      descriptor,
      data
    ];
    let len = JSON.stringify(log).length;
    if (len > MAX_CHARACTERS / MAX_COUNTS) {
      util.throwError('single log is exceed max size');
      return false;
    }
    if (logs.length >= MAX_COUNTS) {
      logs.splice(0, logs.length - MAX_COUNTS + 1);
    }
    logs.push(log);
    try {
      util.debug(this._namespace, level, descriptor, data);
      window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify(logs));
    } catch (e) {
      window.localStorage.removeItem(LocalStorageLogger._database);
      window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify([]));
      util.throwError('failed to write, may be localStorage is full, ' + e.message);
    }
  }

  /**
   * initialize protocol
   * @method init
   * @static
   * @param {String} database - database name to use
   */
  static init(database) {
    try {
      if (!LocalStorageLogger.support) {
        util.throwError('your platform does not support localstorage protocol.');
      }
      LocalStorageLogger._database = database || 'logline';
      if (!window.localStorage.getItem(LocalStorageLogger._database)) {
        window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify([]));
      }
      LocalStorageLogger.status = super.STATUS.INITED;
    } catch (e) {
      util.throwError('failed to init, ' + e.message);
    }
  }

  /**
   * get logs in range
   * if from and end is not defined, will fetch full log
   * @method get
   * @static
   * @param {String} from - time from, unix time stamp or falsy
   * @param {String} to - time end, unix time stamp or falsy
   * @param {Function} readyFn - function to call back with logs as parameter
   */
  static get(from, to, readyFn) {
    var logs, i;
    try {
      logs = JSON.parse(window.localStorage.getItem(LocalStorageLogger._database));

      from = LoggerInterface.transTimeFormat(from);
      to = LoggerInterface.transTimeFormat(to);

      for (i = 0; i < logs.length; i++) {
        if ((from && logs[i][0] < from) || (to && logs[i][0] > to)) {
          continue;
        }

        logs[i] = {
          uid: logs[i][0],
          sessionId: logs[i][1],
          deviceId: logs[i][2],
          time: logs[i][3],
          namespace: logs[i][4],
          level: logs[i][5],
          descriptor: logs[i][6],
          data: logs[i][7]
        };
      }
      readyFn(logs);
    } catch (e) {
      util.throwError('failed to get, ' + e.message);
      readyFn([]);
    }
  }

  /**
   * clean logs = keep limited logs
   * @method keep
   * @static
   * @param {Number} daysToMaintain - keep logs within days
   */
  static keep(daysToMaintain) {
    var logs;
    try {
      logs = !daysToMaintain ? [] : (window.localStorage.getItem(LocalStorageLogger._database) ? JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)) : []).filter(log => {
        return log.time >= (Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000);
      });
      window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify(logs));
    } catch (e) {
      util.throwError('failed to keep, ' + e.message);
    }
  }

  /**
   * delete log database
   * @method clean
   * @static
   */
  static clean() {
    try {
      delete LocalStorageLogger.status;
      window.localStorage.removeItem(LocalStorageLogger._database);
    } catch (e) {
      util.throwError('failed to clean, ' + e.message);
    }
  }

  /**
   * detect support situation
   * @prop {Boolean} support
   */
  static get support() {
    return 'localStorage' in window;
  }
}

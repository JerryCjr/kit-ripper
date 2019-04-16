/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import 'babel-polyfill';
import * as qiniu from 'qiniu-js';
import {
  assert
} from './util.js';
import $ajax from './ajax';

const UTYPE = {
  default: 0,
  trace: 1
};

/**
 * trace log upload
 */
function traceUpload() {
  const arg = [...arguments[0]];
  const FILE = arg[1];
  const OBSERVER = arg[2];

  const CONFIG = {
    key: null, // 不指定key名称 使用hash值
    token: '1u1lAZOfj5sg_DOgFtZOFePnKUABddodvvnw4kjWIm:80zDurN6RfBsHsYehbe8M4naKAE=:eyJkZWxldGVBZnRlckRheXMiOjEsInJldHVybkJvZHkiOiJ7XCJrZXlcIjpcIiQoa2V5KVwiLFwiaGFzaFwiOlwiJChldGFnKVwiLFwiZnNpemVcIjokKGZzaXplKSxcImJ1Y2tldFwiOlwiJChidWNrZXQpXCIsXCJuYW1lXCI6XCIkKHg6bmFtZSlcIn0iLCJzY29wZSI6ImplcnJ5Y2pyIiwiZGVhZGxpbmUiOjE1ODY4NTMzMDN9',
    putExtra: {
      fname: 'may be a string',
      params: {},
      mimeType: ['application/json'] // 用来限制上传文件类型 为null时表示不对文件类型限制；
    },
    config: {
      useCdnDomain: true, // 表示是否使用 cdn 加速域名
      disableStatisticsReport: false, // 是否禁用日志报告，为布尔值
      retryCount: 6, // 上传自动重试次数（整体重试次数，而不是某个分片的重试次数）；
      region: qiniu.region.z0 // 选择上传域名区域；当为 null 或 undefined 时，自动分析上传域名区域。
    },
    observer: {
      next(res) {
        OBSERVER && OBSERVER.next && OBSERVER.next(res);
      },
      error(err) {
        OBSERVER && OBSERVER.error && OBSERVER.error(err);
      },
      complete(res) {
        OBSERVER && OBSERVER.complete && OBSERVER.complete(res);
      }
    }
  };
  const OBSERVABLE = qiniu.upload(FILE, CONFIG['key'], CONFIG['token'], CONFIG['putExtra'], CONFIG['config']);
  OBSERVABLE.subscribe(CONFIG['observer']);
}

/**
 * common upload is the same as qiniu upload
 */
function commonUpload() {
  const arg = [...arguments[0]];
  qiniu.upload(arg.slice(1, arg.length));
}

// utype: num, file: blob, key: string, token: string, putExtra: object, config: object
/**
 *
 * @param {number} _utype  required
 * @param {blob} _file
 * @param {string} _key
 * @param {string} _token
 * @param {object} _putExtra
 * @param {object} _config
 */
function upload(_utype, _file, _key, _token, _putExtra, _config) {
  const type = arguments[0];
  assert(type >= 0, 'Invalid utype value!');
  switch (type) {
    case UTYPE.trace:
      traceUpload(arguments);
      break;
    default:
      commonUpload(arguments);
      break;
  }
}

// example test
function example() {
  // upload(UTYPE.test); // invalid type
  // upload(UTYPE.default); // default type
  let file = new Blob(['String: this is a test; double kill'], {
    type: 'application/json'
  });
  let observer = {
    next(res) {
      console.log(res);
    },
    error(err) {
      console.log(err);
    },
    complete(res) {
      console.log(res);
      document.write(JSON.stringify(res, null, 2));
    }
  };
  upload(UTYPE.trace, file, observer); // trace type
}

example();

export default {
  upload,
  UTYPE
};

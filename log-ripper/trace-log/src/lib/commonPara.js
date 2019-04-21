import ajax from 'babyfs-request';
import env from 'babyfs-env';
// sessionId
let sessionId;
if (sessionStorage.getItem('web_sessionId')) {
  sessionId = sessionStorage.getItem('web_sessionId');
} else {
  sessionId = 'web' + Date.parse(new Date()) + Math.floor(Math.random() * 1e7);
  sessionStorage.setItem('web_sessionId', 'web' + Date.parse(new Date()) + Math.floor(Math.random() * 1e7));
}
// deviceId
let deviceId;
if (localStorage.getItem('web_deviceId')) {
  deviceId = localStorage.getItem('web_deviceId');
} else {
  deviceId = 'web' + Date.parse(new Date()) + Math.floor(Math.random() * 1e7);
  localStorage.setItem('web_deviceId', 'web' + Date.parse(new Date()) + Math.floor(Math.random() * 1e7));
}
// uid
async function uid() {
  let uid;
  if (sessionStorage.getItem('web_uid')) {
    uid = sessionStorage.getItem('web_uid');
  } else {
    uid = await fetchUid();
    sessionStorage.setItem('web_uid', uid);
  }
  return Promise.resolve(uid.toString());
}

async function fetchUid() {
  const API_HOST = env.wapi_api;
  // const API_HOST = '//wapi.dev.babyfs.cn/api';
  const URL = '/user/get_user_token';
  const API_URL = `${API_HOST}${URL}`;
  let r;
  try {
    r = await ajax.post(API_URL, null);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
  if (r && r.data) {
    return Promise.resolve(r.data);
  } else {
    return Promise.resolve(0);
  }
}

export default {
  uid: uid(),
  sessionId,
  deviceId
};

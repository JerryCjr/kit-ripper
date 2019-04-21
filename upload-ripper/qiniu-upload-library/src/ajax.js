import ajax from 'babyfs-request';

const requestHanlder = config => {
  // version=1.0&sys_version=9.0&device=iphone5&deviceId=xxx&platform=[1:iOS,2:Android]
  config['headers']['X-Static-Params'] = 'version=1.0&sys_version=9.0&device=iphone5&deviceId=xxx&platform=3';
};
const responseHandler = null;
const responseErrHandler = null;
ajax.configAjax(requestHanlder, responseHandler, responseErrHandler);

export default ajax;

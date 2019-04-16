import ajax from 'babyfs-request';

const requestHanlder = config => {
  config['headers']['x-static-params'] = '';
};
const responseHandler = null;
const responseErrHandler = null;

ajax.configAjax(requestHanlder, responseHandler, responseErrHandler);


export default ajax;

/**
 * 主模块文件
 */
import 'babel-polyfill';
import co from 'co';
import cmd from './userConfig';
import dirHelper from './directoryHelper';
import fileHelper from './fileHelper';
import { convertPromise } from './promiseWrapper';

/**
 * 入口函数
 */
function main(...args) {
	co(run).then((result) => {
		process.exit(0);
	}).catch((error) => {
		console.log(error);
		process.exit(-1);
	});
}

/**
 * 缺省执行main函数
 */
main(...process.argv.slice(2));

function* run() {
	let cmdPromise = convertPromise(cmd.run);
	let userConfig = yield cmdPromise();
	let dirPromise = convertPromise(dirHelper.run);
	yield dirPromise(userConfig);
	let filePromise = convertPromise(fileHelper.run);
	yield filePromise(userConfig);
}

/**
 * 辅助工具
 */
import fs from 'fs';

/**
 * 给对象设置默认值
 */
Object.prototype.getValueOrDefault = function (name, defaultValue) {
	if (this[name]) {
		return this[name];
	}
	else {
		return defaultValue;
	}
};

/**
 * 判断字符串是否为空
 */
String.prototype.isEmpty = function () {
	let result = this === undefined || this === null || this === '';
	return result;
};

/**
 * 将普通的字符串转换成模板字符串，同时如果字符串中包含模板字符串的参数，使用data中的同名属性替换
 * @param {String} templateString
 * @param {Object} data
 */
export function convertTemplateString(templateString, data) {
	if (data === undefined || data === null) {
		return (new Function('return `' + templateString + '`;')).apply();
	}
	let keys = Object.keys(data);
	let values = keys.map((elem) => {
		return data[elem];
	});

	// return (new Function(...keys, 'return String.raw`' + templateString + '`;')).apply(null, values);
	return (new Function(...keys, 'return `' + templateString.replace(/\\/g, '\\\\').replace(/`/g, '\\`') + '`;')).apply(null, values);
}

/**
 * 复制文件
 * @param {String} sourceFile
 * @param {String} destinationFile
 */
export function copyFile(sourceFile, destinationFile) {
	return new Promise((resolve, reject) => {
		let rs = fs.createReadStream(sourceFile);
		let ws = fs.createWriteStream(destinationFile);
		rs.on('error', (error) => {
			reject(error);
		});
		ws.on('error', (error) => {
			reject(error);
		}).on('finish', () => {
			resolve('copy completed');
		});
		rs.pipe(ws);
	});
}

/**
 * 初始化需要的文件
 */
import co from 'co';
import fs from 'fs';
import path from 'path';
import { convertTemplateString, copyFile } from './utility';

let baseDirectory = process.cwd();
// baseDirectory = '/Users/yangxu/gitspace/demo';
let configConsoleDirectory = path.resolve(__dirname, '../conf/node/console/');
let configLibraryDirectory = path.resolve(__dirname, '../conf/node/library/');
let configWebLibraryJsDirectory = path.resolve(__dirname, '../conf/web/library/js/');
let configWebLibraryVueDirectory = path.resolve(__dirname, '../conf/web/library/vue/');
let configWebSiteVueDirectory = path.resolve(__dirname, '../conf/web/site/vue/');
let userConfigContent = null;

let dependencyDictionary = require(path.resolve(__dirname, '../conf/dependencies.json'));

const toCreateNodeConsoleFiles = function (packageName) {
  packageName = `/${packageName}`;
  return new Map([
    [path.join(baseDirectory, packageName, '/.babelrc'), path.join(configConsoleDirectory, '/babelrc.tmpl')],
    [path.join(baseDirectory, packageName, '/.editorconfig'), path.join(configConsoleDirectory, '/editorconfig.tmpl')],
    [path.join(baseDirectory, packageName, '/package.json'), path.join(configConsoleDirectory, '/package.tmpl')],
    [path.join(baseDirectory, packageName, '/readme.md'), path.join(configConsoleDirectory, '/readme.tmpl')],
    [path.join(baseDirectory, packageName, '/gulpfile.js'), path.join(configConsoleDirectory, '/gulpfile.tmpl')],
    [path.join(baseDirectory, packageName, '/bin/start.js'), path.join(configConsoleDirectory, '/start.tmpl')],
    [path.join(baseDirectory, packageName, '/src/index.js'), path.join(configConsoleDirectory, '/index.tmpl')],
    [path.join(baseDirectory, packageName, '/.npmignore'), path.join(configConsoleDirectory, '/npmignore.tmpl')],
    [path.join(baseDirectory, packageName, '/.eslintrc.js'), path.join(configConsoleDirectory, '/eslintrc.tmpl')]
  ]);
};

const toCreateNodeLibraryFiles = function (packageName) {
  packageName = `/${packageName}`;
  return new Map([
    [path.join(baseDirectory, packageName, '/.babelrc'), path.join(configLibraryDirectory, '/babelrc.tmpl')],
    [path.join(baseDirectory, packageName, '/.editorconfig'), path.join(configLibraryDirectory, '/editorconfig.tmpl')],
    [path.join(baseDirectory, packageName, '/package.json'), path.join(configLibraryDirectory, '/package.tmpl')],
    [path.join(baseDirectory, packageName, '/readme.md'), path.join(configLibraryDirectory, '/readme.tmpl')],
    [path.join(baseDirectory, packageName, '/gulpfile.js'), path.join(configLibraryDirectory, '/gulpfile.tmpl')],
    [path.join(baseDirectory, packageName, '/src/index.js'), path.join(configLibraryDirectory, '/index.tmpl')],
    [path.join(baseDirectory, packageName, '/.npmignore'), path.join(configLibraryDirectory, '/npmignore.tmpl')],
    [path.join(baseDirectory, packageName, '/.eslintrc.js'), path.join(configLibraryDirectory, '/eslintrc.tmpl')]
  ]);
};

const toCreateWebLibraryJsFiles = function (packageName) {
  packageName = `/${packageName}`;
  return new Map([
    [path.join(baseDirectory, packageName, '/.babelrc'), path.join(configWebLibraryJsDirectory, '/babelrc.tmpl')],
    [path.join(baseDirectory, packageName, '/.editorconfig'), path.join(configWebLibraryJsDirectory, '/editorconfig.tmpl')],
    [path.join(baseDirectory, packageName, '/.eslintrc.js'), path.join(configWebLibraryJsDirectory, '/eslintrc.tmpl')],
    [path.join(baseDirectory, packageName, '/.npmignore'), path.join(configWebLibraryJsDirectory, '/npmignore.tmpl')],
    [path.join(baseDirectory, packageName, '/.gitignore'), path.join(configWebLibraryJsDirectory, '/gitignore.tmpl')],
    [path.join(baseDirectory, packageName, '/package.json'), path.join(configWebLibraryJsDirectory, '/package.tmpl')],
    [path.join(baseDirectory, packageName, '/readme.md'), path.join(configWebLibraryJsDirectory, '/readme.tmpl')],
    [path.join(baseDirectory, packageName, '/src/index.js'), path.join(configWebLibraryJsDirectory, '/src_index_js.tmpl')],
    [path.join(baseDirectory, packageName, '/test/karma.conf.js'), path.join(configWebLibraryJsDirectory, '/test_karma.tmpl')],
    [path.join(baseDirectory, packageName, '/test/.eslintrc.js'), path.join(configWebLibraryJsDirectory, '/test_eslintrc.tmpl')],
    [path.join(baseDirectory, packageName, '/test/unit/index.test.js'), path.join(configWebLibraryJsDirectory, '/test_unit_index.tmpl')],
    [path.join(baseDirectory, packageName, '/build/dev.js'), path.join(configWebLibraryJsDirectory, '/build_dev.tmpl')],
    [path.join(baseDirectory, packageName, '/build/prod.js'), path.join(configWebLibraryJsDirectory, '/build_prod.tmpl')],
    [path.join(baseDirectory, packageName, '/conf/index.html'), path.join(configWebLibraryJsDirectory, '/conf_html.tmpl')],
    [path.join(baseDirectory, packageName, '/conf/webpack.base.config.js'), path.join(configWebLibraryJsDirectory, '/conf_webpack_base.tmpl')],
    [path.join(baseDirectory, packageName, '/conf/webpack.dev.config.js'), path.join(configWebLibraryJsDirectory, '/conf_webpack_dev.tmpl')],
    [path.join(baseDirectory, packageName, '/conf/webpack.prod.config.js'), path.join(configWebLibraryJsDirectory, '/conf_webpack_prod.tmpl')],
    [path.join(baseDirectory, packageName, '/conf/webpack.test.config.js'), path.join(configWebLibraryJsDirectory, '/conf_webpack_test.tmpl')]
  ]);
};

const toCreateWebLibraryVueFiles = function (packageName) {
  packageName = `/${packageName}`;
  return new Map([
    [path.join(baseDirectory, packageName, '/.babelrc'), path.join(configWebLibraryVueDirectory, '/babelrc.tmpl')],
    [path.join(baseDirectory, packageName, '/.editorconfig'), path.join(configWebLibraryVueDirectory, '/editorconfig.tmpl')],
    [path.join(baseDirectory, packageName, '/.eslintrc.js'), path.join(configWebLibraryVueDirectory, '/eslintrc.tmpl')],
    [path.join(baseDirectory, packageName, '/.npmignore'), path.join(configWebLibraryVueDirectory, '/npmignore.tmpl')],
    [path.join(baseDirectory, packageName, '/.gitignore'), path.join(configWebLibraryVueDirectory, '/gitignore.tmpl')],
    [path.join(baseDirectory, packageName, '/package.json'), path.join(configWebLibraryVueDirectory, '/package.tmpl')],
    [path.join(baseDirectory, packageName, '/postcss.config.js'), path.join(configWebLibraryVueDirectory, '/postcss_config_js.tmpl')],
    [path.join(baseDirectory, packageName, '/readme.md'), path.join(configWebLibraryVueDirectory, '/readme.tmpl')],
    [path.join(baseDirectory, packageName, '/src/index.js'), path.join(configWebLibraryVueDirectory, '/src_index_js.tmpl')],
    [path.join(baseDirectory, packageName, '/src/demo/index.js'), path.join(configWebLibraryVueDirectory, '/src_demo_index_js.tmpl')],
    [path.join(baseDirectory, packageName, '/src/demo/index.vue'), path.join(configWebLibraryVueDirectory, '/src_demo_index_vue.tmpl')],
    [path.join(baseDirectory, packageName, '/src/babyfs-comp/babyfs-comp.vue'), path.join(configWebLibraryVueDirectory, '/src_comp_comp_vue.tmpl')],
    [path.join(baseDirectory, packageName, '/test/karma.conf.js'), path.join(configWebLibraryVueDirectory, '/test_karma.tmpl')],
    [path.join(baseDirectory, packageName, '/test/.eslintrc.js'), path.join(configWebLibraryVueDirectory, '/test_eslintrc.tmpl')],
    [path.join(baseDirectory, packageName, '/test/unit/comp.test.js'), path.join(configWebLibraryVueDirectory, '/test_unit_comp.tmpl')],
    [path.join(baseDirectory, packageName, '/build/dev.js'), path.join(configWebLibraryVueDirectory, '/build_dev.tmpl')],
    [path.join(baseDirectory, packageName, '/build/prod.js'), path.join(configWebLibraryVueDirectory, '/build_prod.tmpl')],
    [path.join(baseDirectory, packageName, '/conf/index.html'), path.join(configWebLibraryVueDirectory, '/conf_html.tmpl')],
    [path.join(baseDirectory, packageName, '/conf/webpack.base.config.js'), path.join(configWebLibraryVueDirectory, '/conf_webpack_base.tmpl')],
    [path.join(baseDirectory, packageName, '/conf/webpack.dev.config.js'), path.join(configWebLibraryVueDirectory, '/conf_webpack_dev.tmpl')],
    [path.join(baseDirectory, packageName, '/conf/webpack.prod.config.js'), path.join(configWebLibraryVueDirectory, '/conf_webpack_prod.tmpl')],
    [path.join(baseDirectory, packageName, '/conf/webpack.test.config.js'), path.join(configWebLibraryVueDirectory, '/conf_webpack_test.tmpl')]
  ]);
};

const toCreateWebSiteVueFiles = function (packageName) {
  packageName = `/${packageName}`;
  return new Map([
    [path.join(baseDirectory, packageName, '/build/build.js'), path.join(configWebSiteVueDirectory, '/build/build.js')],
    [path.join(baseDirectory, packageName, '/build/check-versions.js'), path.join(configWebSiteVueDirectory, '/build/check-versions.js')],
    [path.join(baseDirectory, packageName, '/build/utils.js'), path.join(configWebSiteVueDirectory, '/build/utils.js')],
    [path.join(baseDirectory, packageName, '/build/vue-loader.conf.js'), path.join(configWebSiteVueDirectory, '/build/vue-loader.conf.js')],
    [path.join(baseDirectory, packageName, '/build/webpack.base.conf.js'), path.join(configWebSiteVueDirectory, '/build/webpack.base.conf.js')],
    [path.join(baseDirectory, packageName, '/build/webpack.dev.conf.js'), path.join(configWebSiteVueDirectory, '/build/webpack.dev.conf.js')],
    [path.join(baseDirectory, packageName, '/build/webpack.prod.conf.js'), path.join(configWebSiteVueDirectory, '/build/webpack.prod.conf.js')],
    [path.join(baseDirectory, packageName, '/config/dev.env.js'), path.join(configWebSiteVueDirectory, '/config/dev.env.js')],
    [path.join(baseDirectory, packageName, '/config/index.js'), path.join(configWebSiteVueDirectory, '/config/index.js')],
    [path.join(baseDirectory, packageName, '/config/prod.env.js'), path.join(configWebSiteVueDirectory, '/config/prod.env.js')],
    [path.join(baseDirectory, packageName, '/src/main.js'), path.join(configWebSiteVueDirectory, '/src/main.js')],
    [path.join(baseDirectory, packageName, '/src/App.vue'), path.join(configWebSiteVueDirectory, '/src/App.vue')],
    [path.join(baseDirectory, packageName, '/src/common/.gitkeep'), path.join(configWebSiteVueDirectory, '/src/common/.gitkeep')],
    [path.join(baseDirectory, packageName, '/src/components/.gitkeep'), path.join(configWebSiteVueDirectory, '/src/components/.gitkeep')],
    [path.join(baseDirectory, packageName, '/src/router/index.js'), path.join(configWebSiteVueDirectory, '/src/router/index.js')],
    [path.join(baseDirectory, packageName, '/src/pages/error/error.vue'), path.join(configWebSiteVueDirectory, '/src/pages/error/error.vue')],
    [path.join(baseDirectory, packageName, '/src/pages/error/notFound.vue'), path.join(configWebSiteVueDirectory, '/src/pages/error/notFound.vue')],
    [path.join(baseDirectory, packageName, '/src/pages/home/home.vue'), path.join(configWebSiteVueDirectory, '/src/pages/home/home.vue')],
    [path.join(baseDirectory, packageName, '/static/.gitkeep'), path.join(configWebSiteVueDirectory, '/static/.gitkeep')],
    [path.join(baseDirectory, packageName, '/.babelrc'), path.join(configWebSiteVueDirectory, '/.babelrc')],
    [path.join(baseDirectory, packageName, '/.editorconfig'), path.join(configWebSiteVueDirectory, '/.editorconfig')],
    [path.join(baseDirectory, packageName, '/.eslintignore'), path.join(configWebSiteVueDirectory, '/.eslintignore')],
    [path.join(baseDirectory, packageName, '/.eslintrc.js'), path.join(configWebSiteVueDirectory, '/.eslintrc.js')],
    [path.join(baseDirectory, packageName, '/.gitignore'), path.join(configWebSiteVueDirectory, '/.gitignore.tmpl')],
    [path.join(baseDirectory, packageName, '/.postcssrc.js'), path.join(configWebSiteVueDirectory, '/.postcssrc.js')],
    [path.join(baseDirectory, packageName, '/index.html'), path.join(configWebSiteVueDirectory, '/index.html')],
    [path.join(baseDirectory, packageName, '/package.json'), path.join(configWebSiteVueDirectory, '/package.tmpl')],
    [path.join(baseDirectory, packageName, '/.babelrc'), path.join(configWebSiteVueDirectory, '/.babelrc')],
    [path.join(baseDirectory, packageName, '/README.md'), path.join(configWebSiteVueDirectory, '/README.md.tmpl')],
  ]);
};

function* doesFileExist(filename) {
	let isExists = yield new Promise((resolve, reject) => {
		fs.access(filename, (error) => {
			if (error) {
				if (error.code == 'ENOENT') {
					resolve(false);
				}
				else {
					reject(error);
				}
			}
			else {
				resolve(true);
			}
		});
	});
	return isExists;
}

function* createFile(filename, templateFilename) {
	let isExists = yield* doesFileExist(filename);
	let content = yield new Promise((resolve, reject) => {
		let rs = fs.createReadStream(templateFilename);
		let result = '';
		rs.on('data', (data) => {
			result += data;
		}).on('end', () => {
			resolve(result);
		}).on('close', () => {
			// console.log('close');
		}).on('error', (error) => {
			reject(error);
		});
	});
	if (path.extname(templateFilename) === '.tmpl') {
		content = convertTemplateString(content, userConfigContent);
	}
	if (path.basename(templateFilename) === 'package.tmpl') {
		//针对package.tmpl文件，设置依赖库的版本号
		let jsonContent = JSON.parse(content);
		for (let k in jsonContent.devDependencies) {
			jsonContent.devDependencies[k] = dependencyDictionary[k] ? dependencyDictionary[k] : '';
		}
		for (let k in jsonContent.dependencies) {
			jsonContent.dependencies[k] = dependencyDictionary[k] ? dependencyDictionary[k] : '';
		}
		content = JSON.stringify(jsonContent, null, 2);
	}
	let result = yield new Promise((resolve, reject) => {
		let ws = fs.createWriteStream(filename);
		ws.on('finish', () => {
			resolve('finish');
		}).on('close', () => {
			resolve('close');
		}).on('error', (error) => {
			reject(error);
		});
		let contentBuffer = Buffer.from(content);
		let length = contentBuffer.length;
		let hasWriteLength = 0;
		writeChunk();

		function writeChunk() {
			let writeResult = true;
			while (writeResult && hasWriteLength < length) {
				let restLength = length - hasWriteLength;
				let toWriteLength = restLength < 10240 ? restLength : 10240;
				let toWriteBuffer = contentBuffer.slice(hasWriteLength, toWriteLength);
				writeResult = ws.write(toWriteBuffer);
				hasWriteLength += toWriteLength;
			}
			if (!writeResult) {
				ws.once('drain', writeChunk);
				return;
			}
			if (hasWriteLength === length) {
				ws.end();
			}
		}
	});
	return result;
}

/**
 * 初始化相关的配置文件
 * @param {object} userConfig
 * @param {function} callback
 */
function run(userConfig, callback) {
	let o = { callback };
	callback = o.getValueOrDefault('callback', (error, data) => { });
	let that = this;
	userConfigContent = userConfig;
	let toCreateFiles = null;
  if (userConfig.runtime === 'web') {
    if (userConfig.category === 'library') {
      switch (userConfigContent.kind.toLowerCase()) {
        case 'js':
          toCreateFiles = toCreateWebLibraryJsFiles(userConfigContent.name);
          break;
        case 'vue':
          toCreateFiles = toCreateWebLibraryVueFiles(userConfigContent.name);
          break;
      }
    }
    else {
      toCreateFiles = toCreateWebSiteVueFiles(userConfigContent.name);
    }
  }
  else {
    if (userConfig.category === 'console') {
      toCreateFiles = toCreateNodeConsoleFiles(userConfigContent.name);
    }
    else {
      toCreateFiles = toCreateNodeLibraryFiles(userConfigContent.name);
    }
  }

	let promises = [];
	for (let [key, value] of toCreateFiles) {
		if (path.extname(value) === '.tmpl') {
			promises.push(co(createFile(key, value)));
		}
		else {
			promises.push(co(copyFile(value, key)));
		}
	}
	Promise.all(promises).then((results) => {
		callback.call(that);
	}).catch((error) => {
		callback.call(that, error);
	});
}

export default {
	run
};

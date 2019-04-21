/**
 * 操作脚手架目录
 */
import co from 'co';
import fs from 'fs';
import path from 'path';
import './utility';

let baseDirectory = process.cwd();
// baseDirectory = '/Users/yangxu/gitspace/demo';

let toCreateNodeConsoleDirs = function (packageName) {
  packageName = `/${packageName}`;
  return [
    [
      path.join(baseDirectory, packageName)
    ],
    [
      path.join(baseDirectory, packageName, '/bin'),
      path.join(baseDirectory, packageName, '/build'),
      path.join(baseDirectory, packageName, '/conf'),
      path.join(baseDirectory, packageName, '/dist'),
      path.join(baseDirectory, packageName, '/doc'),
      path.join(baseDirectory, packageName, '/src'),
      path.join(baseDirectory, packageName, '/test')
    ]
  ];
};

let toCreateNodeLibraryDirs = function (packageName) {
  packageName = `/${packageName}`;
  return [
    [
      path.join(baseDirectory, packageName)
    ],
    [
      path.join(baseDirectory, packageName, '/build'),
      path.join(baseDirectory, packageName, '/conf'),
      path.join(baseDirectory, packageName, '/dist'),
      path.join(baseDirectory, packageName, '/doc'),
      path.join(baseDirectory, packageName, '/src'),
      path.join(baseDirectory, packageName, '/test')
    ]
  ];
};

let toCreateWebLibraryJsDirs = function (packageName) {
  packageName = `/${packageName}`;
  return [
    [
      path.join(baseDirectory, packageName)
    ],
    [
      path.join(baseDirectory, packageName, '/build'),
      path.join(baseDirectory, packageName, '/conf'),
      path.join(baseDirectory, packageName, '/src'),
      path.join(baseDirectory, packageName, '/test')
    ],
    [
      path.join(baseDirectory, packageName, '/src/static'),
      path.join(baseDirectory, packageName, '/test/unit')
    ],
    [
      path.join(baseDirectory, packageName, '/src/static/img'),
      path.join(baseDirectory, packageName, '/src/static/style')
    ]
  ];
};

let toCreateWebLibraryVueDirs = function (packageName) {
  packageName = `/${packageName}`;
  return [
    [
      path.join(baseDirectory, packageName)
    ],
    [
      path.join(baseDirectory, packageName, '/build'),
      path.join(baseDirectory, packageName, '/conf'),
      path.join(baseDirectory, packageName, '/src'),
      path.join(baseDirectory, packageName, '/test')
    ],
    [
      path.join(baseDirectory, packageName, '/src/static'),
      path.join(baseDirectory, packageName, '/src/demo'),
      path.join(baseDirectory, packageName, '/src/babyfs-comp'),
      path.join(baseDirectory, packageName, '/test/unit')
    ],
    [
      path.join(baseDirectory, packageName, '/src/static/img'),
      path.join(baseDirectory, packageName, '/src/static/style'),
      path.join(baseDirectory, packageName, '/src/babyfs-comp/static')
    ],
    [
      path.join(baseDirectory, packageName, '/src/babyfs-comp/static/img'),
      path.join(baseDirectory, packageName, '/src/babyfs-comp/static/style')
    ]
  ];
};

let toCreateWebSiteVueDirs = function (packageName) {
  packageName = `/${packageName}`;
  return [
    [
      path.join(baseDirectory, packageName)
    ],
    [
      path.join(baseDirectory, packageName, '/build'),
      path.join(baseDirectory, packageName, '/config'),
      path.join(baseDirectory, packageName, '/src'),
      path.join(baseDirectory, packageName, '/static')
    ],
    [
      path.join(baseDirectory, packageName, '/src/common'),
      path.join(baseDirectory, packageName, '/src/components'),
      path.join(baseDirectory, packageName, '/src/pages'),
      path.join(baseDirectory, packageName, '/src/router')
    ],
    [
      path.join(baseDirectory, packageName, '/src/pages/error'),
      path.join(baseDirectory, packageName, '/src/pages/home'),
    ]
  ];
};

function* createFolder(targetDir) {
	let isExists = yield new Promise((resolve, reject) => {
		fs.access(targetDir, (error) => {
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
	if (isExists) {
		return true;
	}
	else {
		let createResult = yield new Promise((resolve, reject) => {
			fs.mkdir(targetDir, (error) => {
				if (error) {
					reject(error);
				}
				else {
					resolve(true);
				}
			});
		});
		return createResult;
	}
}

async function createFolderCascade(toCreateDirs) {
	for (let i = 0; i < toCreateDirs.length; ++i) {
		let promises = toCreateDirs[i].map((elem) => {
			return co(createFolder(elem));
		});
		await Promise.all(promises);
	}
}

/**
 * 创建项目文件夹
 * @param {object} userConfig
 * @param {function} callback
 */
function run(userConfig, callback) {
	let o = { callback };
	callback = o.getValueOrDefault('callback', (error, data) => { });
	let that = this;
  let toCreateDirs = null;
  if (userConfig.runtime === 'web') {
    if (userConfig.category === 'library') {
      switch (userConfig.kind.toLowerCase()) {
        case 'js':
          toCreateDirs = toCreateWebLibraryJsDirs(userConfig.name);
          break;
        case 'vue':
          toCreateDirs = toCreateWebLibraryVueDirs(userConfig.name);
          break;
      }
    }
    else {
      toCreateDirs = toCreateWebSiteVueDirs(userConfig.name);
    }
  }
  else {
    if (userConfig.category === 'console') {
      toCreateDirs = toCreateNodeConsoleDirs(userConfig.name);
    }
    else {
      toCreateDirs = toCreateNodeLibraryDirs(userConfig.name);
    }
  }

	if (toCreateDirs[0] instanceof Array) {
		createFolderCascade(toCreateDirs).then(() => {
			callback.call(that);
		}).catch(error => {
			callback.call(that, error);
		});
	}
	else {
		let promises = toCreateDirs.map((elem) => {
			return co(createFolder(elem));
		});
		Promise.all(promises).then((results) => {
			callback.call(that);
		}).catch((error) => {
			callback.call(that, error);
		});
	}
}

export default {
	run
};

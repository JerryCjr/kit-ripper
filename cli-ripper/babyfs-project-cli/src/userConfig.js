/**
 * 命令行操作
 */
import co from 'co';
import readline from 'readline';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// rl.on('line', (input) => {
//     process.stdout.write('You input: ' + input + '\n', 'utf8');
// });
rl.on('pause', () => {
	//console.log('pause');
});
rl.on('resume', () => {
	//console.log('resume');
});
rl.on('close', () => {
	//console.log('close');
});

function createQuestionPromise(question) {
	return new Promise(function (resolve, reject) {
		rl.question(question, resolve);
	});
}

function* conversation() {
  let name = yield createQuestionPromise('package name?');

  let runtime = '';
  do {
    runtime = yield createQuestionPromise('runtime("node"or"web", default: node)?');
    if (runtime.isEmpty()) {
      runtime = 'node';
    }
  }
  while (!validateRuntime(runtime));

  let category = '';
  if (runtime === 'web') {
    do {
      category = yield createQuestionPromise('category("library"or"site", default: library)?');
      if (category.isEmpty()) {
        category = 'library';
      }
    }
    while (!validateCategory(runtime, category));
  }
  else {
    do {
      category = yield createQuestionPromise('category("console"or"library", default: console)?');
      if (category.isEmpty()) {
        category = 'console';
      }
    }
    while (!validateCategory(runtime, category));
  }

  let webLibrary = '';
	let kind = '';
  if (runtime === 'web' && category === 'library') {
    do {
      webLibrary = yield createQuestionPromise('webpack library name(A-Za-z0-9_)?');
    }
    while (!validateWebLibrary(webLibrary));

    do {
      kind = yield createQuestionPromise('package type("js"or"vue", default: js)?');
      if (kind.isEmpty()) {
        kind = 'js';
      }
    }
    while (!validateKind(kind));
  }


	let version = '';
	do {
		version = yield createQuestionPromise('package version(default: 0.1.1)?');
		if (version.isEmpty()) {
			version = '0.1.1';
		}
	}
	while (!validateVersion(version));
	let description = yield createQuestionPromise('package description?');
	let auther = yield createQuestionPromise('develop auther?');
	return { name, runtime, category, webLibrary, kind, version, description, auther };
}

function validateRuntime(runtime) {
  runtime = runtime.toLowerCase();
	let result = ['node', 'web'].indexOf(runtime) > -1;
	if (!result) {
		rl.write('runtime is error!\n');
  }
	return result;
}

function validateCategory(runtime, category) {
  runtime = runtime.toLowerCase();
  if (runtime === 'web') {
    let result = ['library', 'site'].indexOf(category) > -1;
    if (!result) {
      rl.write('category is error!\n');
    }
    return result;
  }
  else {
    let result = ['console', 'library'].indexOf(category) > -1;
    if (!result) {
      rl.write('category is error!\n');
    }
    return result;
  }
}

function validateKind(kind) {
	kind = kind.toLowerCase();
	let result = ['js', 'vue'].indexOf(kind) > -1;
	if (!result) {
		rl.write('package type is error!\n');
	}
	return result;
}

function validateWebLibrary(webLibrary) {
	let result = webLibrary && /\w/g.test(webLibrary);
	if (!result) {
		rl.write('webpack library name is invalid!\n');
	}
	return result;
}

function validateVersion(version) {
	let regex = /[1-9]*\d+\.[1-9]*\d+\.[1-9]*\d+/g;
	let result = regex.test(version);
	if (!result) {
		rl.write('version is error!\n');
	}
	return result;
}

/**
 * 运行用户配置获取器，返回用户输入的配置项
 * @param {function} callback
 */
function run(callback) {
	let that = this;
	rl.prompt();
	co(conversation).then((arg) => {
		callback.call(that, null, arg);
	}).catch((error) => {
		callback.call(that, error);
	});
}

export default {
	run
};

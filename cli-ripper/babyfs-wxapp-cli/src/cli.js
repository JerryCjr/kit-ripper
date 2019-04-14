#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const program = require('commander');
const inquirer = require('inquirer');
const _ = require('./utils');

const packageConfig = require('../package.json');
const initCustomComponent = require('./custom-component/init');
const upgradeCustomComponent = require('./custom-component/upgrade');
const initQuickstart = require('./quickstart/init');
const initMinaTemplate = require('./mina-template/init');
const minaUpgrade = require('./mina/upgrade');
const initMinaPureJs = require('./mina-purejs/init');

function inquirerHandler(dirPath, options, cb) {
  const defaultName = path.basename(dirPath);
  inquirer
    .prompt([{
      type: 'input',
      name: 'name',
      message: 'please input the package name',
      default: defaultName
    }, {
      type: 'input',
      name: 'version',
      message: 'please input the package version',
      default: '1.0.0',
      validate(input) {
        return input.match(/^\d+\.\d+\.\d+$/) ? true : 'the version must be in <number>.<number>.<number> format';
      }
    }, {
      type: 'input',
      name: 'dist',
      message: 'please input the miniprogram dist folder',
      default: 'miniprogram_dist'
    }, {
      type: 'input',
      name: 'git',
      message: 'please input the git repository url'
    }, {
      type: 'input',
      name: 'author',
      message: 'please input the author'
    }])
    .then(answers => cb(dirPath, Object.assign(options, answers)))
    // eslint-disable-next-line no-console
    .catch(err => console.error(err));
}

/**
 * 开始初始化MINA-TEMPLATE
 */
function startInitMinaTemplate(dirPath, options) {
  inquirerHandler(dirPath, options, initMinaTemplate);
}

/**
 * 开始初始化MINA-PUREJS
 */
function startInitMinaPureJs(dirPath, options) {
  inquirerHandler(dirPath, options, initMinaPureJs);
}

/**
 * 开始初始化自定义组件
 */
function startInitCustomComponent(dirPath, options) {
  inquirerHandler(dirPath, options, initCustomComponent);
}

/**
 * 开始升级自定义组件
 */
function startUpgradeCustomComponent(dirPath, options) {
  if (options.force) {
    upgradeCustomComponent(dirPath, options);
  } else {
    inquirer.prompt([{
      type: 'checkbox',
      name: 'override',
      message: 'which files should be overrided',
      pageSize: 10,
      choices: [{
        name: 'package.json (only override "scripts", "jest" and "devDependencies")',
        checked: true
      }, {
        name: 'tools/config.js',
        checked: true
      },
      {
        name: 'test/utils.js',
        checked: true
      },
      {
        name: 'other tools files (gulpfile.js, tools/build.js, tools/utils.js, tools/checkcomponents.js, tools/test/*.js)',
        checked: true
      },
      {
        name: 'other config files (.babelrc, .eslintrc)',
        checked: true
      },
      {
        name: 'tools/demo'
      },
      {
        name: 'ignore config (.gitignore, .npmignore)'
      }
      ]
    }])
      .then(answers => upgradeCustomComponent(dirPath, Object.assign(options, answers)))
      // eslint-disable-next-line no-console
      .catch(err => console.error(err));
  }
}

/**
 * 开始初始化
 */
function startInit(dirPath, options) {
  function init(cb, filePath) {
    if (options.force) {
      cb(dirPath, options);
    } else {
      try {
        fs.accessSync(path.join(dirPath, filePath));
        // eslint-disable-next-line no-console
        console.log(`project already exists: ${dirPath}`);
      } catch (err) {
        cb(dirPath, options);
      }
    }
  }

  switch (options.type) {
    case 'custom-component':
      init(startInitCustomComponent, './package.json'); // 自定义组件
      break;
    case 'mina-template':
      init(startInitMinaTemplate, './package.json'); // mina-template
      break;
    case 'mina-purejs':
      init(startInitMinaPureJs, './package.json'); // mina-purejs
      break;
    default:
      init(initQuickstart, './project.config.json'); // 其他quickStart
      break;
  }
}

/**
 * 开始升级
 */
function startUpgrade(dirPath, options) {
  function next(cb, filePath) {
    try {
      fs.accessSync(path.join(dirPath, filePath));
      cb(dirPath, options);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      // eslint-disable-next-line no-console
      console.log(`project is not valid: ${dirPath}`);
    }
  }
  switch (options.type) {
    case 'custom-component':
      next(startUpgradeCustomComponent, './package.json'); // 自定义组件
      break;
    case 'mina-template':
    case 'mina-purejs':
      next(minaUpgrade, './package.json');
      break;
    default:
      next(startUpgradeCustomComponent, './package.json'); // 自定义组件
      break;
  }
}

program
  .version(packageConfig.version);

/**
 * 初始化相关
 */
program
  .command('init [dirPath]')
  .description('create a project with template project')
  .option('-t, --type <type>', 'template project type, only accept "custom-component", "miniprogram", "plugin", "game" ,"mina-template", "mina-purejs"')
  .option('-f, --force', 'all files will be overrided whether it already exists or not')
  .option('-p, --proxy <url>', 'http/https request proxy')
  .option('-n, --newest', 'use newest template to initialize project')
  .action((dirPath, options) => {
    dirPath = dirPath || process.cwd();

    const choices = ['custom-component', 'miniprogram', 'plugin', 'game', 'mina-template', 'mina-purejs'];

    if (options.type === 'node' || options.type === 'php') {
      // eslint-disable-next-line no-console
      console.log(`template project [ ${options.type} ] has been deprecated`);
    }

    if (!options.type || choices.indexOf(options.type) < 0) {
      // 未指定类型，则发起询问
      inquirer
        .prompt([{
          type: 'list',
          name: 'type',
          message: 'which type of project want to use to initialize',
          default: 'custom-component',
          choices,
        }])
        .then(answers => startInit(dirPath, Object.assign(options, answers)))
        // eslint-disable-next-line no-console
        .catch(err => console.error(err));
    } else {
      // 已指定类型
      startInit(dirPath, options);
    }
  });

/**
 * 升级相关
 */
program
  .command('upgrade [dirPath]')
  .description('upgrade the miniprogram custom component framwork')
  .option('-f, --force', 'all files will be overrided except src folder and test case files')
  .option('-p, --proxy <url>', 'http/https request proxy')
  .action((dirPath, options) => {
    dirPath = dirPath || process.cwd();

    const choices = ['custom-component', 'mina-template', 'mina-purejs'];
    if (!options.type || choices.indexOf(options.type) < 0) {
      // 未指定类型，则发起询问
      inquirer
        .prompt([{
          type: 'list',
          name: 'type',
          message: 'which type of project want to use to initialize',
          default: 'custom-component',
          choices,
        }])
        .then(answers => startUpgrade(dirPath, Object.assign(options, answers)))
        // eslint-disable-next-line no-console
        .catch(err => console.error(err));
    } else {
      // 已指定类型
      startUpgrade(dirPath, options);
    }
  });

/**
 * 缓存相关
 */
program
  .command('cache')
  .description('show the path of template projects cache')
  .option('-c, --clear', 'clear cache')
  .action(options => {
    const templateDir = _.getTemplateDir();

    if (options.clear) {
      _.removeDir(templateDir)
        // eslint-disable-next-line no-console
        .then(() => console.log(`[remove cache done]: ${templateDir}`))
        // eslint-disable-next-line no-console
        .catch(err => console.error(err));
    } else {
      // eslint-disable-next-line no-console
      console.log(templateDir);
    }
  });

program.parse(process.argv);

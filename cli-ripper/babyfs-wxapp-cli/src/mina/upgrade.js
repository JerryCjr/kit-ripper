/* eslint-disable import/no-dynamic-require */
const path = require('path');
const inquirer = require('inquirer');
const _ = require('../utils');

const templateDir = _.getTemplateDir();

let config;
let templateProject;
let globOptions;

// mina-template => minaTemplate
function transformer(str) {
  const re = /-(\w)/g;
  return str.replace(re, function ($0, $1) {
    return $1.toUpperCase();
  });
}

// 一些配置的初始化
function init(type) {
  config = require('../config')[transformer(type)];
  templateProject = path.join(templateDir, config.name);
  globOptions = {
    cwd: templateProject,
    nodir: true,
    dot: true
  };
}

function checkOverride(type, override) {
  for (let index = 0; index < override.length; index++) {
    if (override[index].indexOf(type) === 0) return true;
  }
  return false;
}

async function upgradePackageJson(dirPath) {
  const newJsonPath = path.join(templateProject, 'package.json');
  const oldJsonPath = path.join(dirPath, 'package.json');

  const newJson = require(newJsonPath);
  const oldJson = require(oldJsonPath);

  // 只覆盖 scripts jest devDependencies 三个字段
  oldJson.scripts = newJson.scripts;
  oldJson.jest = newJson.jest;
  oldJson.devDependencies = newJson.devDependencies;

  await _.writeFile(oldJsonPath, JSON.stringify(oldJson, null, '\t'));
}

// eslint-disable-next-line complexity
async function copyOthers(dirPath, options) {
  const override = options.override || [];
  let gulpfiles = [];
  let tools = [];
  let otherConfig = [];
  let ignore = [];
  let demo = [];

  // gulpfile.js/*
  if (options.force || checkOverride('gulpfiles', override)) {
    const originGulpFilePath = path.join(dirPath, 'gulpfile.js');
    await _.removeDir(originGulpFilePath);
    gulpfiles = await _.globSync('gulpfile.js/**/*', globOptions);
  }

  // tools
  if (options.force || checkOverride('tools files', override)) {
    tools = await _.globSync('tools/*', globOptions);
  }

  // 其他构建相关配置文件 eslintrc editorconfig
  if (options.force || checkOverride('other config files', override)) {
    const eslint = await _.globSync('./.eslintrc.js', globOptions);
    const editor = await _.globSync('./.editorconfig', globOptions);

    otherConfig = [...eslint, ...editor];
  }

  // ignore 相关配置文件 gitignore npmignore
  if (options.force || checkOverride('ignore config', override)) {
    const gitignore = await _.globSync('./.gitignore', globOptions);
    const npmignore = await _.globSync('./.npmignore', globOptions);

    ignore = [...gitignore, ...npmignore];
  }

  // demo
  if (options.force || checkOverride('demo', override)) {
    demo = await _.globSync('demo/**/*', globOptions);
  }

  const allFiles = [...gulpfiles, ...tools, ...otherConfig, ...ignore, ...demo];
  for (let i = 0, len = allFiles.length; i < len; i++) {
    const filePath = allFiles[i];
    if (filePath) {
      const copySourcePath = path.join(templateProject, filePath);
      const copyDestPath = path.join(dirPath, filePath);
      // eslint-disable-next-line no-await-in-loop
      await _.copyFile(copySourcePath, copyDestPath);
    }
  }
}

async function upgrade(dirPath, options) {
  // 删除旧模板，拉取新模板
  await _.removeDir(templateProject);
  await _.downloadTemplate(config, options.proxy);

  const isTemlateExist = await _.checkDirExist(templateProject);

  if (!isTemlateExist) {
    // eslint-disable-next-line no-console
    console.log('can not download the template project, please check your internet connection.');
    process.exit(1);
  }

  const override = options.override || [];

  if (options.force || checkOverride('package.json', override)) {
    await upgradePackageJson(dirPath);
  }

  await copyOthers(dirPath, options);
}

// 升级mina template
function startMinaUpgrade(dirPath, options) {
  init(options.type); // 初始化配置
  if (options.force) {
    upgrade(dirPath, options);
  } else {
    inquirer
      .prompt([{
        type: 'checkbox',
        name: 'override',
        message: 'which files should be overrided',
        pageSize: 10,
        choices: [{
            name: 'package.json (only override "scripts", "jest" and "devDependencies")',
            checked: true
          },
          {
            name: 'gulpfiles(gulpfile.js/**/*.js)',
            checked: true
          },
          {
            name: 'tools files(tools/*.js)',
            checked: true
          },
          {
            name: 'other config files (.eslintrc, .editorconfig)'
          },
          {
            name: 'ignore config (.gitignore, .npmignore)'
          },
          {
            name: 'demo'
          }
        ]
      }])
      .then(answers => upgrade(dirPath, Object.assign(options, answers)))
      // eslint-disable-next-line no-console
      .catch(err => console.error(err));
  }
}

module.exports = startMinaUpgrade;

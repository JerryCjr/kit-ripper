const originalConsoleLog = console.log;

function consoleLogProxy() {
  originalConsoleLog.apply(console, arguments);
  const appendDom = document.createElement('div');
  appendDom.id = 'htmlConsole';
  document.body.appendChild(appendDom);
  const message = Array.prototype.slice.apply(arguments, []).join(' ');
  appendDom.innerHTML += `<li>[log] ${message}</li>`;
}

console.log = consoleLogProxy;
/*
 * @Author: jinwenwu
 * @Date: 2021-11-09 13:53:14
 * @LastEditors: jinwenwu
 * @LastEditTime: 2021-11-11 10:11:07
 * @Description: file content
 */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
const utils = require("./utils");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "zhoupu-json-model" is now active!'
  );
  require("./transfomerAll")(context);
  require("./transfomerSelect")(context);
}
export function deactivate() {}

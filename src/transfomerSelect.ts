/*
 * @Author: jinwenwu
 * @Date: 2021-11-10 11:29:02
 * @LastEditors: jinwenwu
 * @LastEditTime: 2021-11-11 10:17:46
 * @Description: 转换文件中的选中的文本
 */
import * as vscode from "vscode";
const utils = require("./utils");

module.exports = function (context: any) {
  let disposable = vscode.commands.registerCommand(
    "yapi-json-model.jsonModelSelect",
    (uri) => {
      const editor = vscode.window.activeTextEditor;
      const document = editor!.document;
      const start = editor!.selection.start;
      const end = editor!.selection.end;
      const word = document.getText(
        new vscode.Range(start.line, start.character, end.line, end.character)
      );

      const resultText = utils.removeHeaderNotes(word);
      const isJSON = utils.isJSON(resultText);
      if (isJSON) {
        const canTransfomer = utils.judgeCanTransfomer(resultText);
        if (canTransfomer) {
          const newText = utils.createModelFile(resultText, false);
          vscode.window.activeTextEditor!.edit((editBuilder) => {
            editBuilder.replace(new vscode.Range(start, end), newText);
          });
        } else {
          vscode.window.showInformationMessage(
            "当前JSON字符串不满足可以转化格式要求，请检查JSON格式"
          );
        }
      } else {
        vscode.window.showInformationMessage("请输入正确的JSON字符串");
      }
    }
  );

  context.subscriptions.push(disposable);
};

/*
 * @Author: jinwenwu
 * @Date: 2021-11-10 11:25:38
 * @LastEditors: jinwenwu
 * @LastEditTime: 2021-11-10 13:57:29
 * @Description: 转换文件中的所有文本
 */
import * as vscode from "vscode";
const utils = require("./utils");

module.exports = function (context: any) {
  let disposable = vscode.commands.registerCommand(
    "yapi-json-model.jsonModelAll",
    (uri) => {
      const document = vscode.window.activeTextEditor!.document;
      const word = document.getText(
        document.getWordRangeAtPosition(
          new vscode.Position(document.lineCount + 1, 0)
        )
      );
      const resultText = utils.removeHeaderNotes(word);
      const isJSON = utils.isJSON(resultText);
      if (isJSON) {
        const canTransfomer = utils.judgeCanTransfomer(resultText);
        if (canTransfomer) {
          const newText = utils.createModelFile(resultText, true);
          vscode.window.activeTextEditor!.edit((editBuilder) => {
            const end = new vscode.Position(
              vscode.window.activeTextEditor!.document.lineCount + 1,
              0
            );
            editBuilder.replace(
              new vscode.Range(new vscode.Position(0, 0), end),
              newText
            );
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

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {


/*
 * @Author: jinwenwu
 * @Date: 2021-11-09 15:04:01
 * @LastEditors: jinwenwu
 * @LastEditTime: 2021-11-11 10:18:03
 * @Description: 工具类
 */
const utils = {
    /**
     * 将一个单词首字母大写并返回
     * @param {*} word 某个字符串
     */
    upperFirstLetter(word) {
        return (word || "").replace(/^\w/, (m) => m.toUpperCase());
    },
    /**
     * 移除头部注释
     * @param {*} text 某个字符串
     */
    removeHeaderNotes(text) {
        if (text.startsWith("/*")) {
            // 含有头部注释
            const endIndex = text.indexOf("*/");
            const result = text.substr(endIndex + 2, text.length - endIndex - 2);
            return result;
        }
        else {
            return text;
        }
    },
    /**
     * 判断是否是Json字符串
     * @param {*} text 某个字符串
     */
    isJSON(text) {
        if (typeof text === "string") {
            try {
                const obj = JSON.parse(text);
                if (typeof obj === "object" && obj) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                return false;
            }
        }
        return false;
    },
    /**
     * 判断Json字符串是否可以被正确转换
     * @param {*} text 某个字符串
     */
    judgeCanTransfomer(text) {
        const obj = JSON.parse(text);
        const keys = Object.keys(obj);
        if (keys.length === 1) {
            const subObj = obj[keys[0]];
            if (subObj.type && subObj.type === "object") {
                return true;
            }
        }
        return false;
    },
    /**
     * 生成对应的model文件内容
     * @param {*} text 某个字符串
     */
    createModelFile(text, addType) {
        const obj = JSON.parse(text);
        const resultText = this.createModelDto(obj);
        if (addType) {
            return `import { Type } from 'class-transformer'; \n \n${resultText}`;
        }
        else {
            return resultText;
        }
    },
    /**
     * 根据对象生成model模型
     * @param {*} obj 某个对象
     */
    createModelDto(obj) {
        let resultText = "";
        const keys = Object.keys(obj);
        const subObj = obj[keys[0]];
        const nextObj = subObj.properties;
        const objStr = this.createDtoStr(keys[0], nextObj);
        resultText += `${objStr} \n`;
        return resultText;
    },
    /**
     * 根据name和其子值，生成Dto
     * @param {*} objName 对象名
     * @param {*} subObj 子值
     */
    createDtoStr(objName, subObj) {
        const name = utils.upperFirstLetter(objName);
        let resultText = `export class ${name}Dto { \n`;
        const keys = Object.keys(subObj);
        let objAry = [];
        keys.map((item) => {
            const nextObj = subObj[item];
            const itemName = utils.upperFirstLetter(item);
            if (nextObj.title) {
                resultText += `// ${nextObj.title} \n`;
            }
            else if (nextObj.description) {
                resultText += `// ${nextObj.description} \n`;
            }
            if (nextObj.type === "object") {
                resultText += `@Type(() => ${itemName}Dto) \n`;
                resultText += `public ${item}?: ${itemName}Dto;\n`;
                const properObj = nextObj.properties;
                objAry.push({ objName: item, subObj: properObj });
            }
            else if (nextObj.type === "array") {
                const items = nextObj.items;
                if (items.type === "object") {
                    resultText += `@Type(() => ${itemName}Dto) \n`;
                    resultText += `public ${item}?: ${itemName}Dto[];\n`;
                    const properObj = items.properties;
                    objAry.push({ objName: item, subObj: properObj });
                }
                else {
                    resultText += `public ${item}?: ${items.type}[]; \n`;
                }
            }
            else if (nextObj.type === "string") {
                resultText += `public ${item}?: string; \n`;
            }
            else if (nextObj.type === "number") {
                resultText += `public ${item}?: number; \n`;
            }
            else if (nextObj.type === "boolean") {
                resultText += `public ${item}?: boolean; \n`;
            }
        });
        resultText += `} \n`;
        objAry.map((item) => {
            const otherStr = this.createDtoStr(item.objName, item.subObj);
            resultText += `\n${otherStr} \n`;
        });
        return resultText;
    },
};
module.exports = utils;


/***/ }),
/* 2 */
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/*
 * @Author: jinwenwu
 * @Date: 2021-11-10 11:25:38
 * @LastEditors: jinwenwu
 * @LastEditTime: 2021-11-10 13:57:29
 * @Description: 转换文件中的所有文本
 */
const vscode = __webpack_require__(3);
const utils = __webpack_require__(1);
module.exports = function (context) {
    let disposable = vscode.commands.registerCommand("yapi-json-model.jsonModelAll", (uri) => {
        const document = vscode.window.activeTextEditor.document;
        const word = document.getText(document.getWordRangeAtPosition(new vscode.Position(document.lineCount + 1, 0)));
        const resultText = utils.removeHeaderNotes(word);
        const isJSON = utils.isJSON(resultText);
        if (isJSON) {
            const canTransfomer = utils.judgeCanTransfomer(resultText);
            if (canTransfomer) {
                const newText = utils.createModelFile(resultText, true);
                vscode.window.activeTextEditor.edit((editBuilder) => {
                    const end = new vscode.Position(vscode.window.activeTextEditor.document.lineCount + 1, 0);
                    editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), end), newText);
                });
            }
            else {
                vscode.window.showInformationMessage("当前JSON字符串不满足可以转化格式要求，请检查JSON格式");
            }
        }
        else {
            vscode.window.showInformationMessage("请输入正确的JSON字符串");
        }
    });
    context.subscriptions.push(disposable);
};


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 4 */
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/*
 * @Author: jinwenwu
 * @Date: 2021-11-10 11:29:02
 * @LastEditors: jinwenwu
 * @LastEditTime: 2021-11-11 10:17:46
 * @Description: 转换文件中的选中的文本
 */
const vscode = __webpack_require__(3);
const utils = __webpack_require__(1);
module.exports = function (context) {
    let disposable = vscode.commands.registerCommand("yapi-json-model.jsonModelSelect", (uri) => {
        const editor = vscode.window.activeTextEditor;
        const document = editor.document;
        const start = editor.selection.start;
        const end = editor.selection.end;
        const word = document.getText(new vscode.Range(start.line, start.character, end.line, end.character));
        const resultText = utils.removeHeaderNotes(word);
        const isJSON = utils.isJSON(resultText);
        if (isJSON) {
            const canTransfomer = utils.judgeCanTransfomer(resultText);
            if (canTransfomer) {
                const newText = utils.createModelFile(resultText, false);
                vscode.window.activeTextEditor.edit((editBuilder) => {
                    editBuilder.replace(new vscode.Range(start, end), newText);
                });
            }
            else {
                vscode.window.showInformationMessage("当前JSON字符串不满足可以转化格式要求，请检查JSON格式");
            }
        }
        else {
            vscode.window.showInformationMessage("请输入正确的JSON字符串");
        }
    });
    context.subscriptions.push(disposable);
};


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const utils = __webpack_require__(1);
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    console.log('Congratulations, your extension "zhoupu-json-model" is now active!');
    __webpack_require__(2)(context);
    __webpack_require__(4)(context);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map
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
  upperFirstLetter(word: string) {
    return (word || "").replace(/^\w/, (m) => m.toUpperCase());
  },

  /**
   * 移除头部注释
   * @param {*} text 某个字符串
   */
  removeHeaderNotes(text: string) {
    if (text.startsWith("/*")) {
      // 含有头部注释
      const endIndex = text.indexOf("*/");
      const result = text.substr(endIndex + 2, text.length - endIndex - 2);
      return result;
    } else {
      return text;
    }
  },

  /**
   * 判断是否是Json字符串
   * @param {*} text 某个字符串
   */
  isJSON(text: string) {
    if (typeof text === "string") {
      try {
        const obj = JSON.parse(text);
        if (typeof obj === "object" && obj) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
    return false;
  },

  /**
   * 判断Json字符串是否可以被正确转换
   * @param {*} text 某个字符串
   */
  judgeCanTransfomer(text: string) {
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
  createModelFile(text: string, addType: boolean) {
    const obj = JSON.parse(text);
    const resultText = this.createModelDto(obj);
    if (addType) {
      return `import { Type } from 'class-transformer'; \n \n${resultText}`;
    } else {
      return resultText;
    }
  },

  /**
   * 根据对象生成model模型
   * @param {*} obj 某个对象
   */
  createModelDto(obj: any) {
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
  createDtoStr(objName: string, subObj: any) {
    const name = utils.upperFirstLetter(objName);
    let resultText = `export class ${name}Dto { \n`;
    const keys = Object.keys(subObj);
    let objAry: any[] = [];
    keys.map((item: string) => {
      const nextObj = subObj[item];
      const itemName = utils.upperFirstLetter(item);
      if (nextObj.title) {
        resultText += `// ${nextObj.title} \n`;
      } else if (nextObj.description) {
        resultText += `// ${nextObj.description} \n`;
      }
      if (nextObj.type === "object") {
        resultText += `@Type(() => ${itemName}Dto) \n`;
        resultText += `public ${item}?: ${itemName}Dto;\n`;
        const properObj = nextObj.properties;
        objAry.push({ objName: item, subObj: properObj });
      } else if (nextObj.type === "array") {
        const items = nextObj.items;
        if (items.type === "object") {
          resultText += `@Type(() => ${itemName}Dto) \n`;
          resultText += `public ${item}?: ${itemName}Dto[];\n`;
          const properObj = items.properties;
          objAry.push({ objName: item, subObj: properObj });
        } else {
          resultText += `public ${item}?: ${items.type}[]; \n`;
        }
      } else if (nextObj.type === "string") {
        resultText += `public ${item}?: string; \n`;
      } else if (nextObj.type === "number") {
        resultText += `public ${item}?: number; \n`;
      } else if (nextObj.type === "boolean") {
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

"use strict";
/**
 * String manipulation tools for data sanitazition.
 *
 * @author Oste Jannick
 * @created 2022/03/15
 * @lastUpdate 2022/03/19
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlspecialchars = void 0;
/** Checks for the characters (&, <, >, ', ") and replaces them by there keycode value : &#CODE; */
const htmlspecialchars = (str) => {
    return str.replace(/[&<>'"]/g, i => `&#${i.charCodeAt(0)};`);
};
exports.htmlspecialchars = htmlspecialchars;

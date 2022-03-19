
/**
 * String manipulation tools for data sanitazition.
 * 
 * @author Oste Jannick
 * @created 2022/03/15
 * @lastUpdate 2022/03/19
 */

/** Checks for the characters (&, <, >, ', ") and replaces them by there keycode value : &#CODE; */
export const htmlspecialchars = (str: string): string =>
{
    return  str.replace(/[&<>'"]/g, i => `&#${i.charCodeAt(0)};`) ;
}
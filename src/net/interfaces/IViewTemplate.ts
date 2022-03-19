import { IWebRequest } from './IWebRequest';

/**
 * Callback interface for EJS view requests.
 * 
 * @module src.net.interfaces.IViewTemplate
 * @author Oste Jannick
 * @created 2022/03/17
 * @lastUpdate 2022/03/19
 */
 export interface IViewTemplate {

    /**
     * Post method callback
     */
    post: IWebRequest | undefined,
  
    /**
     * Get method callback
     * @param request 
     */
    get: Function | undefined
} 
  
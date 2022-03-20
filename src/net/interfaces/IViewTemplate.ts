/**  @module net.interfaces  */

import { IWebRequest } from "./IWebRequest";

/**  Callback interface for EJS view requests. */
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

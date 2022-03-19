import { IWebRequest } from './IWebRequest';

/**
 * Callback interface for EJS view requests.
 * 
 * @author Oste Jannick
 * @created 2022/03/17
 * @lastUpdate 2022/03/19
 */
 export abstract class IViewTemplate {

    /**
     * Post method callback
     */
    public abstract post: IWebRequest | undefined;
  
    /**
     * Get method callback
     * @param request 
     */
    public abstract get: Function | undefined;
} 
  
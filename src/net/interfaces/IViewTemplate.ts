import { IWebRequest } from './IWebRequest';
/**
 * IViewTemplate interface object, namespace and implemntations.
 * 
 * Implementation have to be implemented in IViewTemplate.ts otherwise they will not be recognized by the namespace.
 * @!TODO: look for universal solution
 */

 type Wrapper < T > = {
    new(...args: any[]): T;

    readonly prototype: T;
  }
//#region View interface and namespace.
/**
 * View data interface
 */
 export abstract class IViewTemplate {

    constructor()
    {
        console.log("Hello world");
    }
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
  
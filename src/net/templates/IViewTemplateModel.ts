/**
 * IViewTemplate interface object, namespace and implemntations.
 * 
 * Implementation have to be implemented in IViewTemplate.ts otherwise they will not be recognized by the namespace.
 * @!TODO: look for universal solution
 */

//#region View interface and namespace.
/**
 * View data interface
 */
 export abstract class IViewTemplateModel {
    /**
     * Post method callback
     * @param request 
     * @param response
     */
    public post: Function | undefined = (req: any, res: any) => undefined;
  
    /**
     * Get method callback
     * @param request 
     */
    public get: Function | undefined = (req: any, res: any): object | undefined => undefined;
  } 
  
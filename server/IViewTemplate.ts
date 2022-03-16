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
export abstract class IViewTemplate {
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
  public abstract get(request: any): object;
}

/**
 * Namespace containing IViewTemplates, used for registering views based on generic type attribute (T).
 */
export namespace IViewTemplate {
  type Wrapper < T > = {
    new(...args: any[]): T;

    readonly prototype: T;
  }

  const viewImplementations: Wrapper < IViewTemplate > [] = [];

  export function getViews(): Wrapper < IViewTemplate > [] {
    return viewImplementations;
  }

  export function set < T extends Wrapper < IViewTemplate >> (ctor: T) {
    viewImplementations.push(ctor);
    return ctor;
  }
}
//#endregion

//#region Page objects
/**
 * Implementation of IViewTemplate interface in class style. 
 * 
 */
@IViewTemplate.set
class Index {
  get(req: any) {
    return {}
  }

  post = undefined
}
/**
 * Implementation of IViewTemplate interface in class style. 
 * 
 */
@IViewTemplate.set
class GetExample {
  get(req: any) {
    return {
      person: req.query.index == undefined ? "No person index defined" : [{name: "Jannick Oste"}, {name: "Tom Bom"}][req.query.index],
      index: req.query.index == undefined ? -1 : Number.parseInt(req.query.index)
    }
  }

  post = undefined
} 

@IViewTemplate.set
class PostExample
{
  get(req: any) 
  {
    return {message: undefined}
  }

  post(req: any, res: any)  {
    return {
      message: `Welcome, ${req.body.fname}`
    }
  }
}
//#endregion
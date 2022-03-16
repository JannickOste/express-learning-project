import { IViewTemplateModel } from "./IViewTemplateModel";

/**
 * Namespace containing IViewTemplates, used for registering views based on generic type attribute (T).
 * models must be made in IViewTemplates.ts otherwise they wont be detected, 
 * todo: look into universal solution..;
 */
export namespace IViewTemplates {
  type Wrapper < T > = {
    new(...args: any[]): T;

    readonly prototype: T;
  }

  const viewImplementations: Wrapper < IViewTemplateModel > [] = [];

  /**
   * Get all registered views using the set attribute 
   * 
   * @returns IViewTemplateModel array
   */
  export function getViews(): Wrapper < IViewTemplateModel > [] 
  {
    return viewImplementations;
  }

  /**
   * sets an interface object to the views template stack
   * 
   * @param ctor extended type of IViewTemplateModel
   * @returns IViewTemplateModel wrapper
   */
  export function set < T extends Wrapper < IViewTemplateModel >> (ctor: T) {
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
@IViewTemplates.set
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
@IViewTemplates.set
class GetExample {
  get(req: any) {
    return {
      person: req.query.index == undefined ? "No person index defined" : [{name: "Jannick Oste"}, {name: "Tom Bom"}][req.query.index],
      index: req.query.index == undefined ? -1 : Number.parseInt(req.query.index)
    }
  }

  post = undefined
} 

@IViewTemplates.set
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
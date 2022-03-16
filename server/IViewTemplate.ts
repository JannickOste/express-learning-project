/**
 * View data interface
 */
export interface IViewTemplate {
  getDataObject(request: any): object;
}

/**
 * Namespace containing IViewTemplates, used for registering views based on attributes.
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

/**
 * Implementation of IViewTemplate interface in class style. 
 * 
 */
@IViewTemplate.set
class Index {
  getDataObject(req: any) {
    console.dir(req.query);
    return {
      person: req.query.index
    }

  }
}
/**
 * Implementation of IViewTemplate interface in class style. 
 * 
 */
@IViewTemplate.set
class GetExample {
  getDataObject(req: any) {
    return {
      person: req.query.index == undefined ? "No person index defined" : [{name: "Jannick Oste"}, {name: "Tom Bom"}][req.query.index]
    }
  }
} 
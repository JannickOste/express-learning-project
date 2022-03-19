import { IViewTemplate } from './interfaces/IViewTemplate';

/**
 * Namespace containing IViewTemplate, used for registering views based on generic type attribute (T).
 * models must be made in IViewTemplates.ts otherwise they wont be detected, 
 * todo: look into universal solution..;
 */
export namespace ViewTemplates {
  type Wrapper < T > = {
    new(...args: any[]): T;

    readonly prototype: T;
  }

  const viewImplementations: Wrapper < IViewTemplate > [] = [];

  /**
   * Get all registered views using the set attribute 
   * 
   * @returns IViewTemplateModel array
   */
  export function getViews(): Wrapper < IViewTemplate > [] 
  {
    return viewImplementations;
  }

  /**
   * sets an interface object to the views template stack
   * 
   * @param ctor extended type of IViewTemplateModel
   * @returns IViewTemplateModel wrapper
   */
  export function set < T extends Wrapper < IViewTemplate >> (ctor: T) {
    viewImplementations.push(ctor);
    return ctor;
  }
}
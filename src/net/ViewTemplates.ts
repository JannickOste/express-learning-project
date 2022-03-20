/**  @module net  */

import path from 'path';
import { Globals } from '../misc/Globals';
import { Logger } from '../misc/Logger';
import {IViewTemplate}  from './interfaces/IViewTemplate';
import { WebServer } from './WebServer';

/**
 * 
 * psuedocode ViewTemplates namespace
 * - The code exports a function called getViews() which returns an array of all the registered views.
 * - The code then exports a function called set() that sets an interface object to the view template stack.
 * - The code is a wrapper around the IViewTemplate interface.
 * - It has a readonly prototype property which returns the view implementation object itself.
 * - The set function takes an instance of the extended type of IViewTemplateModel and pushes it onto the viewImplementations array.
 
 */
export namespace ViewTemplates {
  export type Wrapper < T > = {
    new(...args: any[]): T;

    readonly prototype: T;
  }

  const viewImplementations: Wrapper < IViewTemplate > [] = [];

  /**
   * Get all registered views using the set attribute 
   * 
   * @returns IViewTemplateModel array
   */
  export function getViewTypes(): Wrapper < IViewTemplate > [] 
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

  /**
   * Load all IViewTemplate extensions from src.net.views
   * @returns 
   * 
   * - The code starts by loading all the IViewTemplate extensions from src.net.views into the current namespace, and then iterates through each of them to see if it is a view that starts with "viewName".
   * - If so, it tries to import the file using await import (path.join(targetPath, interfaceFile)).
   * - If not, it logs an exception and continues on its way through the rest of the code.
   * - The outputViews are then pushed onto an array called outputViews which is returned as a promise in return outputViews;
   * - The code is a simple example of the getViewInterfaces() function.
   * - The getViewInterfaces() function returns a Promise that will return an IViewTemplate[] array.
   */
   export const loadViewInterfaces = async(): Promise<IViewTemplate[]> =>
   {
       Logger.logMessage("Loading interfaces into current namespace...");
       const targetPath: string = path.join(__dirname, "views");

       const viewInterfaces: string[] = Globals.fs.readdirSync(targetPath);
       const views: string[] =  WebServer.ejsViewNames.map(i => i.toLowerCase());
       const outputViews: IViewTemplate[] = [];
       for(let interfaceFile of viewInterfaces)
       {
           if(views.filter(viewName => interfaceFile.toLowerCase().startsWith(viewName)).length == 1)
           {
               try
               {
                   const f: IViewTemplate = await import (path.join(targetPath, interfaceFile));
                   outputViews.push(f);
               }
               catch(ex)
               {
                   if(ex instanceof Error)
                       Logger.logMessage(ex.message);
               }
           }
       }

       return outputViews;
   }
}
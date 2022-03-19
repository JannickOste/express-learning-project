
//#region Page objects

import { NextFunction } from "express";
import { IWebResponse } from "../interfaces/IWebResponse";
import { ViewTemplates } from "../ViewTemplates";

/**
 * Implementation of src.net.interfaces.IViewTemplate interface in class style. 
 */
@ViewTemplates.set
export class Index {
   get(req: Request, res: Response, next: NextFunction): IWebResponse  {
     return {data:{}}
   }
 
   post = undefined;
 }
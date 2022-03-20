/**
 * @module net.views
 */
import { NextFunction } from "express";
import {IViewTemplate} from "../interfaces/IViewTemplate";
import { IWebResponse } from "../interfaces/IWebResponse";
import { ViewTemplates } from "../ViewTemplates";

/** Callback interface based on IViewTemplate for endpoint: /. */
@ViewTemplates.set
export class Index implements IViewTemplate {
   get(req: Request, res: Response, next: NextFunction): IWebResponse  {
     return {data:{}}
   }
 
   post = undefined;
 }
 
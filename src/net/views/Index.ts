/**
 * @module net.views
 */
import { NextFunction } from "express";
import {IViewTemplate} from "../interfaces/IViewTemplate";
import { IWebResponse } from "../interfaces/IWebResponse";

export const Index: IViewTemplate = {
  get(req: Request, res: Response, next: NextFunction): IWebResponse  {
    return {data:{}}
  },

  post: undefined
}

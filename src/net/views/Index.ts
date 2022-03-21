/**
 * @module net.views
 */
import { NextFunction } from "express";
import {IViewTemplate} from "../interfaces/IViewTemplate";
import { IWebResponse } from "../interfaces/IWebResponse";

export const Index: IViewTemplate = {
  get(req, res, next): IWebResponse  {
    return {data:{}}
  },

  post: undefined
}

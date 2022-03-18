import { Response, Request, NextFunction } from "express"; 
import { IWebResponse } from './IWebResponse';

/**
 * Custom express-js request callback interface
 * @param res Server response data.
 * @param req Client request data.
 * @param next next callback set for X request
 */
export interface IWebRequest
{
    /**
     */
    (res: Response, req: Request, next: NextFunction): IWebResponse;
}
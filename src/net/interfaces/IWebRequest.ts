import { Response, Request, NextFunction } from "express"; 
import { IWebResponse } from './IWebResponse';

/**
 * Custom express-js request callback interface
 * 
 * @author Oste Jannick
 * @created 2022/03/17
 */
export interface IWebRequest
{
    (res: Response, req: Request, next: NextFunction): IWebResponse;
}
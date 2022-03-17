import { Response, Request, NextFunction } from "express"; 
import { IWebResponse } from './IWebResponse';


export interface IWebRequest
{
    (res: Response, req: Request, next: NextFunction): IWebResponse;
}
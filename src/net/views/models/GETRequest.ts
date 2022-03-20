import { ViewTemplates } from "../../ViewTemplates";
import IViewTemplate from '../../interfaces/IViewTemplate';
import  IWebResponse  from '../../interfaces/IWebResponse';
import { NextFunction } from 'express';

@ViewTemplates.set
export class GETRequest implements IViewTemplate
{
    post= undefined;
    get(req: Request, res: Response, next: NextFunction) {return {data: {}} as IWebResponse};    
}
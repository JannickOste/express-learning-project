import { NextFunction } from "express";
import { IWebResponse } from '../interfaces/IWebResponse';
import { ViewTemplates } from "../ViewTemplates";
import { IViewTemplate } from '../interfaces/IViewTemplate';

/**
 * Callback interface based on IWebRequest for endpoint: getExample.
 */
@ViewTemplates.set
export class GetExample implements IViewTemplate
{
  get(req: Request, res: Response, next: NextFunction): IWebResponse 
  {
    const index: number = Number.parseInt(`${(req as any).query.index}`);
    const response: IWebResponse = {
      data:
      {
        person: isNaN(index) ? "No person index defined" : [{name: "Jannick Oste"}, {name: "Tom Bom"}][index],
        index: isNaN(index) ? -1 : index
      }
    }

    return response;
  }

  post = undefined
}

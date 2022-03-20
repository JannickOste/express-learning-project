import { NextFunction } from "express";
import IWebResponse  from '../interfaces/IWebResponse';
import { GETRequest} from "./models/GETRequest"

/**
 * Callback interface based on IWebRequest for endpoint: getExample
 */
export class GetExample extends GETRequest
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
}

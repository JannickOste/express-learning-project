import { NextFunction } from "express";
import { IWebResponse } from '../interfaces/IWebResponse';
import { ViewTemplates } from "../ViewTemplates";

@ViewTemplates.set
export class GetExample
{
  get = (req: Request, res: Response, next: NextFunction): IWebResponse => {
    const index: number = Number.parseInt(`${(req as any).query.index}`);

    return {
        data: {
            person: isNaN(index) ? "No person index defined" : [{name: "Jannick Oste"}, {name: "Tom Bom"}][index],
            index: isNaN(index) ? -1 : index
        }
    }
  };

  post =  undefined
} 

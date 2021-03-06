
/**  @module net.views */

import { IWebResponse } from "../interfaces/IWebResponse";
import { IViewTemplate } from '../interfaces/IViewTemplate';

/**   Callback interface based on IWebRequest for endpoint: /getExample */
export const GetExample: IViewTemplate =
{
  get: (req, res, next): IWebResponse =>
  {
    const index: number = Number.parseInt(`${(req as any).query.index}`);
    return {
      data:
      {
        person: isNaN(index) ? "No person index defined" : [{name: "Jannick Oste"}, {name: "Tom Bom"}][index],
        index: isNaN(index) ? -1 : index
      }
    }
  },

  post: undefined
}

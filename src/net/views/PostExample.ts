/**
 * @module net.views
 */

import {IViewTemplate} from "../interfaces/IViewTemplate";
import { IWebResponse } from "../interfaces/IWebResponse";

/**  Callback interface based on IWebRequest for endpoint: postExample. */
export const PostExample: IViewTemplate =
{
  get(req, res, next): IWebResponse 
  {
    const response: IWebResponse = {
      data:
      {
        message: undefined
      }
    }

    return response;
  },

  post(req, res, next): IWebResponse
  {
    const response: IWebResponse = {
      data:
      {
        message: `<h2>Welcome, ${((req as any).body as any).fname}</h2>`
      }
    }

    return response;
  }
}
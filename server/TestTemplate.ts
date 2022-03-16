import { IViewTemplate } from "./IViewTemplate";

/**
 * Implementation of IViewTemplate interface in class style. 
 * 
 */
 @IViewTemplate.set
 export class TestTemplate {
     getDataObject() { 
          return {person: "hello world"}
    }
 }
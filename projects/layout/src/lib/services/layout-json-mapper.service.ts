import { Inject, Injectable, Optional } from '@angular/core';
import { FlexyLayoutComponentSchema, FlexyLayoutSchema } from '../model/layout-schema.model';
import { FlexyLayoutComponentMap } from '../model/component-map.model';
import {
  FlexyLayoutComponentJsonSchema,
  FlexyLayoutJson,
  FlexyLayoutJsonSchema
} from '../model/layout-json-schema.model';
import { parseFormJson } from './layout-json-mapper.utils';
import { FLEXY_COMPONENTS_MAP } from '../layout-options.token';

@Injectable({
  providedIn: "root"
})
export class FlexyLayoutJsonMapperService {
  get supportedComponents(): string[] {
    return Object.keys(this.componentMap);
  }

  constructor(@Optional() @Inject(FLEXY_COMPONENTS_MAP) private componentMap: FlexyLayoutComponentMap) {
  }

  parse(json: FlexyLayoutJson): FlexyLayoutSchema[] {
    return this.map(parseFormJson(json));
  }

  assignMap(map: FlexyLayoutComponentMap) {
    if (map) {
      Object.assign(this.componentMap, map);
    }
  }

  map(json: FlexyLayoutJsonSchema[], parentSchema: FlexyLayoutSchema = null): FlexyLayoutSchema[] {
    console.log({xx: this.componentMap})
    const schema: FlexyLayoutSchema[] = [];
    if (json) {
      json.forEach((jsonItem, index) => {
        const schemaItem: FlexyLayoutSchema = this.mapItem(jsonItem, '' + index, parentSchema);
        if (jsonItem.children) {
          schemaItem.children = this.map(jsonItem.children);
        }
        schema.push(schemaItem);
      });
    }

    return schema;
  }

  mapItem(jsonItem: FlexyLayoutJsonSchema, id = '', parent: FlexyLayoutSchema = null): FlexyLayoutSchema {
    const schemaItem: FlexyLayoutSchema = {
      attributes: jsonItem.attributes
    };
    if ((jsonItem as FlexyLayoutComponentJsonSchema).component) {
      const componentJsonItem = jsonItem as FlexyLayoutComponentJsonSchema;
      if (this.componentMap && this.componentMap[componentJsonItem.component]) {
        (schemaItem as FlexyLayoutComponentSchema).componentType = this.componentMap[componentJsonItem.component];
        (schemaItem as FlexyLayoutComponentSchema).componentName = componentJsonItem.component;
        (schemaItem as FlexyLayoutComponentSchema).componentId = componentJsonItem.id;
        (schemaItem as FlexyLayoutComponentSchema).componentInputs = componentJsonItem.properties ? componentJsonItem.properties : {};
      } else {
        console.error(`Component ${componentJsonItem.component} can't be mapped`);
      }
    }

    schemaItem.id = (parent && parent.id ? parent.id + '/' : '') + '' + (id ? id : Date.now());
    schemaItem.parent = parent;

    return schemaItem;
  }
}

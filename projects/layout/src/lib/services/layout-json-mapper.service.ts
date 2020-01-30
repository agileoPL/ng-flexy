import { Inject, Injectable } from '@angular/core';
import { FlexyLayoutComponentSchema, FlexyLayoutSchema } from '../model/layout-schema.model';
import { FlexyLayoutComponentMap } from '../model/component-map.model';
import { FlexyLayoutComponentJsonSchema, FlexyLayoutJson, FlexyLayoutJsonSchema } from '../model/layout-json-schema.model';
import { FLEXY_LAYOUT_COMPONENT_MAP } from './component-map.service';
import { parseFormJson } from './layout-json-mapper.utils';

// TODO its from flexy form
const SCHEMA_GROUP_KEY = 'groupKey';
const SCHEMA_IF = 'if';
const SCHEMA_CALC = 'calc';

@Injectable()
export class FlexyLayoutJsonMapperService {
  private componentsMap: FlexyLayoutComponentMap = {};

  constructor(@Inject(FLEXY_LAYOUT_COMPONENT_MAP) componentMap) {
    if (componentMap && componentMap.length) {
      componentMap
        .reduce((a, b) => a.concat(b), [])
        .forEach(map => {
          Object.assign(this.componentsMap, map);
        });
    }
  }

  parse(json: FlexyLayoutJson): FlexyLayoutSchema[] {
    return this.map(parseFormJson(json));
  }

  assignMap(map: FlexyLayoutComponentMap) {
    if (map) {
      Object.assign(this.componentsMap, map);
    }
  }

  map(json: FlexyLayoutJsonSchema[], parentSchema: FlexyLayoutSchema = null): FlexyLayoutSchema[] {
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
      // type: jsonItem.type,
      cssClass: jsonItem.cssClass
    };
    if ((jsonItem as FlexyLayoutComponentJsonSchema).component) {
      const componentJsonItem = jsonItem as FlexyLayoutComponentJsonSchema;
      if (this.componentsMap && this.componentsMap[componentJsonItem.component]) {
        (schemaItem as FlexyLayoutComponentSchema).componentType = this.componentsMap[componentJsonItem.component];
        (schemaItem as FlexyLayoutComponentSchema).componentName = componentJsonItem.component;
        (schemaItem as FlexyLayoutComponentSchema).componentId = componentJsonItem.id;
        (schemaItem as FlexyLayoutComponentSchema).componentInputs = componentJsonItem.properties ? componentJsonItem.properties : {};
      } else {
        console.error(`Component ${componentJsonItem.component} can't be mapped`);
      }
    }

    // TODO tothink is problem with populate form group controls from external domain
    [SCHEMA_GROUP_KEY, SCHEMA_IF, SCHEMA_CALC].forEach(key => {
      if (jsonItem[key]) {
        schemaItem[key] = jsonItem[key];
      }
    });

    schemaItem.id = (parent && parent.id ? parent.id + '/' : '') + '' + (id ? id : Date.now());
    schemaItem.parent = parent;

    return schemaItem;
  }
}

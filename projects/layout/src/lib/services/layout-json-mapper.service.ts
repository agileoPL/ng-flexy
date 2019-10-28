import { Inject, Injectable } from '@angular/core';
import { FlexyLayoutComponentSchema, FlexyLayoutSchema } from '../model/layout-schema.model';
import { FlexyLayoutComponentMap } from '../model/component-map.model';
import { FlexyLayoutComponentJsonSchema, FlexyLayoutJsonSchema } from '../model/layout-json-schema.model';
import { FLEXY_LAYOUT_COMPONENT_MAP } from './component-map.service';

const SCHEMA_GROUP_KEY = 'groupKey';

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
    if (!jsonItem.properties) {
      jsonItem.properties = {};
    }
    const schemaItem: FlexyLayoutSchema = {
      type: jsonItem.type,
      properties: { ...jsonItem.properties }
    };
    if ((jsonItem as FlexyLayoutComponentJsonSchema).component) {
      const componentJsonItem = jsonItem as FlexyLayoutComponentJsonSchema;
      if (this.componentsMap && this.componentsMap[componentJsonItem.component]) {
        schemaItem.type = 'component';
        (schemaItem as FlexyLayoutComponentSchema).componentType = this.componentsMap[componentJsonItem.component];
        (schemaItem as FlexyLayoutComponentSchema).componentName = componentJsonItem.component;
        (schemaItem as FlexyLayoutComponentSchema).componentId = componentJsonItem.componentId;
        (schemaItem as FlexyLayoutComponentSchema).componentInputs = componentJsonItem.componentInputs
          ? componentJsonItem.componentInputs
          : {};

        // TODO tothink is problem with populate form group controls from external domain
        if (componentJsonItem.groupKey) {
          schemaItem[SCHEMA_GROUP_KEY] = componentJsonItem.groupKey;
        }
      } else {
        console.error(`Component ${componentJsonItem.component} can't be mapped`);
      }
    }

    schemaItem.id = (parent && parent.id ? parent.id + '/' : '') + '' + (id ? id : Date.now());
    schemaItem.parent = parent;

    return schemaItem;
  }
}

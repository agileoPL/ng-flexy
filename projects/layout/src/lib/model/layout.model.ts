import { FlexyLayoutComponentSchema, FlexyLayoutSchema } from './layout-schema.model';

export class FlexyLayout {
  private readonly schema: FlexyLayoutSchema[];

  constructor(schema) {
    this.schema = schema;
  }

  containsComponent(id: string): boolean {
    return !!this.findComponent(this.schema, id);
  }
  getComponentSchema(id: string): FlexyLayoutComponentSchema {
    return this.findComponent(this.schema, id);
  }
  getComponentInstance<T>(id: string): T {
    const fSchema: FlexyLayoutComponentSchema = this.findComponent(this.schema, id);
    if (fSchema && fSchema.componentRef) {
      return fSchema.componentRef.instance;
    }
    return null;
  }

  private findComponent(schema: FlexyLayoutSchema[], id: string): FlexyLayoutComponentSchema {
    for (const item of schema) {
      if ((item as FlexyLayoutComponentSchema).componentId && (item as FlexyLayoutComponentSchema).componentId === id) {
        return item as FlexyLayoutComponentSchema;
      } else if (item.children) {
        const comp = this.findComponent(item.children, id);
        if (comp) {
          return comp;
        }
      }
    }
    return null;
  }
}

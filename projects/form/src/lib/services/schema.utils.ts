import { FlexyFormFieldLayoutSchema, FlexyFormLayoutSchema } from '../models/layout-schema.model';
import { FormGroup } from '@angular/forms';
import { FlexyForm } from '../models/form.model';
import { get } from 'lodash';

function getSchemaData(schema: FlexyFormLayoutSchema) {
  const fg = new FormGroup({});
  const ff = new FlexyForm(fg, [schema], {});
  const allData = ff.getAllData();
  if ((schema as FlexyFormFieldLayoutSchema).formName) {
    return get(allData, (schema as FlexyFormFieldLayoutSchema).formName);
  } else {
    return allData;
  }
}

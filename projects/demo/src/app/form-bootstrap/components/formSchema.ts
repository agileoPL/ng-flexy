import { FlexyFormFieldType, FlexyFormLayoutJson, FlexyFormLayoutJsonSchema } from '@ng-flexy/form';

function tempControl(index) {
  return {
    component: 'number',
    name: `.temp${index}`,
    properties: {
      label: `Temperature: Patty ${index}`,
      placeholder: '--.-',
      description: 'Limits t &#8805 70.0 &#176 C and t &#8804 77.0 &#176 C'
    },
    validators: {
      required: true
    }
  };
}

export const TEMP_CONTROLS_JSON1: FlexyFormLayoutJsonSchema[] = [tempControl(1)];

export const TEMP_CONTROLS_JSON2: FlexyFormLayoutJsonSchema[] = [tempControl(1), tempControl(2)];

export const TEMP_CONTROLS_JSON3: FlexyFormLayoutJsonSchema[] = [tempControl(1), tempControl(2), tempControl(3)];

export const TEMP_CONTROLS_JSON4: FlexyFormLayoutJsonSchema[] = [tempControl(1), tempControl(2), tempControl(3), tempControl(4)];

const GRILL = {
  name: 'grill',
  component: 'radiolist',
  properties: {
    label: 'Select Grill',
    options: [
      {
        value: 1,
        text: 'Grill 1'
      },
      {
        value: 2,
        text: 'Grill 2'
      },
      {
        value: 3,
        text: 'Grill 3'
      },
      {
        value: 4,
        text: 'Breakfast'
      }
    ]
  },
  validators: {
    required: true
  }
};

const PLATT = {
  name: 'platt',
  component: 'radiolist',
  properties: {
    label: 'Select Platt',
    options: [
      {
        value: 1,
        text: 'Left'
      },
      {
        value: 2,
        text: 'Middle'
      },
      {
        value: 3,
        text: 'Right'
      }
    ]
  },
  validators: {
    required: true
  }
};

const COOKING_TIME = {
  name: 'cookingtime',
  component: 'number',
  properties: {
    label: 'Cooking time (seconds)',
    description: 'Example: 14'
  },
  validators: {
    required: true
  }
};

const PRODUCT = {
  name: 'product',
  component: 'radiolist',
  properties: {
    label: 'Select Product',
    options: [
      {
        value: 1,
        text: '10:1'
      },
      {
        value: 2,
        text: '4:1'
      },
      {
        value: 3,
        text: '3:1'
      }
    ]
  },
  validators: {
    required: true
  }
};

const RUNSIZE = [
  {
    if: 'product = 1',
    children: [
      {
        name: 'runsize.r1',
        component: 'radiolist',
        properties: {
          label: 'Select run size',
          options: [
            {
              value: 1,
              text: '1'
            },
            {
              value: 2,
              text: '2'
            },
            {
              value: 3,
              text: '3'
            },
            {
              value: 4,
              text: '4'
            }
          ]
        }
      }
    ]
  },
  {
    if: 'product = 2',
    children: [
      {
        name: 'runsize.r2',
        component: 'radiolist',
        properties: {
          label: 'Select run size',
          options: [
            {
              value: 1,
              text: '1'
            },
            {
              value: 2,
              text: '2'
            }
          ]
        }
      }
    ]
  },
  {
    if: 'product = 3',
    children: [
      {
        name: 'runsize.r3',
        component: 'radiolist',
        properties: {
          label: 'Select run size',
          options: [
            {
              value: 1,
              text: '1'
            }
          ]
        }
      }
    ]
  }
];

const TEST_SUCESS = {
  component: 'disclaimer',
  name: 'test_replay',
  properties: {
    label: `Quality Test Success!`,
    text: 'You can go back and test another product',
    singleChoice: true,
    choiceLabel: 'OK'
  },
  validators: {
    required: true
  }
};

const TEST_FAIL = {
  component: 'disclaimer',
  name: 'test_fail.acknowledge',
  properties: {
    label: `Quality Test Fail!`,
    text: 'Please go through the Procedure, Product and Equipment check',
    singleChoice: true
  },
  validators: {
    required: true
  }
};

const TEST_FAIL_PROCEDURES = {
  component: 'fieldset',
  children: [
    {
      component: 'disclaimer',
      name: 'test_fail.procedures_confirm',
      properties: {
        label: `Procedure All`,
        text: `- Product is being laid and removed in the proper sequence <br>
                 - Lower platens are being scraped properly after each run <br>
                 - Release sheets are being squeegeed between every run and wiped off with grill cloth a least four time every hour`
      },
      validators: {
        required: true
      }
    }
  ]
};

const TEST_FAIL_PRODUCT_ALL = {
  component: 'fieldset',
  children: [
    {
      component: 'disclaimer',
      name: 'test_fail.product_all',
      properties: {
        label: `Procedure All`,
        text: `- Product is used within code <br>
                 - Product is frozen solidly and shows no signs of thrawing. Beef patties should break cleanly in half <br>
                 - Frozen Beef patties separate easily and are free od excessive ice crystals`
      },
      validators: {
        required: true
      }
    }
  ]
};

const TEST_FAIL_PRODUCT_QUESTIONS = {
  component: 'fieldset',
  children: [
    {
      component: 'disclaimer',
      name: 'test_fail.product_code',
      properties: {
        label: `Product is used withing code`
      },
      validators: {
        required: true
      }
    },
    {
      if: 'test_fail.product_code = false',
      children: [
        {
          component: 'textarea',
          name: 'test_fail.product_code_notes',
          properties: {
            label: `Note`
          },
          validators: {
            required: true
          }
        }
      ]
    },
    {
      component: 'disclaimer',
      name: 'test_fail.product_frozen',
      properties: {
        label: `Product is frozen solidly and shows no signs of thrawing. Beef patties should break cleanly in half`
      },
      validators: {
        required: true
      }
    },
    {
      if: 'test_fail.product_frozen = false',
      children: [
        {
          component: 'textarea',
          name: 'test_fail.product_frozen_notes',
          properties: {
            label: `Note`
          },
          validators: {
            required: true
          }
        }
      ]
    },
    {
      component: 'disclaimer',
      name: 'test_fail.product_separate',
      properties: {
        label: `Frozen Beef patties separate easily and are free od excessive ice crystals`
      },
      validators: {
        required: true
      }
    },
    {
      if: 'test_fail.product_separate = false',
      children: [
        {
          component: 'textarea',
          name: 'test_fail.product_separate_notes',
          properties: {
            label: `Note`
          },
          validators: {
            required: true
          }
        }
      ]
    }
  ]
};

const LIST_STATUS = {
  name: 'checklist_success',
  component: 'hidden',
  calc: 'checklist_success1 or checklist_success2 or checklist_success3 or checklist_success4'
};

const LIST_STATUS1 = {
  name: 'checklist_success1',
  component: 'hidden',
  calc:
    // tslint:disable-next-line
    '$count($filter($map($keys(temperature1), function($item) { $lookup(temperature1, $item) }), function($item) { $item >= 70 and $item <= 77 } )) = 1'
};

const LIST_STATUS2 = {
  name: 'checklist_success2',
  component: 'hidden',
  calc:
    // tslint:disable-next-line
    '$count($filter($map($keys(temperature2), function($item) { $lookup(temperature2, $item) }), function($item) { $item >= 70 and $item <= 77 } )) >= 1'
};

const LIST_STATUS3 = {
  name: 'checklist_success3',
  component: 'hidden',
  calc:
    // tslint:disable-next-line
    '$count($filter($map($keys(temperature3), function($item) { $lookup(temperature3, $item) }), function($item) { $item >= 70 and $item <= 77 } )) >= 2'
};

const LIST_STATUS4 = {
  name: 'checklist_success4',
  component: 'hidden',
  calc:
    // tslint:disable-next-line
    '$count($filter($map($keys(temperature4), function($item) { $lookup(temperature4, $item) }), function($item) { $item >= 70 and $item <= 77 } )) >= 3'
};

export const FORM_JSON: FlexyFormLayoutJson = {
  schema: [
    {
      component: 'wizard',
      children: [
        {
          component: 'fieldset',
          children: [LIST_STATUS, GRILL, PLATT, PRODUCT, COOKING_TIME, ...RUNSIZE]
        },
        {
          if: 'runsize.r1 = 1 or runsize.r2 = 1 or runsize.r3 = 1',
          children: [
            {
              component: 'fieldset',
              name: `temperature1`,
              type: FlexyFormFieldType.Group,
              children: TEMP_CONTROLS_JSON1
            },
            LIST_STATUS1
          ]
        },
        {
          if: 'runsize.r1 = 2 or runsize.r2 = 2',
          children: [
            {
              component: 'fieldset',
              name: `temperature2`,
              type: FlexyFormFieldType.Group,
              children: TEMP_CONTROLS_JSON2
            },
            LIST_STATUS2
          ]
        },
        {
          if: 'runsize.r1 = 3',
          children: [
            {
              component: 'fieldset',
              name: `temperature3`,
              type: FlexyFormFieldType.Group,
              children: TEMP_CONTROLS_JSON3
            },
            LIST_STATUS3
          ]
        },
        {
          if: 'runsize.r1 = 4',
          children: [
            {
              component: 'fieldset',
              name: `temperature4`,
              type: FlexyFormFieldType.Group,
              children: TEMP_CONTROLS_JSON4
            },
            LIST_STATUS4
          ]
        },
        {
          if: 'checklist_success = true',
          children: [
            {
              component: 'fieldset',
              children: [TEST_SUCESS]
            }
          ]
        },
        {
          if: 'checklist_success = false',
          children: [
            {
              component: 'fieldset',
              children: [TEST_FAIL]
            }
          ]
        },
        {
          if: 'checklist_success = false',
          children: [TEST_FAIL_PROCEDURES]
        },
        {
          if: 'checklist_success = false',
          children: [TEST_FAIL_PRODUCT_ALL]
        },
        {
          if: 'checklist_success = false',
          children: [TEST_FAIL_PRODUCT_QUESTIONS]
        }
      ]
    }
  ]
};

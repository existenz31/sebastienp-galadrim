const { collection } = require('forest-express-sequelize');
const { product, label } = require('../models');

collection('registration', {
  actions: [{
    name: 'Change Label',
    type: 'single',
    endpoint: '/forest/actions/registration/change-label',
    fields: [
      {
        field: 'Label',
        type: 'Enum',
        enums: []
      },
    ],    
    hooks: {
      load: async ({ fields, record }) => {
        const availableProducts = await getLabelsForProductId(record.product.id);
        fields.Label.enums = availableProducts.map(l => buildLabelEnum(l));
        fields.Label.value = buildLabelEnum(record.label); 
        return fields;
      },
    },

  }],
  fields: [],
  segments: [],
});

function buildLabelEnum(_label) {
  if (!_label) return null;
  return _label.name + ' (#' + _label.id + ')'
}

function getLabelsForProductId (productId) {
  return label.findAll({
    include: { 
      model: product, 
      as: 'availableProducts',
      where: {id: productId}
    }
  })
}

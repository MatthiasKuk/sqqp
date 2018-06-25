/* eslint-env jest */

const sqqp = require('./index');

const options = {
  delimiters: {
    operator: ':',
    value: '=',
    queryParams: {
      delimiter: ',',
      boundaries: ['[', ']']
    }
  },
  express: false,
  orderId: 'order',
  limitId: 'limit'
};

const optionsVariant = JSON.parse(JSON.stringify(options));
optionsVariant.delimiters.operator = ';';
optionsVariant.delimiters.value = '+';
optionsVariant.delimiters.queryParams.delimiter = '.';
optionsVariant.delimiters.queryParams.boundaries = ['(', ')'];

const tests = {
  express: [
    {
      desc: 'where key',
      expect: sqqp.parse({ 'name:eq': 'foo' }),
      toEqual: { where: { name: { eq: 'foo' } } }
    },
    {
      desc: 'where key (multiple filters)',
      expect: sqqp.parse({ 'id:or': '[1,2]' }),
      toEqual: { where: { id: { or: ['1', '2'] } } }
    },
    {
      desc: 'where key (multiple params, multiple filters)',
      expect: sqqp.parse({ 'id:or': '[1,2]', 'name:eq': 'foo' }),
      toEqual: { where: { id: { or: ['1', '2'] }, name: { eq: 'foo' } } }
    },
    {
      desc: 'where, order key (multiple params, multiple filters)',
      expect: sqqp.parse({ 'id:or': '[1,2]', 'name:eq': 'foo', 'date:order': 'asc' }),
      toEqual: { where: { id: { or: ['1', '2'] }, name: { eq: 'foo' } }, order: [['date', 'asc']] }
    },
    {
      desc: 'where, order key (multiple params, multiple filters, multiple orders)',
      expect: sqqp.parse({
        'id:or': '[1,2]', 'name:eq': 'foo', 'date:order': 'asc', 'place:order': 'desc'
      }),
      toEqual: { where: { id: { or: ['1', '2'] }, name: { eq: 'foo' } }, order: [['date', 'asc'], ['place', 'desc']] }
    },
    {
      desc: 'where, order, limit key (multiple params, multiple filters, multiple orders, limit)',
      expect: sqqp.parse({
        'id:or': '[1,2]', 'name:eq': 'foo', 'date:order': 'asc', 'place:order': 'desc', limit: 10
      }),
      toEqual: { where: { id: { or: ['1', '2'] }, name: { eq: 'foo' } }, order: [['date', 'asc'], ['place', 'desc']], limit: 10 }
    }
  ],
  custom: [
    {
      desc: 'where key',
      expect: sqqp.parse('name:eq=foo', options),
      toEqual: { where: { name: { eq: 'foo' } } }
    },
    {
      desc: 'where key (multiple filters)',
      expect: sqqp.parse('id:or=[1,2]', options),
      toEqual: { where: { id: { or: ['1', '2'] } } }
    },
    {
      desc: 'where key (multiple params, multiple filters)',
      expect: sqqp.parse('id:or=[1,2]&name:eq=foo', options),
      toEqual: { where: { id: { or: ['1', '2'] }, name: { eq: 'foo' } } }
    },
    {
      desc: 'where, order key (multiple params, multiple filters)',
      expect: sqqp.parse('id:or=[1,2]&name:eq=foo&date:order=asc', options),
      toEqual: { where: { id: { or: ['1', '2'] }, name: { eq: 'foo' } }, order: [['date', 'asc']] }
    },
    {
      desc: 'where, order key (multiple params, multiple filters, multiple orders)',
      expect: sqqp.parse('id:or=[1,2]&name:eq=foo&date:order=asc&place:order=desc', options),
      toEqual: { where: { id: { or: ['1', '2'] }, name: { eq: 'foo' } }, order: [['date', 'asc'], ['place', 'desc']] }
    },
    {
      desc: 'where, order, limit key (multiple params, multiple filters, multiple orders, limit)',
      expect: sqqp.parse('id:or=[1,2]&name:eq=foo&date:order=asc&place:order=desc&limit=10', options),
      toEqual: { where: { id: { or: ['1', '2'] }, name: { eq: 'foo' } }, order: [['date', 'asc'], ['place', 'desc']], limit: 10 }
    },
    {
      desc: 'where, order, limit key (multiple params, multiple filters, multiple orders, limit) (optionsVariant)',
      expect: sqqp.parse('id;or+(1.2)&name;eq+foo&date;order+asc&place;order+desc&limit+10', optionsVariant),
      toEqual: { where: { id: { or: ['1', '2'] }, name: { eq: 'foo' } }, order: [['date', 'asc'], ['place', 'desc']], limit: 10 }
    }
  ]
};

tests.express.forEach((e) => {
  test(e.desc, () => {
    expect(e.expect).toEqual(e.toEqual);
  });
});

tests.custom.forEach((e) => {
  test(e.desc, () => {
    expect(e.expect).toEqual(e.toEqual);
  });
});

const functions = require('./index');

const options = {
  delimiters: {
    operator: ':',
    value: '=',
    queryParams: {
      delimiter: ',',
      boundaries: ['[', ']']
    }
  },
  express: false
};

const optionsVariant = JSON.parse(JSON.stringify(options));
optionsVariant.delimiters.operator = ';';
optionsVariant.delimiters.value = '+';
optionsVariant.delimiters.queryParams.delimiter = '.';
optionsVariant.delimiters.queryParams.boundaries = ['(', ')'];

// Assuming query parameters are provided by express.js via req.query
test("Should result in query-key 'id', operator 'eq' and filter '1'", () => {
  expect(functions.parse({ 'id:eq': '1' })).toEqual({ id: { eq: '1' } });
});

test("Should result in query-key 'name', operator 'eq' and filter 'foo'", () => {
  expect(functions.parse({ 'name:eq': 'foo' })).toEqual({ name: { eq: 'foo' } });
});

test("Should result in query-key 'id', operator 'or' and filter '1,2'", () => {
  expect(functions.parse({ 'id:or': '[1,2]' })).toEqual({ id: { or: ['1', '2'] } });
});

test("Should result in query-keys 'id', 'name', operators 'or', 'eq' and filters '1,2', 'foo'", () => {
  expect(functions.parse({ 'id:or': '[1,2]', 'name:eq': 'foo' })).toEqual({ id: { or: ['1', '2'] }, name: { eq: 'foo' } });
});

// Assuming query parameters are provided unparsed
test("Should result in query-key 'id', operator 'eq' and filter '1'", () => {
  expect(functions.parse('id:eq=1', options)).toEqual({ id: { eq: '1' } });
});

test("Should result in query-key 'name', operator 'eq' and filter 'foo'", () => {
  expect(functions.parse('name:eq=foo', options)).toEqual({ name: { eq: 'foo' } });
});

test("Should result in query-key 'id', operator 'or' and filter '1,2'", () => {
  expect(functions.parse('id:or=[1,2]', options)).toEqual({ id: { or: ['1', '2'] } });
});

test("Should result in query-keys 'id', 'name', operators 'or', 'eq' and filters '1,2', 'foo'", () => {
  expect(functions.parse('id:or=[1,2]&name:eq=foo', options)).toEqual({ id: { or: ['1', '2'] }, name: { eq: 'foo' } });
});

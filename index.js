/**
 * @desc
 * Parses the provided parameters into objects, which correspond to the Sequelize filtering-guidelines ('where').
 * @param {string} query
 * Represents the query.
 * @param {object} options
 * Represents an object which allows for customization of the query.
 * If no options object is provided, a default options object is created and used.
 * @return {object}
 */

function parseQueryUnit(operator, filterValues, options) {
  if ((filterValues[0] === options.delimiters.queryParams.boundaries[0])
  && (filterValues[filterValues.length - 1] === options.delimiters.queryParams.boundaries[1])) {
    return filterValues
      .substring(1, filterValues.length - 1)
      .split(options.delimiters.queryParams.delimiter);
  }
  return filterValues;
}

module.exports = {
  parse: (query, options) => {
    if (!options) {
      options = {
        delimiters: {
          operator: ':',
          value: '=',
          queryParams: {
            delimiter: ',',
            boundaries: ['[', ']']
          }
        },
        express: true
      };
    }
    const parsedQuery = {};
    if (!options.express) {
      query.split('&')
        .map(queryUnit => queryUnit.split(options.delimiters.operator))
        .map(queryUnitParams => queryUnitParams.map(queryUnitParam => queryUnitParam.split(options.delimiters.value)))
        .forEach((queryUnitParam) => {
          const parsedQueryUnit = {};
          const operator = queryUnitParam[1][0];
          parsedQueryUnit[operator] = parseQueryUnit(operator, queryUnitParam[1][1], options);
          parsedQuery[queryUnitParam[0]] = parsedQueryUnit;
        });
    } else {
      Object.keys(query).forEach((queryUnitParam) => {
        const parsedQueryUnit = {};
        const operator = queryUnitParam.split(':')[1];
        parsedQueryUnit[operator] = parseQueryUnit(operator, query[queryUnitParam], options);
        parsedQuery[queryUnitParam.split(options.delimiters.operator)[0]] = parsedQueryUnit;
      });
    }
    return parsedQuery;
  }
};

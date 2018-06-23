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

function splitMultipleFilterValues(queryUnitProps, operator, filterValues, delimiter) {
  queryUnitProps[operator] = filterValues
    .substring(1, filterValues.length - 1)
    .split(delimiter);
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
            boundaries: [ '[',']' ]
          }
        },
        express: true
      }
    }

    const parsedQuery = {};
    if (!options.express) {
      query.split('&')
        .map(queryUnit => queryUnit.split(options.delimiters.operator))
        .map(queryUnitParams => queryUnitParams.map(queryUnitParam => queryUnitParam.split(options.delimiters.value)))
        .forEach(queryUnitParam => {
          const parsedQueryUnit = {};
          const operator = queryUnitParam[1][0];
          const filterValues = queryUnitParam[1][1];
          if ((filterValues[0] === options.delimiters.queryParams.boundaries[0]) &&
            (filterValues[filterValues.length - 1] === options.delimiters.queryParams.boundaries[1])) {
              splitMultipleFilterValues(parsedQueryUnit, operator, filterValues, options.delimiters.queryParams.delimiter);
            } else {
              parsedQueryUnit[queryUnitParam[1][0]] = queryUnitParam[1][1];
            }
            parsedQuery[queryUnitParam[0]] = parsedQueryUnit;
        })
    } else {
      for (const queryUnitParam in query) {
        const parsedQueryUnit = {};
        const operator = queryUnitParam.split(':')[1];
        const filterValues = query[queryUnitParam];
        if ((filterValues[0] === options.delimiters.queryParams.boundaries[0]) &&
          (filterValues[filterValues.length - 1] === options.delimiters.queryParams.boundaries[1])) {
            splitMultipleFilterValues(parsedQueryUnit, operator, filterValues, options.delimiters.queryParams.delimiter);
          } else {
            parsedQueryUnit[queryUnitParam.split(options.delimiters.operator)[1]] = query[queryUnitParam];
          }
        parsedQuery[queryUnitParam.split(options.delimiters.operator)[0]] = parsedQueryUnit;
      }
    }
  return parsedQuery;
  }
};

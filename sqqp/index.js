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

const Query = {
  parseFilters: (operator, filters, options) => {
    if ((filters[0] === options.delimiters.queryParams.boundaries[0])
    && (filters[filters.length - 1] === options.delimiters.queryParams.boundaries[1])) {
      return filters
        .substring(1, filters.length - 1)
        .split(options.delimiters.queryParams.delimiter);
    }
    return filters;
  },
  parseOrder: (key, filter) => {
    return [key, filter];
    // [['lastname','desc']]
  }
};

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
        express: true,
        orderId: 'order',
        limitId: 'limit'
      };
    }
    const parsedQuery = [{}, []];
    if (!options.express) {
      query.split('&')
        .map(queryUnit => queryUnit.split(options.delimiters.operator))
        .map(queryUnitParams => queryUnitParams.map(queryUnitParam => queryUnitParam.split(options.delimiters.value)))
        .forEach((queryUnitParam) => {
          const parsedQueryUnit = {};
          const key = queryUnitParam[0][0];
          const operator = queryUnitParam[1][0];
          const filters = queryUnitParam[1][1];
          switch (operator) {
            case options.orderId:
              parsedQuery[1] = Query.parseOrder(key, filters);
              break;
            default:
              parsedQueryUnit[operator] = Query.parseFilters(operator, filters, options);
              parsedQuery[0][queryUnitParam[0]] = parsedQueryUnit;
          }
        });
    } else {
      Object.keys(query).forEach((queryUnitParam) => {
        const parsedQueryUnit = {};
        const key = queryUnitParam.split(':')[0]
        const operator = queryUnitParam.split(':')[1];
        const filters = query[queryUnitParam];
        switch (operator) {
          case options.orderId:
            parsedQuery[1] = Query.parseOrder(key, filters);
            break;
          default:
            parsedQueryUnit[operator] = Query.parseFilters(operator, filters, options);
            parsedQuery[0][queryUnitParam.split(options.delimiters.operator)[0]] = parsedQueryUnit;
        }
      });
    }
    return parsedQuery;
  }
};

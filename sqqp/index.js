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

const Query = new function query() {
  this.parse = (parsedQuery, parsedQueryUnit, key, operator, filters, options) => {
    if (key !== options.limitId) {
      switch (operator) {
        case options.orderId:
          if (parsedQuery.order === undefined) parsedQuery.order = [];
          parsedQuery.order.push(this.parseOrder(key, filters));
          break;
        default:
          if (parsedQuery.where === undefined) parsedQuery.where = {};
          parsedQueryUnit[operator] = this.parseFilters(operator, filters, options);
          parsedQuery.where[key] = parsedQueryUnit;
      }
      return parsedQuery;
    }
    parsedQuery.limit = parseInt(filters, 10);
  };
  this.parseFilters = (operator, filters, options) => {
    if ((filters[0] === options.delimiters.queryParams.boundaries[0])
    && (filters[filters.length - 1] === options.delimiters.queryParams.boundaries[1])) {
      return filters
        .substring(1, filters.length - 1)
        .split(options.delimiters.queryParams.delimiter);
    }
    return filters;
  };
  this.parseOrder = (key, filter) => [key, filter];
}();

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
    const parsedQuery = {};
    if (!options.express) {
      query.split('&')
        .map(queryUnit => queryUnit.split(options.delimiters.operator))
        .map(queryUnitParams => queryUnitParams.map(queryUnitParam => queryUnitParam.split(options.delimiters.value)))
        .forEach((queryUnitParam) => {
          const parsedQueryUnit = {};
          const key = queryUnitParam[0][0];
          let operator = null;
          let filters = null;
          if (key !== options.limitId) {
            [, [operator]] = queryUnitParam;
            [, [, filters]] = queryUnitParam;
          } else {
            [[, filters]] = queryUnitParam;
          }
          Query.parse(parsedQuery, parsedQueryUnit, key, operator, filters, options);
        });
    } else {
      Object.keys(query).forEach((queryUnitParam) => {
        const parsedQueryUnit = {};
        const key = queryUnitParam.split(':')[0];
        const operator = queryUnitParam.split(':')[1];
        const filters = query[queryUnitParam];
        Query.parse(parsedQuery, parsedQueryUnit, key, operator, filters, options);
      });
    }
    return parsedQuery;
  }
};

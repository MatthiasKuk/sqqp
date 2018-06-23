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
        }
      }
    }
    const queryParams = {};
    query.split('&')
      .map(queryUnit => queryUnit.split(options.delimiters.operator))
      .map(queryUnitParams => queryUnitParams.map(queryUnitParam => queryUnitParam.split(options.delimiters.value)))
      .forEach(queryUnitParam => {
        const queryUnitProps = {};
        if ((queryUnitParam[1][1][0] === options.delimiters.queryParams.boundaries[0]) &&
          (queryUnitParam[1][1][queryUnitParam[1][1].length - 1] === options.delimiters.queryParams.boundaries[1])) {
            queryUnitProps[queryUnitParam[1][0]] = queryUnitParam[1][1]
              .substring(1, queryUnitParam[1][1].length - 1)
              .split(options.delimiters.queryParams.delimiter);
          } else {
            queryUnitProps[queryUnitParam[1][0]] = queryUnitParam[1][1];
          }
          queryParams[queryUnitParam[0]] = queryUnitProps;
      })
  return queryParams;
  }
};

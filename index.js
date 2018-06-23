/**
 * @desc Parses the provided parameters into objects.
 * @param {string} query
 * @param {string} options
 * @return {object}
 */

// { id: { eq: 1} }

module.exports = {
  parse: (query, options) => {
    const queryParams = {};
    query.split('&')
      .map(queryUnit => queryUnit.split(':'))
      .map(queryUnitParams => queryUnitParams.map(queryUnitParam => queryUnitParam.split('=')))
      .forEach(queryUnitParam => {
        const p = {};
        if ((queryUnitParam[1][1][0] === '[') && (queryUnitParam[1][1][queryUnitParam[1][1].length - 1] === ']')) {
          p[queryUnitParam[1][0]] = queryUnitParam[1][1]
            .substring(1, queryUnitParam[1][1].length - 1)
            .split(',');
        } else {
          p[queryUnitParam[1][0]] = queryUnitParam[1][1];
        }
        // p[queryUnitParam[1][0]] = queryUnitParam[1][1];
        queryParams[queryUnitParam[0]] = p;
      })
  return queryParams;  
  }
};
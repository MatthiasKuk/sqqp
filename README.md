SeQuelizeQueryParser (sqqp) [![Coverage Status](https://coveralls.io/repos/github/MatthiasKuk/sqqp/badge.svg?branch=development)](https://coveralls.io/github/MatthiasKuk/sqqp?branch=development)
[![CircleCI](https://circleci.com/gh/MatthiasKuk/sqqp/tree/development.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/MatthiasKuk/sqqp/tree/development)
=========

A small helper library to parse query strings into corresponding query parameters as needed in Sequelize.js.

## Motivation

I was looking for a flexible query parser which would allow me to design and customize API queries to my needs and would provide a parsed result which can be processed directly into [Sequelize.js querying](http://docs.sequelizejs.com/manual/tutorial/querying.html#basics) arguments.

## Installation

  `npm -S sqqp`

## Usage

Sqqb allows for a flexible provision of query parameters. By default, the query parameters are expected to be provided as key-value pairs (e.g. express.js `req.query`).

    const sqqp = require('sqqp');

    sqqp.parse({ 'id:eq': '1' });
    // returns: { id: { eq: '1' } }

    sqqp.parse({ 'id:or': '[1,2]' });
    // returns: { id: { or: ['1', '2'] } }

    sqqp.parse({ 'id:or': '[1,2]', 'name:eq': 'foo' });
    // returns: { id: { or: ['1', '2'] }, name: { eq: 'foo' } }

Sqqp supports customized queries. For more details see the [options](#options) parameter.
    
    const sqqp = require('sqqp');

    const options = {
      delimiters: {
        operator: '=',
        value: '%',
        queryParams: {
          delimiter: ',',
          boundaries: ['(', ')']
        }
      },
      express: false
    };

    sqqp.parse('id=eq%1', options);
    // returns: { id: { eq: '1' } }

    sqqp.parse('id=eq%1&name=eq%foo&date=or%(2018,2019)', options);
    // returns: { id: { eq: '1' }, name: { eq: 'foo' }, date: { or: ['2018', '2019'] } }

### Options

The `options` parameter holds information about the customisation of the query. A provision of the entire object is required. If no `options` argument is provided to the `.parse` method, the default options object will be used:

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

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code. The master branch is protected. Feel free to provide your code into the development branch.
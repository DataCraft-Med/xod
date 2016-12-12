import R from 'ramda';
import { Either } from 'ramda-fantasy';
import shortid from 'shortid';

import * as CONST from './constants';
/**
 * Contains resulting value or error
 *
 * See: {@link https://github.com/ramda/ramda-fantasy/blob/master/docs/Either.md}
 *
 * @external Either
 */

/**
 * Contains resulting value or null
 *
 * See: {@link https://github.com/ramda/ramda-fantasy/blob/master/docs/Maybe.md}
 *
 * @external Maybe
 */

 /**
  * A special object for triggering nodes without passing data.
  *
  * @typedef {Object} Pulse
  */

/**
 * @typedef {Object} Position
 * @property {number} x
 * @property {number} y
 */

 /**
  * Associate value into some property and wrap it with Either.Right
  * @function assocRight
  * @param {string} propName
  * @param {*} value
  * @param {Project} project
  * @returns {Either.Right<Project>}
  */
export const assocRight = R.curry(
  R.compose(
    Either.Right,
    R.assoc
  )
);

 /**
  * Returns an Error object wrapped into Either.Left
  * @function leaveError
  * @param {string} errorMessage
  * @returns {Either.Left<Error>}
  */
export const leaveError = R.compose(
  R.always,
  Either.Left,
  R.construct(Error)
);

/**
 * @function getBaseName
 * @param {string} path
 * @returns {string}
 */
export const getBaseName = R.compose(
  R.last,
  R.split('/')
);

/**
 * @function isPathLocal
 * @param {string} path
 * @returns {boolean}
 */
export const isPathLocal = R.test(/^@\/[a-zA-Z0-9_\-/]+$/);

/**
 * @function isPathLibrary
 * @param {string} path
 * @returns {boolean}
 */
export const isPathLibrary = R.test(/^[a-zA-Z0-9_\-/]+$/);

/**
 * Checks if a path is a valid for entities like
 * project path, patch path component, etc
 *
 * @function validatePath
 * @param {string} path - string to check
 * @returns {Either<Error|string>} error or valid path
 */
export const validatePath = R.ifElse(
  R.allPass([
    R.complement(R.isNil),
    R.test(/^(@\/)?[a-zA-Z0-9_\-/]+$/),
  ]),
  Either.Right,
  (path) => leaveError(CONST.ERROR.PATH_INVALID)(path)
);

/**
 * Adds a slash to the end of string if it doesn't exist
 * @function addSlashToEnd
 * @param {string} str
 * @returns {string}
 */
export const addSlashToEnd = R.ifElse(
  R.compose(
    R.equals('/'),
    R.last
  ),
  R.identity,
  R.concat(R.__, '/')
);

/**
 * Generates an id for entities
 * @function generateId
 * @returns {string}
 */
export const generateId = shortid.generate;

/**
 * Checks that value is exist in the dictionary (object).
 * @function isValueInDictionary
 * @param {*} value
 * @param {object} dictionary
 * @returns {boolean}
 */
export const isValueInDictionary = R.compose(
  R.gt(R.__, 0),
  R.length,
  R.keys,
  R.useWith(
    R.pickBy,
    [
      R.equals,
      R.identity,
    ]
  )
);

/**
 * Returns function that assoc string to a specified key
 * @function assocString
 * @param {string} key
 * @returns {function}
 */
export const assocString = (key) => R.useWith(
  R.assoc(key),
  [
    String,
    R.identity,
  ]
);

/**
 * Returns function that assoc number to a specified key
 * @function assocString
 * @param {string} key
 * @returns {function}
 */
export const assocNumber = (key) => R.useWith(
  R.assoc(key),
  [
    R.compose(
      R.defaultTo(0),
      Number
    ),
    R.identity,
  ]
);

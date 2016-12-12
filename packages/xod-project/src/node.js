import R from 'ramda';
import { Maybe, Either } from 'ramda-fantasy';
import * as Utils from './utils';
import * as CONST from './constants';

/**
 * @typedef {Object} Node
 */

/**
 * A {@link Node} object or just its ID as {@link string}
 * @typedef {(Node|string)} NodeOrId
 */

/**
 * Pin value can be one of this type:
 *
 * - {@link string}
 * - {@link number}
 * - {@link boolean}
 * - {@link Pulse}
 *
 * And it is never can be {@link Null} or {@link undefined}
 *
 * @typedef {(string|number|boolean|Pulse)} PinValue
 */

 // =============================================================================
 //
 // Validation
 //
 // =============================================================================

/**
 * Validate that position object has a keys x and y with numbers.
 *
 * @function validatePosition
 * @param {Position} position
 * @returns {Either<Error|Position>}
 */
export const validatePosition = R.ifElse(
  R.allPass([
    R.is(Object),
    R.compose(R.is(Number), R.prop('x')),
    R.compose(R.is(Number), R.prop('y')),
  ]),
  Either.of,
  Utils.leaveError(CONST.ERROR.POSITION_INVALID)
);

// =============================================================================
//
// Node
//
// =============================================================================

/**
 * @function createNode
 * @param {Position} position - coordinates of new node’s center
 * @param {string} type - path to the patch, that will be the type of node to create
 * @returns {Either<Error|Node>} error or a new node
 */
export const createNode = R.curry(
  (position, type) =>
    validatePosition(position)
      .map(
        R.assoc('position', R.__, {
          id: Utils.generateId(),
          type,
        })
      )
);

/**
 * @function duplicateNode
 * @param {Node} node - node to clone
 * @returns {Node} cloned node with new id
 */
export const duplicateNode = R.compose(
  R.assoc('id', Utils.generateId()),
  JSON.parse,
  JSON.stringify
);

/**
 * @function getNodeId
 * @param {NodeOrId} node
 * @returns {string}
 */
export const getNodeId = R.ifElse(R.is(String), R.identity, R.prop('id'));

/**
 * @function getNodeType
 * @param {Node} node
 * @returns {string}
 */
export const getNodeType = R.prop('type');

/**
 * @function getNodeLabel
 * @param {Node} node
 * @returns {string}
 */
export const getNodeLabel = R.propOr('', 'label');

/**
 * @function setNodeLabel
 * @param {string} label
 * @param {Node} node
 * @returns {Node}
 */
export const setNodeLabel = R.assoc('label');

/**
 * @function getNodeDescription
 * @param {Node} node
 * @returns {string}
 */
export const getNodeDescription = R.propOr('', 'description');

/**
 * @function setNodeDescription
 * @param {string} description
 * @param {Node} node
 * @returns {Node}
 */
export const setNodeDescription = R.assoc('description');

/**
 * @function setNodePosition
 * @param {Position} position - new coordinates of node’s center
 * @param {Node} node - node to move
 * @returns {Either<Error|Node>} copy of node in new coordinates
 */
export const setNodePosition = R.curry(
  (position, node) =>
    validatePosition(position)
      .map(
        R.assoc('position', R.__, node)
      )
);

/**
 * @function getNodePosition
 * @param {Node} node
 * @returns {Position}
 */
export const getNodePosition = R.prop('position');

/**
 * @function isInputPinNode
 * @param {Node} node
 * @returns {boolean}
 */
export const isInputPinNode = R.compose(
  R.test(/^xod\/core\/input/),
  getNodeType
);

/**
 * @function isOutputPinNode
 * @param {Node} node
 * @returns {boolean}
 */
export const isOutputPinNode = R.compose(
  R.test(/^xod\/core\/output/),
  getNodeType
);

/**
 * @function isPinNode
 * @param {Node} node
 * @returns {boolean}
 */
export const isPinNode = R.either(
  isInputPinNode,
  isOutputPinNode
);

 // =============================================================================
 //
 // Pins
 //
 // =============================================================================

/**
 * Gets curried value of input pin.
 *
 * It will return value even if pin isn't curried.
 * In that case the last curried value or default one is returned.
 *
 * @function getPinCurriedValue
 * @param {string} key
 * @param {Node} node
 * @returns {Maybe<Nothing|PinValue>}
 */
export const getPinCurriedValue = R.compose(
  Maybe,
  R.useWith(
    R.pathOr(null),
    [
      R.insert(1, R.__, ['pins', 'value']),
      R.identity,
    ]
  )
);

/**
 * Sets curried value to input pin.
 *
 * @function setPinCurriedValue
 * @param {string} key
 * @param {*} value
 * @param {Node} node
 * @returns {Node}
 */
export const setPinCurriedValue = R.useWith(
  R.assocPath,
  [
    R.insert(1, R.__, ['pins', 'value']),
    R.identity,
    R.identity,
  ]
);

 /**
  * Enables or disables pin currying.
  *
  * @function curryPin
  * @param {string} key
  * @param {boolean} curry
  * @param {Node} node
  * @returns {Either<Error|Node>}
  */
export const curryPin = R.useWith(
  R.assocPath,
  [
    R.insert(1, R.__, ['pins', 'curried']),
    R.identity,
    R.identity,
  ]
);

/**
 * @function isPinCurried
 * @param {string} key
 * @param {Node} node
 * @returns {boolean}
 */
export const isPinCurried = R.useWith(
  R.pathSatisfies(R.equals(true)),
  [
    R.insert(1, R.__, ['pins', 'curried']),
    R.identity,
  ]
);

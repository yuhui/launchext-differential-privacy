/**
 * Copyright 2020-2022 Yuhui. All rights reserved.
 *
 * Licensed under the GNU General Public License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/gpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const {
  logger: {
    debug: logDebug,
    error: logError,
  },
} = require('../controllers/turbine');
const validateValue = require('../helpers/validateValue');

var RETURN_TYPE_ALLOWED_VALUES = [
  'position',
  'value',
];

const toString = Object.prototype.toString;

/**
 * The differential item data element.
 *
 * @param {Object} settings The data element settings object.
 * @param {String or Array} settings.listOfPossibleItems A comma-separated
 * string or a data element that returns a comma-separated string or an array
 * of items.
 * @param {String or Object} settings.selectedItem A string or a data element
 * that returns an object.
 * @param {Float} settings.probabilityOfUsingSelectedItem A float (stored as a
 * string) that represents the probability of returning the selected item.
 * @param {String} settings.returnType "value" or "position".
 *
 * @returns {Object} An item from the array of items. This could be the
 * selected item itself, if the probability is met, or a random item from the
 * array. If any validation fails, a blank string is returned.
 */
module.exports = function({
  selectedItem,
  probabilityOfUsingSelectedItem,
  listOfPossibleItems,
  returnType
} = {}) {
  try {
    validateValue(selectedItem);
  } catch (e) {
    logError(`selected item ${e.message}`, selectedItem);
    return;
  }

  try {
    validateValue(probabilityOfUsingSelectedItem, ['number', 'string']);
  } catch (e) {
    logError(`probability of using selected item ${e.message}`, probabilityOfUsingSelectedItem);
    return;
  }
  // ensure that probabilityOfUsingSelectedItem is a number (float)
  const probabilityOfUsingSelectedItemValue =
    toString.call(probabilityOfUsingSelectedItem) === '[object String]'
      ? Number(probabilityOfUsingSelectedItem)
      : probabilityOfUsingSelectedItem;
  try {
    validateValue(probabilityOfUsingSelectedItemValue, ['number']);
  } catch (e) {
    logError(`probability of using selected item ${e.message}`, probabilityOfUsingSelectedItem);
    return;
  }
  if (probabilityOfUsingSelectedItem < 0.0 || probabilityOfUsingSelectedItem > 1.0) {
    logError(
      'probability of using selected item must be between 0.0 and 1.0',
      probabilityOfUsingSelectedItem
    );
    return;
  }

  try {
    validateValue(listOfPossibleItems, ['array', 'string']);
  } catch (e) {
    logError(`list of possible items ${e.message}`, listOfPossibleItems);
    return;
  }
  if (listOfPossibleItemsType === '[object String]') {
    listOfPossibleItems = listOfPossibleItems.split(',').map(function(i) {
      return i.trim();
    });
  }

  // validate settings.returnType
  var returnType = settings.returnType;
  if (!returnType) {
    logError('list of possible items has some undefined values', listOfPossibleItems);
    return;
  }
  if (RETURN_TYPE_ALLOWED_VALUES.indexOf(returnType) === -1) {
    logError('return type is neither "position" nor "value"', returnType);
    return;
  }

  // assume that the item to return is the selected item
  var returnItem = selectedItem;

  var randomNumber = Math.random();
  if (randomNumber > probabilityOfUsingSelectedItem) {
    // probability is not met
    // get a random item from the list of possible items
    var numPossibleItems = listOfPossibleItems.length;
    var randomPosition = Math.floor(Math.random() * numPossibleItems);
    returnItem = listOfPossibleItems[randomPosition];
  }

  var returnValue;
  switch (returnType) {
    case 'position':
      // position is 1-based
      // if the selected item is not in the list, then this returns 0,
      // ...which is correct!
      returnValue = listOfPossibleItems.indexOf(returnItem) + 1;
      break;
    case 'value':
      returnValue = returnItem;
      break;
  }
  if (!returnValue && returnValue === 0) {
    returnValue = String(returnValue);
  }
  if (returnValue) {
    return returnValue;
  }
  logDebug(`returned: ${returnValue}`);
};

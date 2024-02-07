/**
 * Copyright 2020-2024  Yuhui. All rights reserved.
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

const RETURN_TYPE_ALLOWED_VALUES = new Set([
  'position',
  'value',
]);

const toString = Object.prototype.toString;

/**
 * The differential item data element.
 *
 * @param {Object} settings The data element settings object.
 * @param {String or Object} settings.selectedItem A string or a data element that returns an
 *    object.
 * @param {String} settings.probabilityOfUsingSelectedItem A float (stored as a string) that
 *    represents the probability of returning the selected item.
 * @param {String or Array} settings.listOfPossibleItems A comma-separated string or a data
 *    element that returns a comma-separated string or an array of items.
 * @param {String} settings.returnType "value" or "position".
 *
 * @returns {Object} An item from the array of items. This could be the selected item itself, if
 *    the probability is met, or a random item from the array. If any validation fails, a blank
 *    string is returned.
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
  if (
    Number.isNaN(probabilityOfUsingSelectedItemValue)
    || probabilityOfUsingSelectedItemValue < 0.0
    || probabilityOfUsingSelectedItemValue > 1.0
  ) {
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
  const listOfPossibleItemsArray = (
    toString.call(listOfPossibleItems) === '[object String]'
      ? listOfPossibleItems.split(',')
      : listOfPossibleItems
  ).map((i) => typeof i === 'string' ? i.trim() : i);
  let isListOfPossibleItemsValidArray;
  try {
    isListOfPossibleItemsValidArray = listOfPossibleItemsArray.every((item) => validateValue(item));
  } catch (e) {
    isListOfPossibleItemsValidArray = false;
  }
  if (!isListOfPossibleItemsValidArray) {
    logError('list of possible items has some undefined values', listOfPossibleItems);
    return;
  }

  if (!RETURN_TYPE_ALLOWED_VALUES.has(returnType)) {
    logError('return type is neither "position" nor "value"', returnType);
    return;
  }

  // assume that the item to return is the selected item
  let returnItem = selectedItem;

  const { floor, random } = Math;
  const randomNumber = random();
  if (randomNumber > probabilityOfUsingSelectedItemValue) {
    /**
     * probability is not met
     * get a random item from the list of possible items
     */
    const numPossibleItems = listOfPossibleItemsArray.length;
    const randomPosition = floor(random() * numPossibleItems);
    returnItem = listOfPossibleItemsArray[randomPosition];
  }

  let returnValue;
  switch (returnType) {
    case 'position':
      /**
       * position is 1-based
       * if the selected item is not in the list, then this returns 0,
       * ...which is correct!
       */
      returnValue = listOfPossibleItemsArray.indexOf(returnItem) + 1;
      break;
    case 'value':
      returnValue = returnItem;
      break;
  }
  // make falsy values to be strings so that they can be returned properly
  if (!returnValue) {
    logDebug(`converting ${returnValue} to a string`);
    returnValue = String(returnValue);
  }
  if (!returnValue) {
    logError('unexpected error occurred with return value', returnValue);
  }

  logDebug(`returned: ${returnValue}`);
  return returnValue;
};

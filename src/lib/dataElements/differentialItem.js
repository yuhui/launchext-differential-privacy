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

var logger = turbine.logger;

var PROBABILITY_OF_USING_SELECTED_ITEM_ALLOWED_TYPES = [
  '[object Number]',
  '[object String]',
];
var LIST_OF_POSSIBLE_ITEMS_ALLOWED_TYPES = [
  '[object Array]',
  '[object String]',
];
var RETURN_TYPE_ALLOWED_VALUES = [
  'position',
  'value',
];

/**
 * Returns the object's type using `Object.prototype.toString`.
 * Reference: https://stackoverflow.com/a/332429
 *
 * @param {*} obj The object to get its type.
 *
 * @returns {String} The object's type.
 */
var objectType = function(obj) {
  var toString = Object.prototype.toString;
  return toString.call(obj);
};

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
module.exports = function(settings) {
  // validate settings.selectedItem
  var selectedItem = settings.selectedItem;
  if (!selectedItem) {
    logger.error('missing selected item');
    return;
  }

  // validate settings.probabilityOfUsingSelectedItem
  var probabilityOfUsingSelectedItem = settings.probabilityOfUsingSelectedItem;
  if (!probabilityOfUsingSelectedItem) {
    logger.error('missing probability of using selected item');
    return;
  }
  var probabilityOfUsingSelectedItemType = objectType(probabilityOfUsingSelectedItem);
  var probabilityOfUsingSelectedItemTypeIsAllowed =
    PROBABILITY_OF_USING_SELECTED_ITEM_ALLOWED_TYPES.indexOf(
      probabilityOfUsingSelectedItemType
    ) === -1;
  if (probabilityOfUsingSelectedItemTypeIsAllowed) {
    logger.error('probability of using selected item is not a number');
    return;
  }
  if (probabilityOfUsingSelectedItemType === '[object String]') {
    probabilityOfUsingSelectedItem = Number(probabilityOfUsingSelectedItem);
  }
  if (!probabilityOfUsingSelectedItem) {
    logger.error('probability of using selected item is not a number');
    return;
  }
  if (probabilityOfUsingSelectedItem < 0.0 || probabilityOfUsingSelectedItem > 1.0) {
    logger.error('probability of using selected item must be between 0.0 and 1.0');
    return;
  }

  // validate settings.listOfPossibleItems
  var listOfPossibleItems = settings.listOfPossibleItems;
  if (!listOfPossibleItems) {
    logger.error('missing list of possible items');
    return;
  }
  var listOfPossibleItemsType = objectType(listOfPossibleItems);
  var listOfPossibleItemsTypeIsAllowed = LIST_OF_POSSIBLE_ITEMS_ALLOWED_TYPES.indexOf(
    listOfPossibleItemsType
  ) === -1;
  if (listOfPossibleItemsTypeIsAllowed) {
    logger.error('list of possible items is not a string nor an array');
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
    logger.error('missing return type');
    return;
  }
  if (RETURN_TYPE_ALLOWED_VALUES.indexOf(returnType) === -1) {
    logger.error('return type is neither "position" nor "value"');
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
    logger.debug('returned: ' + returnValue);
    return returnValue;
  }
};

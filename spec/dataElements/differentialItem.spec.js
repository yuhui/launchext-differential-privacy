/**
 * Copyright 2020 Yuhui. All rights reserved.
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

describe('differentialItem data element delegate', function() {
  // mock turbine.logger
  global.turbine = {
    logger: jasmine.createSpyObj('', ['debug', 'info', 'warn', 'alert', 'error']),
  };

  var dataElementDelegate = require('../../src/lib/dataElements/differentialItem');

  beforeEach(function() {
    this.settings = {
      selectedItem: 'lorem',
      probabilityOfUsingSelectedItem: '0.75',
      listOfPossibleItems: ['foo', 'bar', 'stamp'],
      returnType: 'value'
    };
  });

  describe('with invalid "settings" argument', function() {
    it(
      'should return empty string when "selectedItem" is missing',
      function() {
        delete this.settings.selectedItem;
        var result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "probabilityOfUsingSelectedItem" is ' +
      'missing',
      function() {
        delete this.settings.probabilityOfUsingSelectedItem;
        var result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "probabilityOfUsingSelectedItem" type ' +
      'is invalid',
      function() {
        this.settings.probabilityOfUsingSelectedItem = true;
        var result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "probabilityOfUsingSelectedItem" is ' +
      'not a number',
      function() {
        this.settings.probabilityOfUsingSelectedItem = 'abc';
        var result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "probabilityOfUsingSelectedItem" is ' +
      'less than 0',
      function() {
        this.settings.probabilityOfUsingSelectedItem = -0.123;
        var result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "probabilityOfUsingSelectedItem" is ' +
      'greater than 1',
      function() {
        this.settings.probabilityOfUsingSelectedItem = 1.23;
        var result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "listOfPossibleItems" is missing',
      function() {
        delete this.settings.listOfPossibleItems;
        var result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "listOfPossibleItems" type is invalid',
      function() {
        this.settings.listOfPossibleItems = true;
        var result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "returnType" is missing',
      function() {
        delete this.settings.returnType;
        var result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "returnType" type is invalid',
      function() {
        this.settings.returnType = true;
        var result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "returnType" is not a valid string',
      function() {
        this.settings.returnType = 'foobar';
        var result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );
  });

  describe('with valid "settings" argument', function() {
    it(
      'should be a value when "returnType" is "value"',
      function() {
        var result = dataElementDelegate(this.settings);
        var resultIsSelectedItem = result === this.settings.selectedItem;
        var resultIsInListOfPossibleItems =
          this.settings.listOfPossibleItems.indexOf(result) > -1;
        expect(
          resultIsSelectedItem || resultIsInListOfPossibleItems
        ).toBeTrue();
      }
    );

    it(
      'should be an index greater than 0 when "returnType" is "position"',
      function() {
        this.settings.returnType = 'position';
        var result = dataElementDelegate(this.settings);
        var resultIsGreaterThanOrEqualToZero = result >= 0;
        var resultIsLessThanOrEqualToLengthOfListOfPossibleItems =
          result <= this.settings.listOfPossibleItems.length;
        expect(
          resultIsGreaterThanOrEqualToZero &&
          resultIsLessThanOrEqualToLengthOfListOfPossibleItems
        ).toBeTrue();
      }
    );
  });
});

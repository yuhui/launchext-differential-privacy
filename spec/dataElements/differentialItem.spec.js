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

describe('differentialItem data element delegate', () => {
  // mock turbine.logger
  global.turbine = {
    logger: jasmine.createSpyObj('', ['debug', 'info', 'warn', 'alert', 'error']),
  };

  const dataElementDelegate = require('../../src/lib/dataElements/differentialItem');

  beforeEach(() => {
    this.settings = {
      selectedItem: 'lorem',
      probabilityOfUsingSelectedItem: '0.75',
      listOfPossibleItems: ['foo', 'bar', 'stamp'],
      returnType: 'value',
    };
  });

  describe('with invalid "settings" argument', () => {
    it(
      'should return empty string when "selectedItem" is missing',
      () => {
        delete this.settings.selectedItem;
        const result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "probabilityOfUsingSelectedItem" is missing',
      () => {
        delete this.settings.probabilityOfUsingSelectedItem;
        const result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "probabilityOfUsingSelectedItem" type is invalid',
      () => {
        this.settings.probabilityOfUsingSelectedItem = true;
        const result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "probabilityOfUsingSelectedItem" is not a number',
      () => {
        this.settings.probabilityOfUsingSelectedItem = 'abc';
        const result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "probabilityOfUsingSelectedItem" is less than 0',
      () => {
        this.settings.probabilityOfUsingSelectedItem = -0.123;
        const result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "probabilityOfUsingSelectedItem" is greater than 1',
      () => {
        this.settings.probabilityOfUsingSelectedItem = 1.23;
        const result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "listOfPossibleItems" is missing',
      () => {
        delete this.settings.listOfPossibleItems;
        const result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "listOfPossibleItems" type is invalid',
      () => {
        this.settings.listOfPossibleItems = true;
        const result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "returnType" is missing',
      () => {
        delete this.settings.returnType;
        const result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "returnType" type is invalid',
      () => {
        this.settings.returnType = true;
        const result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should return empty string when "returnType" is not a valid string',
      () => {
        this.settings.returnType = 'foobar';
        const result = dataElementDelegate(this.settings);
        expect(result).toBeUndefined();
      }
    );
  });

  describe('with valid "settings" argument', () => {
    it(
      'should be a value when "returnType" is "value"',
      () => {
        const result = dataElementDelegate(this.settings);
        const resultIsSelectedItem = result === this.settings.selectedItem;
        const resultIsInListOfPossibleItems =
          this.settings.listOfPossibleItems.indexOf(result) > -1;
        expect(
          resultIsSelectedItem || resultIsInListOfPossibleItems
        ).toBeTrue();
      }
    );

    it(
      'should be an index greater than 0 when "returnType" is "position"',
      () => {
        this.settings.returnType = 'position';
        const result = dataElementDelegate(this.settings);
        const resultIsGreaterThanOrEqualToZero = result >= 0;
        const resultIsLessThanOrEqualToLengthOfListOfPossibleItems =
          result <= this.settings.listOfPossibleItems.length;
        expect(
          resultIsGreaterThanOrEqualToZero && resultIsLessThanOrEqualToLengthOfListOfPossibleItems
        ).toBeTrue();
      }
    );
  });
});

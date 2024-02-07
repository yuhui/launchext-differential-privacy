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

const mockTurbine = require('../../specHelpers/mockTurbine');
const proxyquire = require('proxyquire').noCallThru();

describe('differentialItem data element delegate', function() {
  beforeEach(function() {
    this.settings = {
      selectedItem: 'lorem',
      probabilityOfUsingSelectedItem: '0.75',
      listOfPossibleItems: ['lorem', false, 'foo', 42, 'bar', null, 'stamp'],
      returnType: 'value',
    };
    this.turbine = mockTurbine();

    this.dataElementDelegate = proxyquire(
      '../../../src/lib/dataElements/differentialItem',
      {
        '../controllers/turbine': this.turbine,
      }
    );
  });

  describe('with invalid "settings" argument', function() {
    it(
      'logs an error and returns nothing when "selectedItem" is missing',
      function() {
        delete this.settings.selectedItem;

        const result = this.dataElementDelegate(this.settings);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalled();
      }
    );

    it(
      'logs an error and returns nothing when "probabilityOfUsingSelectedItem" is missing',
      function() {
        delete this.settings.probabilityOfUsingSelectedItem;

        const result = this.dataElementDelegate(this.settings);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalled();
      }
    );

    it(
      'logs an error and returns nothing when "probabilityOfUsingSelectedItem" type is invalid',
      function() {
        this.settings.probabilityOfUsingSelectedItem = true;

        const result = this.dataElementDelegate(this.settings);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalled();
      }
    );

    it(
      'logs an error and returns nothing when "probabilityOfUsingSelectedItem" is not a number',
      function() {
        this.settings.probabilityOfUsingSelectedItem = 'abc';

        const result = this.dataElementDelegate(this.settings);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalled();
      }
    );

    it(
      'logs an error and returns nothing when "probabilityOfUsingSelectedItem" is less than 0',
      function() {
        this.settings.probabilityOfUsingSelectedItem = -0.123;

        const result = this.dataElementDelegate(this.settings);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalled();
      }
    );

    it(
      'logs an error and returns nothing when "probabilityOfUsingSelectedItem" is greater than 1',
      function() {
        this.settings.probabilityOfUsingSelectedItem = 1.23;

        const result = this.dataElementDelegate(this.settings);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalled();
      }
    );

    it(
      'logs an error and returns nothing when "listOfPossibleItems" is missing',
      function() {
        delete this.settings.listOfPossibleItems;

        const result = this.dataElementDelegate(this.settings);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalled();
      }
    );

    it(
      'logs an error and returns nothing when "listOfPossibleItems" type is invalid',
      function() {
        this.settings.listOfPossibleItems = true;

        const result = this.dataElementDelegate(this.settings);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalled();
      }
    );

    it(
      'logs an error and returns nothing when "listOfPossibleItems" has undefined values',
      function() {
        this.settings.listOfPossibleItems.push(undefined);

        const result = this.dataElementDelegate(this.settings);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalledWith(
          'list of possible items has some undefined values',
          this.settings.listOfPossibleItems
        );
      }
    );

    it(
      'logs an error and returns nothing when "returnType" is missing',
      function() {
        delete this.settings.returnType;

        const result = this.dataElementDelegate(this.settings);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalledWith(
          'return type is neither "position" nor "value"',
          undefined
        );
      }
    );

    it(
      'logs an error and returns nothing when "returnType" type is invalid',
      function() {
        this.settings.returnType = true;

        const result = this.dataElementDelegate(this.settings);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalledWith(
          'return type is neither "position" nor "value"',
          this.settings.returnType
        );
      }
    );

    it(
      'logs an error and returns nothing when "returnType" is not a valid string',
      function() {
        this.settings.returnType = 'foobar';

        const result = this.dataElementDelegate(this.settings);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalledWith(
          'return type is neither "position" nor "value"',
          this.settings.returnType
        );
      }
    );
  });

  describe('with valid "settings" argument', function() {
    it(
      'returns a value when "returnType" is "value"',
      function() {
        const result = this.dataElementDelegate(this.settings);

        const resultIsSelectedItem = result === this.settings.selectedItem;
        const resultIsInListOfPossibleItems =
          this.settings.listOfPossibleItems.indexOf(result) > -1;
        expect(
          resultIsSelectedItem || resultIsInListOfPossibleItems
        ).toBeTrue();

        const { debug: logDebug } = this.turbine.logger;
        expect(logDebug).toHaveBeenCalledWith(`returned: ${result}`);
      }
    );

    it(
      'should be an index greater than 0 when "returnType" is "position"',
      function() {
        this.settings.selectedItem = 'bar';
        this.settings.returnType = 'position';

        const result = this.dataElementDelegate(this.settings);

        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(this.settings.listOfPossibleItems.length);

        const { debug: logDebug } = this.turbine.logger;
        expect(logDebug).toHaveBeenCalledWith(`returned: ${result}`);
      }
    );

    it(
      'should be an index "0" when "returnType" is "position" and "selectedItem" is not in list',
      function() {
        this.settings.selectedItem = 'not in list';
        this.settings.probabilityOfUsingSelectedItem = '1';
        this.settings.returnType = 'position';

        const result = this.dataElementDelegate(this.settings);

        expect(result).toEqual('0');

        const { debug: logDebug } = this.turbine.logger;
        expect(logDebug).toHaveBeenCalledWith(`returned: ${result}`);
      }
    );
  });
});

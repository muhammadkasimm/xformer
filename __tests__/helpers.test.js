import * as _ from '../src/helpers';

describe('Tests helper functions', () => {
  describe('Checks for a string or number to be junk', () => {
    it('a number is not junk', () => {
      expect(_.isJunk(1)).toBe(false);
    });

    it('a stringy number is not junk', () => {
      expect(_.isJunk('1')).toBe(false);
    });

    it('a random string is junk', () => {
      expect(_.isJunk('abc')).toBe(true);
    });
  });

  describe('Converts junky values to the provided fallback value', () => {
    it('stringy numbers as numbers', () => {
      expect(_.defaultToZero('123')).toBe(123);
    });

    it('junky strings are zero', () => {
      expect(_.defaultToZero('abc')).toBe(0);
    });

    it('undefined is zero', () => {
      expect(_.defaultTo(1, undefined)).toBe(1);
    });

    it('an Object is zero', () => {
      expect(_.defaultTo(100, { a: 1 })).toBe(100);
    });
  });

  describe('Converts negative number to positive', () => {
    it('negative numbers to positive', () => {
      expect(_.bePositive(-1)).toBe(1);
    });

    it('positive numbers as they are', () => {
      expect(_.bePositive(1)).toBe(1);
    });
  });

  describe('Matches if input type is equal to provided type', () => {
    it('a string is a string', () => {
      expect(_.typeMatches('string', 'abc')).toBe(true);
    });

    it('an Object is not a Function', () => {
      expect(_.typeMatches('function', { a: 1 })).toBe(false);
    });

    it('an Array is not an Object', () => {
      expect(_.typeMatches('array', [1, 2, 3])).toBe(true);
    });
  });

  describe('Sums up two values safely', () => {
    it('adds two numbers', () => {
      expect(_.add(2, 2)).toBe(4);
    });

    it('adds a number and a stringy number', () => {
      expect(_.add(2, '2')).toBe(4);
    });

    it('adds a number and a junky value', () => {
      expect(_.add(2, null)).toBe(2);
    });

    it('adds two junky values', () => {
      expect(_.add(undefined, null)).toBe(0);
    });
  });

  describe('Subtracts two values safely', () => {
    it('subtracts two numbers', () => {
      expect(_.subtract(4, 2)).toBe(2);
    });

    it('subtracts a number and a stringy number', () => {
      expect(_.subtract(4, '2')).toBe(2);
    });

    it('subtracts a number and a junky value', () => {
      expect(_.subtract(4, null)).toBe(4);
    });

    it('subtracts two junky values', () => {
      expect(_.subtract(undefined, null)).toBe(0);
    });
  });

  describe('Multiplies two values safely', () => {
    it('multiplies two numbers', () => {
      expect(_.multiply(4, 2)).toBe(8);
    });

    it('multiplies a number and a stringy number', () => {
      expect(_.multiply(4, '2')).toBe(8);
    });

    it('multiplies a number and a junky value', () => {
      expect(_.multiply(4, null)).toBe(0);
    });

    it('multiplies two junky values', () => {
      expect(_.multiply(undefined, null)).toBe(0);
    });
  });

  describe('Divides two values safely', () => {
    it('divides two numbers', () => {
      expect(_.divide(4, 2)).toBe(2);
    });

    it('divides a number and a stringy number', () => {
      expect(_.divide(4, '2')).toBe(2);
    });

    it('divides a number and a junky value', () => {
      expect(_.divide(4, null)).toBe(4);
    });

    it('divides two junky values', () => {
      expect(_.divide(undefined, null)).toBe(0);
    });
  });

  describe('Find max from two values safely', () => {
    it('apply max on two numbers', () => {
      expect(_.max(4, 2)).toBe(4);
    });

    it('apply max on a number and a stringy number', () => {
      expect(_.max(4, '2')).toBe(4);
    });

    it('apply max on a number and a junky value', () => {
      expect(_.max(4, null)).toBe(4);
    });

    it('apply max on two junky values', () => {
      expect(_.max(undefined, null)).toBe(0);
    });
  });

  describe('Find min from two values safely', () => {
    it('apply min on two numbers', () => {
      expect(_.min(4, 2)).toBe(2);
    });

    it('apply min on a number and a stringy number', () => {
      expect(_.min(4, '2')).toBe(2);
    });

    it('apply min on a number and a junky value', () => {
      expect(_.min(4, null)).toBe(0);
    });

    it('apply min on two junky values', () => {
      expect(_.min(undefined, null)).toBe(0);
    });
  });

  describe('Sums up values in an Array', () => {
    it('adds values in an Array', () => {
      expect(_.sumList([1, 2, 3])).toBe(6);
    });

    it('ignore junky values when summing', () => {
      expect(_.sumList([1, 2, 3, undefined, 'abc'])).toBe(6);
    });
  });

  describe('Makes an Object when given a key-value', () => {
    it('makes an Object', () => {
      expect(_.zipValueWithStep('step1', [1, 2, 3])).toEqual({ step1: [1, 2, 3] });
    });
  });

  describe('Maps an Array or Object with access to index', () => {
    it('maps Array with index', () => {
      expect(_.mapIndexed((x, i) => `${i}${x}`, [1, 2, 3])).toEqual(['01', '12', '23']);
    });

    it('maps Array without index', () => {
      expect(_.mapIndexed(x => `${x}`, [1, 2, 3])).toEqual(['1', '2', '3']);
    });

    it('maps Object with index', () => {
      expect(_.mapIndexed((x, i) => `${i}${x}`, { a: 1, b: 2, c: 3 })).toEqual({
        a: '01',
        b: '12',
        c: '23'
      });
    });
  });

  describe('Reduces an Array with access to index', () => {
    it('reduces Array with index', () => {
      expect(_.reduceIndexed((a, v, i) => a + v + i, 0, [1, 2, 3])).toBe(9);
    });

    it('reduces Array without index', () => {
      expect(_.reduceIndexed((a, v) => a + v, 0, [1, 2, 3])).toBe(6);
    });
  });

  describe('Gets the first item that matches regex', () => {
    it('accepts string to match', () => {
      expect(_.getFirstMatch('EFG', 'ABCDEFGH')).toBe('EFG');
    });

    it('accepts regex to match', () => {
      expect(_.getFirstMatch(/EFG/, 'ABCDEFGH')).toBe('EFG');
    });

    it('accepts number to match', () => {
      expect(_.getFirstMatch(123, 'ABCD123EFGH')).toBe('123');
    });
  });

  describe('Checks if a value is falsy or empty', () => {
    it('undefined is falsy', () => {
      expect(_.isNothing(undefined)).toBe(true);
    });

    it('empty string is falsy', () => {
      expect(_.isNothing('')).toBe(true);
    });

    it('empty Array is falsy', () => {
      expect(_.isNothing([])).toBe(true);
    });

    it('empty Object is falsy', () => {
      expect(_.isNothing({})).toBe(true);
    });

    it('Array is not falsy', () => {
      expect(_.isNothing([1, 2, 3])).toBe(false);
    });
  });

  describe('Calculates percentage for used memory (1 - x * 100)', () => {
    it('calculates used memory for valid input', () => {
      expect(_.getUsedMemoryForSingle(0.3)).toBe(70);
    });

    it('calculates used memory for junky input', () => {
      expect(_.getUsedMemoryForSingle(undefined)).toBe(0);
    });

    it('calculates used memory for number greater than 1', () => {
      expect(_.getUsedMemoryForSingle(2)).toBe(0);
    });

    it('calculates used memory for stringy number', () => {
      expect(_.getUsedMemoryForSingle('0.15')).toBe(85);
    });
  });

  describe('Calculates average of values in a list', () => {
    it('calculates average for valid values', () => {
      expect(_.getAverageForList([1, 2, 3])).toBe(2);
    });

    it('ignores invalid values while averaging', () => {
      expect(_.getAverageForList([1, 2, 3, null])).toBe(2);
    });

    it('takes stringy numbers into account while averaging', () => {
      expect(_.getAverageForList([1, 2, '3'])).toBe(2);
    });
  });
});

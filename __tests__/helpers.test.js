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

  describe('Converts junky values to zero', () => {
    it('stringy numbers as numbers', () => {
      expect(_.defaultToZero('123')).toBe(123);
    });

    it('junky strings are zero', () => {
      expect(_.defaultToZero('abc')).toBe(0);
    });

    it('undefined is zero', () => {
      expect(_.defaultToZero(undefined)).toBe(0);
    });

    it('an Object is zero', () => {
      expect(_.defaultToZero({ a: 1 })).toBe(0);
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
      expect(_.sum(2, 2)).toBe(4);
    });

    it('adds a number and a stringy number', () => {
      expect(_.sum(2, '2')).toBe(4);
    });

    it('adds a number and a junky value', () => {
      expect(_.sum(2, null)).toBe(2);
    });

    it('adds two junky values', () => {
      expect(_.sum(undefined, null)).toBe(0);
    });
  });

  describe('Sums up values in an Array or Object safely', () => {
    it('adds values in an Array', () => {
      expect(_.sumList([1, 2, 3])).toBe(6);
    });

    it('adds values in an Object', () => {
      expect(_.sumList({ a: 1, b: 2, c: undefined })).toBe(3);
    });

    it('sum of a number is that number', () => {
      expect(_.sumList(25)).toBe(25);
    });

    it('sum of a stringy number is that number', () => {
      expect(_.sumList('25')).toBe(25);
    });

    it('sum of a junky is zero', () => {
      expect(_.sumList('abc')).toBe(0);
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

  describe('Logs value and returns it', () => {
    it('logs number with label', () => {
      expect(_.logger('some number', 123)).toBe(123);
    });

    it('logs object with label', () => {
      expect(_.logger('some Object', { a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
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
});

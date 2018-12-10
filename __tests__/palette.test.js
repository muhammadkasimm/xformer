import * as _ from '../src/palette';

describe('Test palette functions', () => {
  describe('Picks value at specified path from an Object or Array', () => {
    it('picks values by keys only', () => {
      expect(_.pickFrom(['a', 'b', 'c'], { a: { b: { c: 1 } } })).toBe(1);
    });

    it('picks values by keys and index', () => {
      expect(_.pickFrom(['a', 'b', 0, 'c'], { a: { b: [{ c: 1 }] } })).toBe(1);
    });

    it('picks values from an Array', () => {
      expect(_.pickFrom([0], [1, 2, 3])).toBe(1);
    });
  });

  describe('Keeps only keys from an Object that match regex', () => {
    const mockObj = { a1: 1, a2: 2, b1: 1, b2: 2 };

    it('uses string for matching', () => {
      expect(_.pickByRegex('a', mockObj)).toEqual({ a1: 1, a2: 2 });
    });

    it('uses regex for matching', () => {
      expect(_.pickByRegex(/a1/, mockObj)).toEqual({ a1: 1 });
    });

    it('uses number for matching', () => {
      expect(_.pickByRegex(1, mockObj)).toEqual({ a1: 1, b1: 1 });
    });

    it('empty Object on falsey value', () => {
      expect(_.pickByRegex(undefined, mockObj)).toEqual({});
    });

    it('empty Object when nothing matches', () => {
      expect(_.pickByRegex(/c/, mockObj)).toEqual({});
    });
  });

  describe('Merges list of Objects by adding values of the same key', () => {
    it('merges list of Objects', () => {
      expect(_.mergeWithAdd([{ a: 1 }, { a: 2 }, { a: 3 }])).toEqual({ a: 6 });
    });

    it('merges values of an Object that are of Object type', () => {
      expect(_.mergeWithAdd({ a: { x: 1 }, b: { x: 2 }, c: [1, 2, 3] })).toEqual({ x: 3 });
    });

    it('empty Object when none of the values in provied Object are of Object type', () => {
      expect(_.mergeWithAdd({ a: [1, 2], b: undefined, c: 'hello' })).toEqual({});
    });
  });

  describe('Merges list of Objects by subtracting values of the same key', () => {
    it('merges list of Objects', () => {
      expect(_.mergeWithSubtract([{ a: 1 }, { a: 2 }, { a: 3 }])).toEqual({ a: 2 });
    });

    it('merges values of an Object that are of Object type', () => {
      expect(_.mergeWithSubtract({ a: { x: 1 }, b: { x: 2 }, c: [1, 2, 3] })).toEqual({ x: 1 });
    });

    it('empty Object when none of the values in provied Object are of Object type', () => {
      expect(_.mergeWithSubtract({ a: [1, 2], b: undefined, c: 'hello' })).toEqual({});
    });
  });

  describe('Applies differential logic (i.e x[i] = x[i] - x[i-1]) on an Object or Array', () => {
    it('subtracts values of an Object', () => {
      expect(_.differential({ a: 1, b: 2, c: 3 })).toEqual({ b: 1, c: 1 });
    });

    it('subtracts values of an Array', () => {
      expect(_.differential([1, 2, 3])).toEqual([1, 1]);
    });

    it('empty Array when only one item in Array', () => {
      expect(_.differential([1])).toEqual([]);
    });
  });

  describe('Sums up all values in an Array or Object', () => {
    it('sums values in an Array', () => {
      expect(_.sumAll([1, 2, 3])).toBe(6);
    });

    it('sums values in an Object', () => {
      expect(_.sumAll({ a: 1, b: 2, c: 3 })).toBe(6);
    });

    it('ignores junky values when summing', () => {
      expect(_.sumAll([1, 2, 3, undefined, 'abc'])).toBe(6);
    });
  });

  describe('Defaults all values in an Array or Object', () => {
    it('defaults values in an Array', () => {
      expect(_.defaultAll('N/A', [1, NaN, '3'])).toEqual([1, 'N/A', 3]);
    });

    it('defaults values in an Object', () => {
      expect(_.defaultAll(0, { a: 1, b: Infinity, c: 3 })).toEqual({ a: 1, b: 0, c: 3 });
    });

    it('defaults a simple number', () => {
      expect(_.defaultAll(100, Infinity)).toBe(100);
    });
  });

  describe('Calculates used memory for any input', () => {
    it('calculates used memory for Array', () => {
      expect(_.getUsedMemory([0.1, 0.2, 0.3])).toEqual([90, 80, 70]);
    });

    it('calculates used memory for Object', () => {
      expect(_.getUsedMemory({ a: 0.1, b: 0.2, c: 0.3 })).toEqual({ a: 90, b: 80, c: 70 });
    });
  });

  describe('Calculates average of values in an Array or Object', () => {
    it('calculates average of items in a list', () => {
      expect(_.getAvg([1, 2, 3])).toBe(2);
    });

    it('calculates average of items in an Object', () => {
      expect(_.getAvg({ a: 1, b: 2, c: 3 })).toBe(2);
    });

    it('calculates average of an empty Object', () => {
      expect(_.getAvg({})).toBe(0);
    });

    it('average of a number (or stringy number) is the number itself', () => {
      expect(_.getAvg(2)).toBe(2);
    });

    it('average of a junky value is zero', () => {
      expect(_.getAvg(false)).toBe(0);
    });
  });

  describe('Maps an Array or Object', () => {
    it('maps an array with single action', () => {
      expect(_.map(['sumAll'], [[20, 30], [40, 50]])).toEqual([50, 90]);
    });

    it('maps an array with multiple actions', () => {
      expect(_.map(['sumAll', 'getRate(100)'], [[20, 30], [40, 50]])).toEqual([0.5, 0.9]);
    });

    it('maps an array with multiple actions on each item using runAll', () => {
      expect(
        _.map(
          [
            {
              name: 'runAll',
              params: [[['sumAll', 'getRate(100)'], ['getAvg']]]
            }
          ],
          [[20, 30], [40, 50]]
        )
      ).toEqual([[0.5, 25], [0.9, 45]]);
    });
  });

  describe('Sorts an Array or Object in ascending order', () => {
    it('sorts an array of numbers', () => {
      expect(_.sortAscending(null, [3, 2, 1])).toEqual([1, 2, 3]);
    });

    it('sorts an array of strings', () => {
      expect(_.sortAscending(null, ['efg', 'uvx', 'jkl'])).toEqual(['efg', 'jkl', 'uvx']);
    });

    it('sorts an array of arrays', () => {
      expect(_.sortAscending(1, [[1, 345], [2, 45], [3, 121]])).toEqual([
        [2, 45],
        [3, 121],
        [1, 345]
      ]);
    });

    it('sorts an object w.r.t keys', () => {
      expect(_.sortAscending(0, { jkl: 345, efg: 121, uvx: 45 })).toEqual([
        ['efg', 121],
        ['jkl', 345],
        ['uvx', 45]
      ]);
    });

    it('sorts an object w.r.t values', () => {
      expect(_.sortAscending(1, { jkl: 345, efg: 121, uvx: 45 })).toEqual([
        ['uvx', 45],
        ['efg', 121],
        ['jkl', 345]
      ]);
    });
  });

  describe('Sorts an Array or Object in descending order', () => {
    it('sorts an array of numbers', () => {
      expect(_.sortDescending(null, [3, 2, 1])).toEqual([3, 2, 1]);
    });

    it('sorts an array of strings', () => {
      expect(_.sortDescending(null, ['efg', 'uvx', 'jkl'])).toEqual(['uvx', 'jkl', 'efg']);
    });

    it('sorts an array of arrays', () => {
      expect(_.sortDescending(1, [[1, 345], [2, 45], [3, 121]])).toEqual([
        [1, 345],
        [3, 121],
        [2, 45]
      ]);
    });

    it('sorts an object w.r.t keys', () => {
      expect(_.sortDescending(0, { jkl: 345, efg: 121, uvx: 45 })).toEqual([
        ['uvx', 45],
        ['jkl', 345],
        ['efg', 121]
      ]);
    });

    it('sorts an object w.r.t values', () => {
      expect(_.sortDescending(1, { jkl: 345, efg: 121, uvx: 45 })).toEqual([
        ['jkl', 345],
        ['efg', 121],
        ['uvx', 45]
      ]);
    });
  });
});

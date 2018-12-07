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
});

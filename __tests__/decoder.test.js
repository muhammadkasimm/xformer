import * as R from 'ramda';
import * as D from '../src/decoder';

describe('Decodes actions correctly', () => {
  describe('Decodes stringy actions correctly', () => {
    it('decodes stringy action', () => {
      expect(D.decodeStringyAction('getAvg([1, 2, 3])')).toBe(2);
    });

    it('decodes stringy action with extra params', () => {
      expect(D.decodeStringyAction('getRate(2, [1, 2, 3])')).toEqual([0.5, 1, 1.5]);
    });

    it('decodes stringy action with another action as param', () => {
      expect(D.decodeStringyAction('getRate(2, "X.getAvg([1, 2, 3])")')).toBe(1);
    });
  });

  describe('Decodes object actions correctly', () => {
    it('decodes simple object action with data only', () => {
      expect(D.decodeObjectAction({ name: 'getAvg', params: [[1, 2, 3]] })).toBe(2);
    });

    it('decodes stringy action with extra params', () => {
      expect(D.decodeObjectAction({ name: 'getRate', params: [2, [1, 2, 3]] })).toEqual([
        0.5,
        1,
        1.5
      ]);
    });

    it('decodes object action with another object action as param', () => {
      expect(
        D.decodeObjectAction({
          name: 'getRate',
          params: [2, { name: 'getAvg', params: [[1, 2, 3]] }]
        })
      ).toBe(1);
    });

    it('decodes object action with a string action as param', () => {
      expect(
        D.decodeObjectAction({
          name: 'getRate',
          params: [2, 'X.getAvg([1, 2, 3])']
        })
      ).toBe(1);
    });

    it('decodes nested object actions', () => {
      expect(
        D.decodeObjectAction({
          name: 'runAll',
          params: [
            [
              [
                { name: 'pickFrom', params: [['alpha', '*']] },
                'mergeWithAdd',
                { name: 'getRate', params: [10] }
              ],
              [
                { name: 'pickFrom', params: [['beta', 'beta_2']] },
                'getAvg',
                { name: 'getRate', params: [10] }
              ]
            ],
            {
              alpha: {
                alpha_1: {
                  a1: 3,
                  a2: 5,
                  a3: 7
                },
                alpha_2: {
                  a1: 33,
                  a2: 55,
                  a3: 77
                }
              },
              beta: {
                beta_2: {
                  a1: 22,
                  a2: 44,
                  a3: 66
                }
              }
            }
          ]
        })
      ).toEqual([{ a1: 3.6, a2: 6.0, a3: 8.4 }, 4.4]);
    });

    it('decodes object actions but returns curried forms when params not given', () => {
      expect(D.decodeObjectAction({ name: 'getAvg' })([2, 4, 6])).toEqual(4);
    });

    it('decodes object actions with custom functions', () => {
      expect(
        D.decodeObjectAction({
          name: 'customAdd',
          fn: (a, b) => a + b + 1,
          params: [1, 2]
        })
      ).toEqual(4);
    });
  });

  describe('Decodes a pipe of actions', () => {
    it('decodes a pipe with all stringy actions', () => {
      expect(
        R.pipe(...D.decodePipe(['pickFrom(["*", 1])', 'getAvg']))([
          [0, 24],
          [1, 48],
          [2, 72],
          [3, 96]
        ])
      ).toBe(60);
    });

    it('decodes a pipe with all object actions', () => {
      expect(
        R.pipe(
          ...D.decodePipe([
            {
              name: 'pickFrom',
              params: [['*', 1]]
            },
            {
              name: 'getAvg'
            },
            { name: 'multiplyBy2', fn: x => x * 2 }
          ])
        )([[0, 24], [1, 48], [2, 72], [3, 96]])
      ).toBe(120);
    });

    it('decodes a pipe with with mixed actions', () => {
      expect(
        R.pipe(
          ...D.decodePipe([
            'pickFrom(["*", 1])',
            'getAvg',
            { name: 'multiplyBy2', fn: x => x * 2 },
            { name: 'curriedInc', fn: R.curry((x, y) => x + y), params: [1] }
          ])
        )([[0, 24], [1, 48], [2, 72], [3, 96]])
      ).toBe(121);
    });
  });

  describe('Picks name of actions correctly', () => {
    it('names a stringy action correctly', () => {
      expect(D.getActionName('pickFrom(["*", 1])')).toBe('pickFrom(["*", 1])');
    });

    it('names an object action correctly', () => {
      expect(D.getActionName({ name: 'pickFrom', params: [['*', 1]] })).toBe('pickFrom(["*", 1])');
    });

    it('names a combo stringy action correctly', () => {
      expect(D.getActionName(['getAvg', 'getRate(2)'])).toBe('getAvg, getRate(2)');
    });

    it('names a custom action correctly', () => {
      expect(
        D.getActionName({ name: 'customAdd', fn: R.curry((x, y) => x + y), params: [1] })
      ).toBe('customAdd(1)');
    });

    it('names an anonymous custom action correctly', () => {
      expect(D.getActionName({ fn: R.curry((x, y) => x + y), params: [1] })).toBe(
        '_anonymousFn_(1)'
      );
    });
  });

  describe('Picks info of actions correctly', () => {
    it('picks info of a stringy action correctly', () => {
      expect(D.getActionInfo('pickFrom(["*", 1])')).toBe(
        'Retrieves value at the specified path from a JSON object. "*" in the path is regarded as a wildcard, meaning anything at this level will used to pick value from.'
      );
    });

    it('picks info of an object action correctly', () => {
      expect(D.getActionInfo({ name: 'pickFrom', params: [['*', 1]] })).toBe(
        'Retrieves value at the specified path from a JSON object. "*" in the path is regarded as a wildcard, meaning anything at this level will used to pick value from.'
      );
    });

    it('picks info of a combo stringy action correctly', () => {
      expect(D.getActionInfo(['getAvg', 'getRate(2)'])).toBe(
        'Calculates average of values in a list or JSON object; ignores values that are not numbers.\nCalculates rate by dividing each value in a list or JSON object by the provided interval; ignores values that are not numbers.'
      );
    });

    it('picks info of a custom action correctly', () => {
      expect(
        D.getActionInfo({ name: 'customAdd', fn: R.curry((x, y) => x + y), params: [1] })
      ).toBe('No description available.');
    });

    it('picks info of an anonymous custom action correctly', () => {
      expect(
        D.getActionInfo({ fn: R.curry((x, y) => x + y), params: [1], info: 'Hello, world!' })
      ).toBe('Hello, world!');
    });
  });
});

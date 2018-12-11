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
      // 'getRate(2, )')
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
  });
});

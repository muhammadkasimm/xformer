import * as _ from '../src/parser';
import { pickFrom } from '../src/palette';

const mockData = {
  a_1: {
    a1: 2,
    a2: 4,
    a3: 6,
    a4: 8,
    a5: 10
  },
  a_2: {
    a1: 22,
    a2: 24,
    a3: 26,
    a4: 28,
    a5: 30
  }
};

describe('Parses xFormer queries', () => {
  it('parses queries containing strings', () => {
    const parsed = _.parser(
      {
        1: ['pickByRegex("a_")', 'mergeWithAdd', 'differential']
      },
      mockData
    );

    expect(parsed['1'].result).toEqual({ a2: 4, a3: 4, a4: 4, a5: 4 });
  });

  it('parses queries containing objects', () => {
    const parsed = _.parser(
      {
        1: [
          { name: 'pickByRegex', params: ['a_'] },
          { name: 'mergeWithAdd' },
          { name: 'differential', params: [] }
        ]
      },
      mockData
    );

    expect(parsed['1'].result).toEqual({ a2: 4, a3: 4, a4: 4, a5: 4 });
  });

  it('parses queries containing combo actions', () => {
    const parsed = _.parser(
      {
        1: [
          [{ name: 'pickFrom', params: [['a_1']] }, { name: 'pickFrom', params: [['a_2']] }],
          { name: 'mergeWithAdd' },
          { name: 'differential', params: [] }
        ]
      },
      mockData
    );

    expect(parsed['1'].result).toEqual({ a2: 4, a3: 4, a4: 4, a5: 4 });
  });

  it('parses queries containing mixed type actions', () => {
    const parsed = _.parser(
      {
        1: [
          [{ name: 'pickFrom', params: [['a_1']] }, { name: 'pickFrom', params: [['a_2']] }],
          'mergeWithAdd',
          { name: 'differential', params: [] }
        ]
      },
      mockData
    );

    expect(parsed['1'].result).toEqual({ a2: 4, a3: 4, a4: 4, a5: 4 });
  });
});

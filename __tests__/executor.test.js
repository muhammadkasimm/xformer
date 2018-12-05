import * as R from 'ramda';
import E from '../src/main';
// import * as E from '../src/executor';
import { pickFrom, mergeWithSubtract } from '../src/palette';

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
    const parsed = E.execute(
      {
        1: ['pickByRegex("a_")', 'mergeWithAdd', 'differential']
      },
      mockData
    );

    expect(parsed['1'].result).toEqual({ a2: 4, a3: 4, a4: 4, a5: 4 });
  });

  it('parses queries containing objects', () => {
    const parsed = E.execute(
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
    const parsed = E.execute(
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
    const parsed = E.execute(
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

  it('parses listy query with executeAll', () => {
    const parsed = E.execute(
      {
        1: [
          {
            name: 'runAll',
            params: [[['pickByRegex("a")', 'mergeWithAdd'], ['pickByRegex("b")', 'mergeWithAdd']]]
          },
          'mergeWithSubtract'
        ]
      },
      {
        a1: { abc: 1, xyz: 2 },
        a2: { abc: 11, xyz: 2 },
        a3: { abc: 13, xyz: 6 },
        b1: { abc: 1, xyz: 2 },
        b2: { abc: 11, xyz: 2 },
        b3: { abc: 14, xyz: 7 }
      }
    );

    expect(parsed['1'].result).toEqual({ abc: 1, xyz: 1 });
  });

  it('parses stringy action with external dependencies', () => {
    const parsed = E.execute(
      {
        1: ['pickByRegex("a_")', 'mergeWithAdd', 'differential', 'getRate("$.INTERVAL")']
      },
      mockData,
      { INTERVAL: 4 }
    );

    expect(parsed['1'].result).toEqual({ a2: 1, a3: 1, a4: 1, a5: 1 });
  });

  it('parses object action with external dependencies', () => {
    const parsed = E.execute(
      {
        1: [
          { name: 'pickByRegex', params: ['a_'] },
          'mergeWithAdd',
          'differential',
          { name: 'getRate', params: ['$.INTERVAL'] }
        ]
      },
      mockData,
      { INTERVAL: 4 }
    );

    expect(parsed['1'].result).toEqual({ a2: 1, a3: 1, a4: 1, a5: 1 });
  });

  it('executes a single pipe', () => {
    const parsed = E.executePipe(
      [
        { name: 'pickByRegex', params: ['a_'] },
        'mergeWithAdd',
        'differential',
        { name: 'getRate', params: ['$.INTERVAL'] }
      ],
      mockData,
      { INTERVAL: 4 }
    );

    expect(parsed.result).toEqual({ a2: 1, a3: 1, a4: 1, a5: 1 });
  });
});

import moment from 'moment';
import {
  camelCaseObject,
  deleteItemAtIndex,
  filterByPredicate,
  isObjectEmpty,
  replaceItemAtIndex,
  snakeCaseObject,
  isWithinDates,
} from 'lib/utils';

describe('utils', () => {
  describe('deleteItemAtIndex', () => {
    it('returns a new array', () => {
      const arr = [0, 1, 2, 3, 4];
      const expected = [0, 1, 3, 4];
      const result = deleteItemAtIndex(2)(arr);

      expect(result).not.toBe(arr);
      expect(result).toEqual(expected);
    });

    it('deletes the item at the index', () => {
      const arr = [0, 1, 2, 3, 4];
      const expected = [0, 1, 3, 4];

      const result = deleteItemAtIndex(2)(arr);

      expect(result).toEqual(expected);
    });
  });

  describe('filterByPredicate', () => {
    const keys = ['foo', 'bar'];
    const data = [
      { foo: 'hi', bar: 'yo' },
      { foo: 'dawg', bar: 'zing', baz: 'zoop' },
      { foo: 5, bar: new Date(2008, 9, 11), baz: 'hi' },
      { foo: null, bar: undefined, baz: undefined },
    ];

    it('returns a list of matching items', () => {
      const a = filterByPredicate('yo', keys)(data);
      const b = filterByPredicate('dawg', keys)(data);

      expect(a).toEqual([data[0]]);
      expect(b).toEqual([data[1]]);
    });

    it('returns all results when the predicate is empty', () => {
      const result = filterByPredicate('', keys)(data);

      expect(result).toEqual(data);
    });

    it('returns results for non-string properties', () => {
      const numeric = filterByPredicate('5', keys)(data);
      const date = filterByPredicate('2008', keys)(data);

      expect(numeric).toEqual([data[2]]);
      expect(date).toEqual([data[2]]);
    });
  });

  describe('isObjectEmpty', () => {
    it('returns true for objects that are empty', () => {
      const emptyObj = {
        1: undefined,
        2: '',
        3: null,
      };

      expect(isObjectEmpty(emptyObj)).toEqual(true);
    });

    it('returns false for objects that are not completely empty', () => {
      const notEmptyObj1 = {
        1: '',
        2: '',
        3: 'hello',
      };

      const notEmptyObj2 = {
        1: undefined,
        2: '1234',
        3: null,
      };

      expect(isObjectEmpty(notEmptyObj1)).toEqual(false);
      expect(isObjectEmpty(notEmptyObj2)).toEqual(false);
    });
  });

  describe('replaceItemAtIndex', () => {
    it('returns a new array', () => {
      const arr = [1, 2, 3, 4, 5];
      const expected = [1, 2, 5, 4, 5];
      const result = replaceItemAtIndex(2, 5)(arr);

      expect(result).not.toBe(arr);
      expect(result).toEqual(expected);
    });

    it('replaces just the item at the index', () => {
      const arr = [1, 2, 3, 4, 5];
      const expected = [1, 2, 9, 4, 5];

      expect(replaceItemAtIndex(2, 9)(arr)).toEqual(expected);
    });
  });

  describe('snakeCaseObject', () => {
    it('returns object with snakecase keys', () => {
      const input = {
        id: 10,
        addedBy: 'name',
        nestedObject: {
          propertyName: 5,
        },
        nestedListOfObjects: [
          {
            camelCaseYo: 5,
          },
          {
            camelCaseYo: 10,
          },
        ],
        nestedListOfValues: [
          'foo',
          'bar',
        ],
      };

      const expected = {
        id: 10,
        added_by: 'name',
        nested_object: {
          property_name: 5,
        },
        nested_list_of_objects: [
          {
            camel_case_yo: 5,
          },
          {
            camel_case_yo: 10,
          },
        ],
        nested_list_of_values: [
          'foo',
          'bar',
        ],
      };

      expect(snakeCaseObject(input)).toEqual(expected);
    });
  });

  describe('camelCaseObject', () => {
    it('returns object with camelcase keys', () => {
      const input = {
        id: 10,
        added_by: 'name',
        nested_object: {
          property_name: 5,
        },
      };

      const expected = {
        id: 10,
        addedBy: 'name',
        nestedObject: {
          propertyName: 5,
        },
      };

      expect(camelCaseObject(input)).toEqual(expected);
    });
  });

  describe('isWithinDates', () => {
    const startDate = moment('2016-05-01');
    const endDate = moment('2016-07-01');

    it('returns false when date is earlier than start date', () => {
      const date = moment('2016-04-01');

      expect(isWithinDates(date, startDate, endDate)).toEqual(false);
    });

    it('returns false when date is later than end date', () => {
      const date = moment('2016-07-15');

      expect(isWithinDates(date, startDate, endDate)).toEqual(false);
    });

    it('returns true when date is within start and end date', () => {
      const date = moment('2016-06-12');

      expect(isWithinDates(date, startDate, endDate)).toEqual(true);
    });

    it('returns true when start date and end date are not null', () => {
      const date = moment('2016-06-12');

      expect(isWithinDates(date, null, null)).toEqual(true);
    });

    it('returns true when start date is set and end date is null', () => {
      const date = moment('2016-06-12');

      expect(isWithinDates(date, startDate, null)).toEqual(true);
    });

    it('returns true when start date is not set and end date is set', () => {
      const date = moment('2016-06-12');

      expect(isWithinDates(date, null, endDate)).toEqual(true);
    });

    it('returns false when date is before the start date', () => {
      const date = moment('2016-04-12');

      expect(isWithinDates(date, startDate, null)).toEqual(false);
    });

    it('returns false when date is after the end date', () => {
      const date = moment('2016-08-12');

      expect(isWithinDates(date, null, endDate)).toEqual(false);
    });
  });
});

import { recurseDivisionsOfParent } from 'store/administrative-divisions/administrative-divisions-selectors';

describe('administrativeDivisions', () => {
  const administrativeDivisions = [
    { id: 1, name: 'Flemish', level: 'region', parentId: null },
    { id: 2, name: 'Antwerp', level: 'province', parentId: 1 },
    { id: 3, name: 'Mechelen', level: 'district', parentId: 2 },
    { id: 5, name: 'Willebroek', level: 'municipality', parentId: 3 },
    { id: 6, name: 'Puurs', level: 'municipality', parentId: 3 },
    { id: 4, name: 'Turnhout', level: 'district', parentId: 2 },
    { id: 7, name: 'Grobbendonk', level: 'municipality', parentId: 4 },
    { id: 8, name: 'West Flanders', level: 'province', parentId: 1 },
    { id: 9, name: 'Bruges', level: 'district', parentId: 8 },
    { id: 10, name: 'Zuienkerke', level: 'municipality', parentId: 9 },
  ];

  describe('recurseDivisionsOfParent', () => {
    it('returns all administrative divisions under the supplied parent (inclusive)', () => {
      expect(recurseDivisionsOfParent([2], administrativeDivisions)).toEqual([
        { id: 2, name: 'Antwerp', level: 'province', parentId: 1 },
        { id: 3, name: 'Mechelen', level: 'district', parentId: 2 },
        { id: 4, name: 'Turnhout', level: 'district', parentId: 2 },
        { id: 5, name: 'Willebroek', level: 'municipality', parentId: 3 },
        { id: 6, name: 'Puurs', level: 'municipality', parentId: 3 },
        { id: 7, name: 'Grobbendonk', level: 'municipality', parentId: 4 },
      ]);
    });
  });
});

export const SET_CLAIM_FILTERS = 'SET_CLAIM_FILTERS';

export const setClaimFilters = payload => ({ type: SET_CLAIM_FILTERS, payload });

export const CLEAR_CLAIM_FILTERS = 'CLEAR_CLAIM_FILTERS';

export const clearClaimFilters = () => ({ type: CLEAR_CLAIM_FILTERS });

export const SET_CLAIM_SEARCH = 'SET_CLAIM_SEARCH';

export const setClaimSearch = payload => ({ type: SET_CLAIM_SEARCH, payload });

export const CLEAR_CLAIM_SEARCH = 'CLEAR_CLAIM_SEARCH';

export const clearClaimSearch = () => ({ type: CLEAR_CLAIM_SEARCH });

export const STORE_FETCHED_CLAIM_IDS = 'STORE_FETCHED_CLAIM_IDS';

export const storeFetchedClaimIds = (ids, clear = true) => ({ type: STORE_FETCHED_CLAIM_IDS, payload: { ids, clear } });

export const SET_SHOW_FILTERS = 'SET_SHOW_FILTERS';

export const setShowFilters = payload => ({ type: SET_SHOW_FILTERS, payload });

export const SET_SHOW_SEARCH = 'SET_SHOW_SEARCH';

export const setShowSearch = payload => ({ type: SET_SHOW_SEARCH, payload });

export const SET_CLAIM_SORT = 'SET_CLAIM_SORT';

export const setClaimSort = payload => ({ type: SET_CLAIM_SORT, payload });

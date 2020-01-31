import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { isNil } from 'lodash/fp';

import NullValue from 'components/null-value';

/**
 * Component
 */

const PriceStatsList = ({ items }) => (
  <PriceStatsListContainer>
    {items.map(item => (
      <Item key={item.key}>
        <Label>{item.label || item.key}</Label>
        <ValueAndPriceContainer>
          <Value>
            {isNil(item.value) ? <NullValue /> : item.value}
          </Value>
          <Price>
            {isNil(item.price) ? <NullValue /> : item.price}
          </Price>
        </ValueAndPriceContainer>
      </Item>
    ))}
  </PriceStatsListContainer>
);

PriceStatsList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.node,
    price: PropTypes.node,
  })).isRequired,
};

/**
 * Styles
 */

const PriceStatsListContainer = styled.dl`
  padding-left: ${props => props.theme.space[4]};
  padding-right: ${props => props.theme.space[4]};
  line-height: 1.2;
`;

const Item = styled.div`
  padding-top: ${props => props.theme.space[4]};
  padding-bottom: ${props => props.theme.space[4]};
  border-bottom: 1px #f2f2f2 solid;
  :first-of-type {
    border-top: 1px #f2f2f2 solid;
  }
`;

const ValueAndPriceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const Label = styled.p`
  color: #868e96;
`;

const Value = styled.p`
  font-size: 16px;
`;

const Price = styled.p`
  font-size: 16px;
`;

/**
 * Exports
 */

export default PriceStatsList;

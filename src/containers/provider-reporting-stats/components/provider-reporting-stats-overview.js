import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formatCurrency, formatCurrencyWithLabel } from 'lib/formatters/currency';

import Box from 'components/box';
import { Text } from 'components/text';
import LargeStatsDisplay from 'components/large-stats-display';
import PriceStatsList from 'components/price-stats-list';

class ProviderReportingStatsOverview extends PureComponent {
  render() {
    const { stats } = this.props;
    return (
      <Box>
        <Box marginTop={5} marginBottom={5}>
          <LargeStatsDisplay
            stats={[
              { label: 'Submitted', value: stats.total.claimsCount },
              { label: 'Total', value: formatCurrencyWithLabel(stats.total.price) },
            ]}
          />
        </Box>
        <Box>
          <PriceStatsList
            items={[
              { key: 'Approved', value: stats.approved.claimsCount, price: formatCurrency(stats.approved.totalPrice) },
              { key: 'Rejected', value: stats.rejected.claimsCount, price: formatCurrency(stats.rejected.totalPrice) },
              { key: 'Returned', value: stats.returned.claimsCount, price: formatCurrency(stats.returned.totalPrice) },
              { key: 'Pending', value: stats.pending.claimsCount, price: formatCurrency(stats.pending.totalPrice) },
            ]}
          />
        </Box>
        <Box marginLeft={4} marginTop={5}>
          <Text>{`${stats.resubmittedCount} additional resubmissions during report period`}</Text>
        </Box>
      </Box>
    );
  }
}

ProviderReportingStatsOverview.propTypes = {
  stats: PropTypes.shape({}).isRequired,
};

export default ProviderReportingStatsOverview;

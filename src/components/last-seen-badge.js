import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from '@emotion/styled';

const Badge = styled.div`
  display: inline-block;
  padding: 0 6px;
  border-radius: 9999px;
  background-color: ${props => (props.yellow ? props.theme.colors.yellow[4] : props.theme.colors.gray[2])};
  height: 19px;
  font-size: 11px;
  line-height: 20px;
  vertical-align: middle;
`;

const HOUR_IN_MINUTES = 60;
const DAY_IN_MINUTES = 60 * 24;

const roundToHalf = (n) => {
  const val = (Math.floor(n * 2) / 2);
  return Number.isInteger(val) ? val : val.toFixed(1);
};

const LastSeenBadge = ({ lastSeenAt, warningThreshold = 90 }) => {
  const currentTimeMoment = moment(new Date(), moment.ISO_8601);
  const lastSeenAtMoment = moment(lastSeenAt, moment.ISO_8601);

  const diff = currentTimeMoment.diff(lastSeenAtMoment, 'minutes');
  const warning = diff > warningThreshold;

  let label;

  if (diff < HOUR_IN_MINUTES) {
    label = `${diff}m`;
  } else if (diff < DAY_IN_MINUTES) {
    label = `${roundToHalf(diff / HOUR_IN_MINUTES)}h`;
  } else {
    label = `${Math.floor(diff / DAY_IN_MINUTES)}d`;
  }

  return (
    <Badge yellow={warning}>{label}</Badge>
  );
};

LastSeenBadge.propTypes = {
  lastSeenAt: PropTypes.string.isRequired,
  warningThreshold: PropTypes.number,
};

LastSeenBadge.defaultProps = {
  warningThreshold: 90,
};

export default LastSeenBadge;

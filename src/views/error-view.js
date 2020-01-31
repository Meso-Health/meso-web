import React from 'react';

import { CONTACT_EMAIL } from 'lib/config';
import { ErrorLayout } from 'components/layouts';
import { ViewTitle, Paragraph } from 'components/text';
import { UnderlinedLink } from 'components/links';

/**
 * View
 */

const ErrorView = () => (
  <ErrorLayout pageTitle="Error">
    <ViewTitle>Error!</ViewTitle>
    <Paragraph maxWidth="450px" style={{ margin: '24px auto' }}>
      {'You may want to head back '}
      <UnderlinedLink to="/">to the homepage</UnderlinedLink>
      {', or '}
      <UnderlinedLink to={`mailto:${CONTACT_EMAIL}`}>contact support</UnderlinedLink>
      {' if the issue continues.'}
    </Paragraph>
  </ErrorLayout>
);

/**
 * Exports
 */

export default ErrorView;

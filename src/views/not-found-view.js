import React from 'react';

import { ErrorLayout } from 'components/layouts';
import { ViewTitle, Paragraph } from 'components/text';
import { UnderlinedLink } from 'components/links';

const NotFoundView = () => (
  <ErrorLayout pageTitle="Not Found">
    <ViewTitle>Sorry! We couldn&rsquo;t find that page!</ViewTitle>
    <Paragraph marginVertical={4}>
      {'You may want to head back '}
      <UnderlinedLink to="/">to the homepage</UnderlinedLink>
      .
    </Paragraph>
  </ErrorLayout>
);

export default NotFoundView;

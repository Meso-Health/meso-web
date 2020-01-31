import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Icon from 'components/icon';
import { Link } from 'components/links';


const DividerContainer = styled.span`
  padding-left: ${props => props.theme.space[3]};
  padding-right: ${props => props.theme.space[3]};
  color: ${props => props.theme.colors.gray[5]};
  height: 9px;
`;

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  padding-top: ${props => props.theme.space[3]};
  padding-bottom: ${props => props.theme.space[3]};
`;

class Breadcrumb extends PureComponent {
  render() {
    const { steps, ...rest } = this.props;

    return (
      <BreadcrumbContainer {...rest}>
        {steps.map((step, i) => {
          const link = (
            <Link key={`${step.href}-${step.title}`} to={step.href}>
              {step.title}
            </Link>
          );

          if (i === steps.length - 1) {
            return link;
          }

          const divider = (
            <DividerContainer>
              <Icon name="direct-right" size={9} iconSize={9} />
            </DividerContainer>
          );

          return (
            <Fragment key={step.href}>
              {link}
              {divider}
            </Fragment>
          );
        })}
      </BreadcrumbContainer>
    );
  }
}

export default Breadcrumb;

Breadcrumb.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    href: PropTypes.string,
  })).isRequired,
};

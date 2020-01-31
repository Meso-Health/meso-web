import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { filter, find } from 'lodash/fp';

import styled from '@emotion/styled';

import Box from 'components/box';
import Button from 'components/button';
import Icon from 'components/icon';
import { Text } from 'components/text';
import { SearchDropdownPicker } from 'components/inputs';

class DiagnosisPicker extends PureComponent {
  handleSelectOption = (option) => {
    const { selectedDiagnoses, searchableDiagnoses } = this.props;
    const selectedDiagnosis = find(d => d.id === option.id)(searchableDiagnoses);
    const { handleSelect } = this.props;
    const updatedSelectedDiagnoses = [...selectedDiagnoses, selectedDiagnosis];
    handleSelect(updatedSelectedDiagnoses);
  }

  handleDeselectOption = (diagnosisId) => {
    const { handleSelect, selectedDiagnoses } = this.props;
    const updatedSelectedDiagnoses = filter(d => d.id !== diagnosisId)(selectedDiagnoses);
    handleSelect(updatedSelectedDiagnoses);
  }

  render() {
    const { searchableDiagnoses, selectedDiagnoses } = this.props;

    // These transformations are needed for the SearchDropdownPicker.
    const options = searchableDiagnoses.filter(searchableDiagnosis => (
      // Filter out the diagnoses that you have already selected.
      !selectedDiagnoses.map(selectedDiagnosis => selectedDiagnosis.id).includes(searchableDiagnosis.id)
    )).map(d => (
      { id: d.id, value: d.id, name: d.description, aliases: d.searchAliases }
    ));
    const selected = selectedDiagnoses.map(d => (
      { id: d.id, value: d.id, name: d.description, aliases: d.searchAliases }
    ));
    return (
      <List>
        <ListItem>
          <SearchDropdownPicker
            options={options}
            handleSelect={this.handleSelectOption}
            selected={selected}
          />
          <Box paddingLeft={3} paddingTop={3}>
            <Text color="gray.5" fontSize={2}>{selected.length === 1 ? '1 diagnosis' : `${selected.length} diagnoses`}</Text>
          </Box>
        </ListItem>
        {selectedDiagnoses.map(diagnosis => (
          <ListItem key={diagnosis.id} padding={2}>
            <Box paddingLeft={4}>{diagnosis.description}</Box>
            <Box flex aligItems="flex-end" marginLeft="auto">
              <Button icon onClick={() => this.handleDeselectOption(diagnosis.id)}><Icon name="clear" /></Button>
            </Box>
          </ListItem>
        ))}
      </List>
    );
  }
}

export default DiagnosisPicker;

DiagnosisPicker.propTypes = {
  selectedDiagnoses: PropTypes.arrayOf(PropTypes.shape({})),
  searchableDiagnoses: PropTypes.arrayOf(PropTypes.shape({})),
  handleSelect: PropTypes.func.isRequired,
};

DiagnosisPicker.defaultProps = {
  selectedDiagnoses: [],
  searchableDiagnoses: [],
};

const List = styled.dl`
  border-radius: 3px;
  line-height: 1.2;
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: ${props => props.theme.space[4]};
  padding-bottom: ${props => props.theme.space[4]};

  &:not(:first-of-type) {
    border-top: 1px ${props => props.theme.colors.gray[4]} solid;
  }
  &:first-of-type {
    display: block;
    padding-top: 0px;
  }
`;

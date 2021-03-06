// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import styled from 'styled-components';
import PanelHeaderAction from 'components/side-panel/panel-header-action';
import FieldSelector from 'components/common/field-selector';
import { Trash, Clock } from 'components/common/icons';
import SourceDataSelector from 'components/side-panel/source-data-selector';
import { StyledPanelHeader } from 'components/common/styled-components';
import * as Filters from 'components/filters';
import Checkbox from 'components/common/checkbox';

import { FILTER_TYPES, FILTER_COMPONENTS } from 'utils/filter-utils';
import { ALL_FIELD_TYPES } from 'constants/default-settings';

const StyledLabel = styled.div`
  font-size: 1.1em;
  font-weight:500;
  margin-bottom:10px;
`;

const StyledFilterPanel = styled.div`
  margin-bottom: 12px;
  border-radius: 1px;
  background-color: white;

  .filter-panel__filter {
    margin-top: 24px;
  }
`;

const StyledFilterHeader = StyledPanelHeader.extend`
  cursor: pointer;
  padding: 10px 12px;
`;

const StyledFilterContent = styled.div`
  background-color: ${props => props.theme.panelBackground};
  padding: 12px;
`;

const CheckboxContainer = styled.div`
  margin-bottom: 10px;
`;

const StyledResetButton = styled.div`
  background-color: ${props => props.theme.labelColor};
  color: ${props => props.theme.panelBackground};
  font-weight: 400;
  margin-top: 15px;
  padding: 5px;
  width: 30%;
  text-align: center;
  cursor: pointer;

  :hover {
    opacity: 0.7;
  }
`;

function AmenityFilterPanelFactory() {
  return class AmenityFilterPanel extends Component {
    static propTypes = {
      idx: PropTypes.number,
      filters: PropTypes.arrayOf(PropTypes.any).isRequired,
      filter: PropTypes.object.isRequired,
      setFilter: PropTypes.func.isRequired,
      removeFilter: PropTypes.func.isRequired,
      enlargeFilter: PropTypes.func.isRequired,
      toggleAnimation: PropTypes.func.isRequired,
      datasets: PropTypes.object,
      showDatasetTable: PropTypes.func,
      isAnyFilterAnimating: PropTypes.bool
    };


    /* selectors */
    fieldsSelector = props =>
      (props.filter.dataId && props.datasets[props.filter.dataId].fields) || [];
    filterSelector = props => props.filters;
    nameSelector = props => props.filter.name;
    dataIdSelector = props => props.filter.dataId;

    // only show current field and field that's not already been used as a filter
    availableFieldsSelector = createSelector(
      this.fieldsSelector,
      this.filterSelector,
      this.nameSelector,
      this.dataIdSelector,
      (fields, filters, name, dataId) =>
        fields.filter(
          f =>
            f.type &&
            f.type !== ALL_FIELD_TYPES.geojson &&
            (f.name === name ||
              !filters.find(d => d.name === f.name && d.dataId === dataId))
        )
    );

    onCheckedOption(checked, option) {
      const {
        datasets,
        enlargeFilter,
        filter,
        filters,
        idx,
        isAnyFilterAnimating,
        removeFilter,
        setFilter,
        toggleAnimation
      } = this.props;

      if (checked) {
        filter.value.splice(filter.value.indexOf(option), 1);
      } else {
        filter.value.push(option);
      }
      setFilter(idx, 'value', filter.value);
    }

    onResetClicked() {
      const {
        datasets,
        enlargeFilter,
        filter,
        filters,
        idx,
        isAnyFilterAnimating,
        removeFilter,
        setFilter,
        toggleAnimation
      } = this.props;

      filter.value = [];

      setFilter(idx, 'value', filter.value);
    }

    render() {
      const {
        datasets,
        enlargeFilter,
        filter,
        filters,
        idx,
        isAnyFilterAnimating,
        removeFilter,
        setFilter,
        toggleAnimation,
        label
      } = this.props;
      const { name, enlarged, type, dataId } = filter;
      const AmenityFilterPanel = type && Filters[FILTER_COMPONENTS[type]];
      const allAvailableFields = this.availableFieldsSelector(this.props);

      var categories = filter.domain;

      return (
        <div>
          <StyledLabel>{label}</StyledLabel>
          <StyledFilterPanel className="filter-panel">
            <StyledFilterContent className="filter-panel__content">
              {categories.map(category => (
                <CheckboxContainer>
                  <Checkbox
                    id={category}
                    label={category}
                    value={category}
                    checked={filter.value.indexOf(category) >= 0}
                    onChange={() => this.onCheckedOption(filter.value.indexOf(category) >= 0, category)}
                  />
                </CheckboxContainer>
              ))}
              <StyledResetButton onClick={() => this.onResetClicked()}>Clear All</StyledResetButton>
            </StyledFilterContent>
          </StyledFilterPanel></div>
      );
    }
  }
}

export default AmenityFilterPanelFactory;

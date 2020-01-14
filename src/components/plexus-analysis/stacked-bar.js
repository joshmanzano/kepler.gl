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
import styled from 'styled-components';

import { createSelector } from 'reselect';
import { format } from 'd3-format';

import {
  SCALE_TYPES,
  SCALE_FUNC,
  ALL_FIELD_TYPES
} from 'constants/default-settings';
import { XYPlot, XAxis, HorizontalBarSeries, Hint, DiscreteColorLegend } from 'react-vis';
import { getTimeWidgetHintFormatter } from '../../../dist/utils/filter-utils';
import './react-vis-override.scss';


const StackedBarChartPanel = styled.div`
  display: flex;
  flex-direction: column;
  // margin: 25px 0px 40px 0;
  margin: 20px 0px 0px 0;
`;

const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;

  .control-panel-item {
    margin-top: 12px 0 8px 0;
  }

  .control-panel-item:nth-child(2) {
    display: flex;
    justify-content: flex-end;
  }

  p {
    color: ${props => props.theme.labelColor};
    margin: 0;
  }

  .control-panel__title {
    font-weight: 500;
    color: ${props => props.theme.textColorHl};
  }
`;

const ContentPanel = styled.div`
  display: flex;
  flex-direction: ${props => props.orientation=='horizontal' ? 'row' : 'column'};

  > * {
    &:not(:first-child) {
      margin-left: ${props => props.orientation=='horizontal' ? '40px' : '0px'};
    }
  }
`;

export class StackedBarChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: null,
    }
  }

  render() {
    const { data, activeIndicator, title, legends, values, xKeyArr, xKeyArrLabels, showLegend, isXKeyArrReg, legendLabels } = this.props;

    let pData;
    let sbBars = [];
    let leg;
    // let col = ['#ff205b', '#0acd6b', '#009adf', '#af58ba', '#ffc61f', '#f28522'];
    let col = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14e', '#edc949', '#b07aa2', '#ff9da7', '#9c755f', '#bab0ac']; // tableau 10 https://www.tableau.com/about/blog/2016/7/colors-upgrade-tableau-10-56782
    let col2 = ['#9ed5cd', '#44a7cb','#2e62a1','#192574',];
    let ticks = [];

    if (legends) {

      pData = legends.data.map((d, idx) => ({
        angle: 0,
        color: d
      }));

      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < legends.data.length; j++) {
          if (
            data[i][activeIndicator] >= legends.labels[j].low &&
            data[i][activeIndicator] <= legends.labels[j].high
          ) {
            pData[j].angle = pData[j].angle + 1;
            break;
          }
        }
      }

      let total = 0;
      pData.forEach(d => {
        let obj = {
          y: 0,
          x: d.angle
        };

        // ticks.push(d.angle + total);

        total += d.angle;

        sbBars.push(
          <HorizontalBarSeries data={[obj]} color={d.color}>
            <Hint data={obj} />
          </HorizontalBarSeries>
        );
        
      });

      leg = legends.data.map((d, i) => ({ title: legends.labels[i].low.toFixed(2) + ' to ' + legends.labels[i].high.toFixed(2), color: d }));

    } else if (values && this.props.xLabel) {
      let total = 0;

      ticks.push(0);
      values.forEach(d => {
        let obj = {
          y: 0,
          x: d[this.props.xLabel]
        };

        ticks.push(d[this.props.xLabel] + total);
        total += d[this.props.xLabel];

        sbBars.push(
          <HorizontalBarSeries data={[obj]} color={d.color}>
            <Hint data={obj} />
          </HorizontalBarSeries>
        );
      });
    } else if (values && xKeyArr) {
      // keys are in array of JSON objects (default: key is 'name')
      pData = [];
      let inserted = {};
      let total = 0;

      // manual count of each total in value
      xKeyArr.forEach((x, i) => { // each bin in bar chart will correspond to value in x 
        values.forEach(d => {
          let key = isXKeyArrReg ? x : x.name;
          total += d[key];
          if (key in inserted) { // add value of current data to x
            pData.filter(a => a.label == key)[0].x += d[key];
          } else {
            inserted[key] = 0;
            pData.push({
              label: key,
              y: 0, // all in one axis
              x: d[key],
            });
          }
        });
      });

      // calculates percentage
      pData = pData.map(d => ({
        ...d,
        value: ((d.x / total) * 100).toFixed(2) + '%',
      }))

      // pData.forEach((d) => {
      //   ticks.push(((d.x / total) * 100).toFixed(2));
      // });

      pData.forEach((d, i) => {
        sbBars.push(
          <HorizontalBarSeries
            data={[d]}
            color={col[i % col.length]}
            onValueMouseOver={(datapoint, event) => {
              this.setState({ hovered: datapoint });
            }} />
        );
      })

      leg = xKeyArr.map((d, i) => ({
        title: isXKeyArrReg ? (xKeyArrLabels ? xKeyArrLabels[d] : d) : d.name,
        color: col[i % col.length]
      }));
    } else if (values) {
      let total = 0;
      ticks.push(0);
      values.forEach((d, i) => {
        let obj = {
          y: 0,
          x: d
        };

        ticks.push(d + total);
        total += d;

        sbBars.push(
          <HorizontalBarSeries data={[obj]} 
          // color={d.color}
          color={col2[i % col2.length]}
          >
            <Hint data={obj} />
          </HorizontalBarSeries>
        );

        if(legendLabels) {
          leg = legendLabels.map((d, i) => ({ title: legendLabels[i], color: col2[i % col2.length] }));
        }
      });
    }

    return (
      <StackedBarChartPanel>
        <ControlPanel>
          <div className="control-panel-item">
            <p className="control-panel__title">{title}</p>
          </div>
        </ControlPanel>
        <ContentPanel orientation={this.props.legendOrientation}>
        <XYPlot style={{ margin: 10 }}
          width={270}
          margin={{ left: 5, right: 15, top: 25, bottom: ticks !== undefined && ticks.length != 0 ? 50 : 0 }}
          height={ticks !== undefined && ticks.length != 0 ? 110 : 80}
          onMouseLeave={() => this.setState({ hovered: null })}
          stackBy="x"
        >
          {ticks !== undefined && ticks.length != 0 &&
          <XAxis
          // orientation={'top'}
          tickValues={ticks}
          style={{
            ticks: {stroke: '#C3C9C5'},
            text: {fill: '#C3C9C5'},
            fontWeight: 200
          }}
        />
          }
          
          {sbBars}
          {this.state.hovered && (
            <Hint
              value={(legends) ? { Count: this.state.hovered.value } : {
                Category: this.state.hovered.label,
                Percentage: this.state.hovered.value,
              }}
            />
          )}
        </XYPlot>
        {(xKeyArr || legends || this.props.legendLabels) && showLegend &&
          <DiscreteColorLegend
            orientation={'horizontal'}
            items={leg}
          />
        }
        </ContentPanel>

      </StackedBarChartPanel>
    );
  }
}

const StackedBarChartFactory = () => StackedBarChart;
export default StackedBarChartFactory;

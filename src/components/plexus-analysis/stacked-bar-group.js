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
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalBarSeries,
  Hint,
  DiscreteColorLegend
} from 'react-vis';
import { getTimeWidgetHintFormatter } from '../../../dist/utils/filter-utils';

const StackedBarGroupPanel = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
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

export class StackedBarGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: null
    };
  }

  render() {
    const { showLegend, values, xKeyArr, xKeyArrLabels, title, categoryLabel } = this.props;

    let pData;
    let sbBars = [];
    let leg;
    // let col = [
    //   '#ff205b',
    //   '#0acd6b',
    //   '#009adf',
    //   '#af58ba',
    //   '#ffc61f',
    //   '#f28522'
    // ];

    let col = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14e', '#edc949', '#b07aa2', '#ff9da7', '#9c755f', '#bab0ac'];


    if (values && xKeyArr) {
      // xkeyarr is transport mode array
      pData = [];

      xKeyArr.forEach((x, i) => {
        let category = x;
        let barData = [];
        let total = 0;

        values.forEach((v, j) => {
          let obj = {
            x: v[category],
            y: v.name,
            valueLabel: category,
            actualValue: v[category]
          };

          // total += v[category];

          barData.push(obj);
        });

        barData = barData.map(b => ({
          ...b,
          actualValue: ((b.actualValue / 100) * 100).toFixed(2) + '%'
        }));

        sbBars.push(
          <HorizontalBarSeries
            animation
            data={barData}
            barWidth={0.8}
            onValueMouseOver={(datapoint, event) => {
              // does something on click
              // you can access the value of the event

              this.setState({ hovered: datapoint });
            }}
            color={col[i % col.length]}
          />
        );
      });

      leg = xKeyArr.map((d, i) => ({
        title: xKeyArrLabels ? xKeyArrLabels[d] : d,
        color: col[i % col.length]
      }));
    }

    function myFormatter(value, index, scale, tickTotal) {
      return (
        <foreignObject
          x="-90"
          y="-10"
          width="80"
          height="20"
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: 80,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
              textAlign: 'end',
              // cursor: 'pointer',
              ":hover": {
                textDecoration: 'underline',
                color: 'white',
              }
            }}
          >
            {/* <text>{value}</text> */}
            {value}
          </div>
        </foreignObject>
      );
    }

    return (
      <StackedBarGroupPanel>
        <ControlPanel>
          <div className="control-panel-item">
            <p className="control-panel__title">{title}</p>
          </div>
        </ControlPanel>
        <div style={{ display: 'flex' }}>
          <XYPlot
            xDomain={[0, 100]}
            margin={{ left: 100, right: 30, top: 25, bottom: 25 }}
            style={{ margin: 10 }}
            width={350}
            // margin={{left: 0, right: 0, top: 25, bottom: 15}}
            height={200}
            onMouseLeave={() => this.setState({ hovered: null })}
            stackBy="x"
            yType="ordinal"
          >
            <XAxis
              orientation={'top'}
              tickValues={[0, 50, 100]}
              style={{
                ticks: { stroke: '#C3C9C5' },
                text: { fill: '#C3C9C5' },
                fontWeight: 200
              }}
            />
            {/* TODO: use props */}
            <YAxis
              // getY={d=>(d.y.length > 12 ? (d.y.slice(0,12) + '...') : d.y )}
              tickFormat={myFormatter}
              style={{
                ticks: { stroke: '#C3C9C5' },
                color: '#C3C9C5',
                fontWeight: 200
              }}
            />
            {sbBars}
            {this.state.hovered && (
              <Hint
                xType="literal"
                yType="literal"
                // getX={d => d.x}
                // getY={d => d.y}
                value={{
                  Category: this.state.hovered.y,
                  [categoryLabel ? categoryLabel : 'Category']: this.state.hovered.valueLabel,
                  Percent: this.state.hovered.actualValue
                }}
              />
            )}
          </XYPlot>
          {xKeyArr && showLegend &&
            <DiscreteColorLegend
              // orientation={'horizontal'}
              items={leg}
            />
          }
        </div>
      </StackedBarGroupPanel>
    );
  }
}

const StackedBarGroupFactory = () => StackedBarGroup;
export default StackedBarGroupFactory;

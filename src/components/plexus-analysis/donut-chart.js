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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  SCALE_TYPES,
  SCALE_FUNC,
  ALL_FIELD_TYPES
} from 'constants/default-settings';
import {RadialChart, Hint, DiscreteColorLegend} from 'react-vis';

const DonutPanel = styled.div `
  display: flex;
  flex-direction: column;
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

  .control-panel__title{
    font-weight: 500;
    color: ${props => props.theme.labelColor};
    font-size: 1.2em;
    font-weight:500;    
  }
`;

export class DonutChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: null,
    }
  }


  render() {
    const {
      data, 
      activeIndicator,
      title,
      legends,
      values,
      xLabel,
      xKeyArr
    } = this.props;

    let pData;
    let aData = [0,0,0,0,0,0];
    let leg;
    let col = ['#ff205b', '#0acd6b', '#009adf', '#af58ba', '#ffc61f', '#f28522'];
    
    if(legends) {
      pData = legends.data.map((d, idx) => ({
        angle: 0,
        color: d,
      })) ;

      for(var i=0; i<data.length; i++) {
          for(var j=0; j<legends.data.length; j++) {
              if(data[i][activeIndicator] >= legends.labels[j].low && data[i][activeIndicator] <= legends.labels[j].high) {
                  pData[j].angle = pData[j].angle+1;
                  aData[j]++;
                  break;
              }
          }
      }
    } else if(values && xLabel) { // values in json array format, xLabel - key
      
      pData = values.map((d) => ({
        angle: d[xLabel],
        value: d[xLabel],
      }));
      
    } else if(values && xKeyArr) { // 'Group by' values in xKeyArr
      pData = [];
      let inserted = {};
      xKeyArr.forEach((x, i) => {
        values.forEach(d => {
          if(x.name in inserted) {
            pData.filter(a=>a.label==x.name)[0].angle += d[x.name];
          } else {
            inserted[x.name] = 0;
            pData.push({
              label: x.name,
              value: d[x.name],
              angle: d[x.name],
              color: col[i%col.length],
            });
          }
        });
      });

      leg = xKeyArr.map((d, i)=>({title: d.name, color: col[i%col.length]}));
    }
    

    return (
      <DonutPanel>
        <ControlPanel>
          <div className="control-panel-item">
            <p className="control-panel__title">{title}</p>            
          </div>
        </ControlPanel>
        <RadialChart 
          animation
          data={pData} 
          innerRadius={50}
          radius={70}
          width={280} 
          height={170} 
          colorType={'literal'}
          // colorType={legends?"literal":"category"}
          onValueMouseOver={v => {this.setState({hovered: v})}}
          onSeriesMouseOut={v => this.setState({hovered: null})}
          >
            {this.state.hovered && (
              <Hint
                value={(legends) ? {Count: this.state.hovered.value} : {
                  Category: this.state.hovered.label,
                  Count: this.state.hovered.value,
                }}
              />
            )}
          </RadialChart>
          {xKeyArr && 
          <DiscreteColorLegend 
            orientation={'horizontal'}
            items={leg} 
            />
          }
          
      </DonutPanel>
    );
  }
}

const DonutChartFactory = () => DonutChart;
export default DonutChartFactory;

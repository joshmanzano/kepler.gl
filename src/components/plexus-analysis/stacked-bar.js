import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {createSelector} from 'reselect';
import {format} from 'd3-format';

import {
  SCALE_TYPES,
  SCALE_FUNC,
  ALL_FIELD_TYPES
} from 'constants/default-settings';
import {XYPlot, YAxis, HorizontalBarSeries, Hint, DiscreteColorLegend} from 'react-vis';
import { getTimeWidgetHintFormatter } from '../../../dist/utils/filter-utils';


const StackedBarChartPanel = styled.div`
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

  .control-panel__title {
    font-weight: 500;
    color: ${props => props.theme.textColorHl};
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
    const {data, activeIndicator, title, legends, values, xKeyArr} = this.props;

    let pData;
    let sbBars = [];
    let leg;
    let col = ['#ff205b', '#0acd6b', '#009adf', '#af58ba', '#ffc61f', '#f28522'];
    

    if(legends) {
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

      pData.forEach(d => {
        let obj = {
          y: 0,
          x: d.angle
        };
        sbBars.push(
          <HorizontalBarSeries data={[obj]} color={d.color}>
            <Hint data={obj} />
          </HorizontalBarSeries>
        );
      });
    } else if(values && this.props.xLabel) {
      values.forEach(d => {
        let obj = {
          y: 0,
          x: d[this.props.xLabel]
        };
        sbBars.push(
          <HorizontalBarSeries data={[obj]} color={d.color}>
            <Hint data={obj} />
          </HorizontalBarSeries>
        );
      });
    } else if(values && xKeyArr) {
      console.error('Stacked Bar conditional 3');
      pData = [];
      let inserted = {};
      let total = 0;
      xKeyArr.forEach((x, i) => {
        values.forEach(d => {
          total += d[x.name];
          if(x.name in inserted) {
            pData.filter(a=>a.label==x.name)[0].x += d[x.name];
          } else {
            inserted[x.name] = 0;
            // pData.push({
            //   label: x.name,
            //   value: d[x.name],
            //   angle: d[x.name],
            //   color: col[i%col.length],
            // });
            console.error(d[x.name]);
            pData.push({
              label: x.name,
              y: 0,
              x: d[x.name],
            });
          }
        });
      });

      pData = pData.map(d => ({
        ...d,
        value: ((d.x/total)*100).toFixed(2) + '%',
      }))

      console.error(pData);

      pData.forEach((d,i) => {
        sbBars.push(
          <HorizontalBarSeries 
            data={[d]} 
            color={col[i%col.length]}
            onValueMouseOver={(datapoint, event)=>{
              // does something on click
              // you can access the value of the event
              console.error('bar chart hover');
              console.error(datapoint);
              console.error(event);
              this.setState({hovered: datapoint});
              // console.error(event);
            }}/>
        );
      })

      leg = xKeyArr.map((d, i)=>({title: d.name, color: col[i%col.length]}));
    } else if(values) {
      values.forEach(d => {
        let obj = {
          y: 0,
          x: d
        };
        sbBars.push(
          <HorizontalBarSeries data={[obj]} color={d.color}>
            <Hint data={obj} />
          </HorizontalBarSeries>
        );
      });
    }
    
    return (
      <StackedBarChartPanel>
        <ControlPanel>
          <div className="control-panel-item">
            <p className="control-panel__title">{title}</p>
          </div>
        </ControlPanel>
        <XYPlot style={{margin: 10}}
          width={270}
          margin={{left: 0, right: 0, top: 25, bottom: 15}}
          height={80}
          onMouseLeave={() => this.setState({hovered: null})}          
          stackBy="x"
        >
          { sbBars }
          {this.state.hovered && (
              <Hint
                value={(legends) ? {Count: this.state.hovered.value} : {
                  Category: this.state.hovered.label,
                  Percentage: this.state.hovered.value,
                }}
              />
            )}
        </XYPlot>
        {xKeyArr && 
          <DiscreteColorLegend 
            orientation={'horizontal'}
            items={leg} 
            />
          }

      </StackedBarChartPanel>
    );
  }
}

const StackedBarChartFactory = () => StackedBarChart;
export default StackedBarChartFactory;

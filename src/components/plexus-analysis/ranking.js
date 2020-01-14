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
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
  faSortAmountDown,
  faSortAmountDownAlt,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons';

const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  width: ${props => props.width}px;
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
    color: ${props => props.theme.labelColor};
  }
`;
const ControlBtn = styled.button`
  cursor: pointer;
  color: ${props => props.theme.labelColor};
  background: none;
  border: none;
`;

const ListTable = styled.div`
  display: grid;
  margin: 10px 0 20px 0;
  grid-template-columns: 20px auto auto;
  grid-column-gap: 10px;
  grid-row-gap: 5px;
  width: ${props => props.width}px;
  color: ${props => props.theme.labelColor};
  

  .listtable-index {
    justify-self: end;
  }

  .listtable-value {
    text-align: center;
    background-color: white;
    height: fit-content;
    border-radius: 3px;
    background-color: #1fb9d5;
    color: #fff;
    padding: 1px 17px;
  }

  .listtable-label {
  }
`;

const ListTableNoted = styled.div`
  display: grid;
  margin: 10px 0 20px 0;
  grid-template-columns: 20px 60px auto 10px auto;
  grid-column-gap: 10px;
  grid-row-gap: 5px;
  color: ${props => props.theme.labelColor};
  

  .listtable-index {
    justify-self: end;
  }

  .listtable-value {
    text-align: center;
    background-color: white;
    height: fit-content;
    border-radius: 3px;
    background-color: #1fb9d5;
    color: #fff;
    padding: 1px 17px;
  }

  .listtable-label {
  }

  .listtable-note {

    svg {
      color: green;
      padding-right: 10px;
    }
  }
`;
const TableContainer = styled.div`
    display: flex;
    align-items: flex-start;
}
`
export class Ranking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: null
    };
  }

  render() {
    const {
      data,
      title,
      floatFormat,
      xKey,
      yKey,
      height,
      maxColItems,
      noted
    } = this.props;

    // TODO: make responsive
    const width = 270;

    let formattedData = data;
    let tables = [], tcontent = [];

    if (xKey && yKey) {
      //   formattedData = ;
      formattedData = data.filter(d => typeof d[yKey] !== undefined)
        .map((d, idx) => ({
          ...d,
          x: d[xKey],
          y: d[yKey]
        }));
    } else {
      formattedData = data.filter(d => typeof d['y'] !== undefined)
        .map((d, idx) => ({
          ...d,
          x: d.x
        }));
    }

    formattedData.forEach((d, i) => {
      tcontent.push(<div className='listtable-index'>{i + 1}</div>);
      tcontent.push(<div className='listtable-value'>{floatFormat ? d.x.toFixed(2) : d.x}</div>)
      tcontent.push(<div className='listtable-label'>{(d.y)}</div>);
      if (noted) {
        tcontent.push(<div></div>);
        tcontent.push(<div className='listtable-note'><FontAwesomeIcon icon={faPlusCircle} size="2x"/>{(d.note)}</div>);
      }
    });

    if (maxColItems) {
      const cols = formattedData.length % maxColItems == 0 ? formattedData.length / maxColItems : formattedData.length / maxColItems + 1;
      const tableRowItems = noted ? 5 : 3;
      for (let i = 0; i < Math.floor(cols); i++) {
        if (noted)
          tables.push(<ListTableNoted>{tcontent.slice(i * maxColItems * tableRowItems, (i + 1) * maxColItems * tableRowItems)}</ListTableNoted>)
        else
          tables.push(<ListTable>{tcontent.slice(i * maxColItems * tableRowItems, (i + 1) * maxColItems * tableRowItems)}</ListTable>)
      }
    } else {
      if (noted)
        tables.push(<ListTableNoted>{tcontent}</ListTableNoted>);
      else
        tables.push(<ListTable>{tcontent}</ListTable>)
    }


    return (
      <div>
        {title ? (
          <ControlPanel width={width}>
            <div className="control-panel-item">
              <p className="control-panel__title">{title}</p>
            </div>
          </ControlPanel>
        ) : null}
        <TableContainer>
          {tables}
        </TableContainer>
      </div>
    );
  }
}

const RankingFactory = () => Ranking;
export default RankingFactory;

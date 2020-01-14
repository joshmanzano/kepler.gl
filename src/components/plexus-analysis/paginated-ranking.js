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
  faSortAmountDownAlt
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

const PTable = styled.div`
  display: grid;
  margin: 10px 0 20px 0;
  grid-template-columns: 20px 60px auto;
  grid-column-gap: 10px;
  grid-row-gap: 5px;
  width: ${props => props.width}px;
  color: ${props => props.theme.labelColor};
  

  .ptable-index {
    justify-self: end;
  }

  .ptable-value {
    text-align: center;
    background-color: white;
    height: fit-content;
    border-radius: 3px;
    background-color: #1fb9d5;
    color: #fff;
  }

  .ptable-label {
  }
`;

export class PaginatedRanking extends Component {
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
      paginationFunc,
      reverseFunc,
      maxBar,
      domainMax,
      listSize,
      analysisRankingReverse,
      analysisRankingPage,
      height,
      legends
    } = this.props;

    // TODO: make responsive
    const width = 270;

    let formattedData = data;
    let dataSorted = data;
    let dataSliced = data;
    let max;
    let tcontent = [];

    if (xKey && yKey) {
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

    dataSorted = formattedData;
    dataSliced = formattedData;

    // slice data for paginated
    if (paginationFunc && reverseFunc) {
      dataSorted = analysisRankingReverse
        ? formattedData.reverse()
        : formattedData;
      dataSliced = dataSorted.slice(
        (analysisRankingPage - 1) * maxBar,
        Math.min(maxBar + (analysisRankingPage - 1) * maxBar, dataSorted.length)
      );
      dataSliced = dataSliced.reverse();
    }

    // get largest value in data
    max = domainMax
      ? domainMax
      : dataSorted.reduce((prev, current) =>
        prev.x > current.x ? prev : current
      ).x;

    // generate labels
    // dataLabels = dataSliced
    //   .filter(d => (!d.hasOwnProperty('display') ? true : d.display))
    //   .map((d, idx) => ({
    //     x: d.x,
    //     y: d.y,
    //     label: floatFormat ? d.x.toFixed(2) : d.x,
    //     xOffset: 20,
    //     yOffset: 7,
    //     style: {fill: '#6A7485'}
    //   }));

    let currCol = legends ? analysisRankingReverse ? legends.data.length - 1 : 0 : 0;
    dataSliced.forEach((d, i) => {
      // assign color
      if (legends) {
        if (analysisRankingReverse) {
          while (d.x < legends.labels[currCol].low && currCol >= 0) {
            currCol--;
          }
        } else {
          while (d.x > legends.labels[currCol].high && currCol < legends.data.length) {
            currCol++;
          }
        }
      }

      tcontent.push(<div className='ptable-label'>{(d.y)}</div>);
      {
        legends ?
          tcontent.push(<div className='ptable-value' style={{ backgroundColor: legends.data[currCol], color: currCol <= 2 ? '#fff' : '#212121' }}>{d.x.toFixed(2)}</div>) //(dataSliced.length - i)+(analysisRankingPage - 1) * maxBar || 10+0*10 
          : tcontent.push(<div className='ptable-value'>{floatFormat ? d.x.toFixed(2) : d.x}</div>) //(dataSliced.length - i)+(analysisRankingPage - 1) * maxBar || 10+0*10 
      }
      tcontent.push(<div className='ptable-index'>{analysisRankingReverse ? 1 + formattedData.length - ((dataSliced.length - i) + (analysisRankingPage - 1) * maxBar) : (dataSliced.length - i) + (analysisRankingPage - 1) * maxBar}</div>);
    });

    tcontent = tcontent.reverse();

    // get bar chart labels
    let maxDom = 0;
    while (maxDom < max) {
      maxDom += 50;
    }

    // truncate long y-axis labels
    const MAX_LENGTH = 13;
    // labels right of bar

    let maxPage;

    if (paginationFunc && reverseFunc)
      maxPage =
        listSize % maxBar == 0
          ? Math.floor(listSize / maxBar)
          : Math.floor(listSize / maxBar) + 1;

    return (
      <div>
        {title || (paginationFunc && reverseFunc) ? (
          <ControlPanel width={width}>
            <div className="control-panel-item">
              <p className="control-panel__title">{title}</p>
            </div>
            {paginationFunc && reverseFunc ? (
              <div className="control-panel-item">
                <ControlBtn
                  onClick={() => {
                    reverseFunc(!analysisRankingReverse);
                    paginationFunc(1);
                  }}
                >
                  {analysisRankingReverse ? (
                    <FontAwesomeIcon icon={faSortAmountDown} />
                  ) : (
                      <FontAwesomeIcon icon={faSortAmountDownAlt} />
                    )}
                </ControlBtn>
                <ControlBtn
                  onClick={() => {
                    paginationFunc(Math.max(1, analysisRankingPage - 1));
                  }}
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </ControlBtn>
                <p>
                  Page {analysisRankingPage} of {maxPage}
                </p>
                <ControlBtn
                  onClick={() => {
                    paginationFunc(Math.min(maxPage, analysisRankingPage + 1));
                  }}
                >
                  <FontAwesomeIcon icon={faAngleRight} />
                </ControlBtn>
              </div>
            ) : null}
          </ControlPanel>
        ) : null}

        <PTable width={width}>
          {tcontent}
        </PTable>
      </div>
    );
  }
}

const PaginatedRankingFactory = () => PaginatedRanking;
export default PaginatedRankingFactory;

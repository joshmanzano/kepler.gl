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

import React from 'react';
import styled from 'styled-components';
import {createSelector} from 'reselect';

import {
  SelectTextBold,
  IconRoundSmall,
  CenterFlexbox
} from 'components/common/styled-components';
import {Close, Clock, LineChart} from 'components/common/icons';

import PropTypes from 'prop-types';
import TimeWidgetFactory from './filters/time-widget';
import {
  INDICATORS,
  ANALYSIS_TABS_DEF,
  AMENITY_DATA_INDICES,
  OD_DATA_INDICES,
  ANALYSIS_TABS_BGY,
  BGY_DATA_DISPLAY
} from 'utils/filter-utils';
import {
  SEGMENTED_DESTINATIONS,
  TRANSPORT_MODES,
  AVE_AMENITIES,
  LONGEST_TRAVEL_TIMES,
  SHORTEST_TRAVEL_TIMES,
  HIGHEST_COSTS,
  LOWEST_COSTS,
  CITY_FLOODING
} from 'utils/plexus-utils/sample-data-utils';
import {scaleLinear} from 'd3-scale';

import BarChartFactory from './plexus-analysis/bar-chart';
import ParallelCoordinatesKFactory from './plexus-analysis/parallel-coordinates';
import DonutChartFactory from './plexus-analysis/donut-chart';
import StackedBarChartFactory from './plexus-analysis/stacked-bar';
import PaginatedRankingFactory from './plexus-analysis/paginated-ranking';
import StackedBarGroupFactory from './plexus-analysis/stacked-bar-group';

import {RadialChart} from 'react-vis';
import {SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER} from 'constants';
// import { StackedBarChart } from './plexus-analysis/stacked-bar';

const innerPdSide = 32;

const propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object),
  datasets: PropTypes.object,
  uiState: PropTypes.object,
  visState: PropTypes.object,
  visStateActions: PropTypes.object,
  uiStateActions: PropTypes.object,
  sidePanelWidth: PropTypes.number,
  containerW: PropTypes.number,
  layers: PropTypes.arrayOf(PropTypes.any),
  mapLayers: PropTypes.object
};

const maxWidth = 1080;
const modMaxWidth = 1400;

BottomWidgetFactory.deps = [
  TimeWidgetFactory,
  BarChartFactory,
  ParallelCoordinatesKFactory,
  DonutChartFactory,
  StackedBarChartFactory,
  PaginatedRankingFactory,
  StackedBarGroupFactory,
];

const AnalysisSectionToggle = ({activeTab, update, barangay}) => (
  <Tabs>
    {barangay
      ? Object.keys(ANALYSIS_TABS_BGY).map(e => (
          <Tab
            key={ANALYSIS_TABS_DEF[e].value}
            active={ANALYSIS_TABS_DEF[e].value === activeTab}
            onClick={() => {
              update(ANALYSIS_TABS_BGY[e].value);
            }}
          >
            {ANALYSIS_TABS_BGY[e].label}
          </Tab>
        ))
      : Object.keys(ANALYSIS_TABS_DEF).map(e => (
          <Tab
            key={ANALYSIS_TABS_DEF[e].value}
            active={ANALYSIS_TABS_DEF[e].value === activeTab}
            onClick={() => {
              update(ANALYSIS_TABS_DEF[e].value);
            }}
          >
            {ANALYSIS_TABS_DEF[e].label}
          </Tab>
        ))}
  </Tabs>
);

const AnalysisSectionWrapper = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  display: flex;
  flex-grow: 1;
  // padding: 0.95em;
  overflow-y: scroll;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 32px;
  margin-bottom: 60px;
`;

const RankingAnalysis = styled.div`
  flex-grow: 3;
  margin-top: 20px;
  height: 100%;

  .ranking-analysis__section {
    display: flex;
    justify-content: center;
    padding-top: 10px;
    // flex-direction: row;
  }
  .ranking-analysis__section:nth-child(1) {
    padding-top: 0;
  }

  .ranking-analysis__section > * {
    padding-left: 30px;
  }
  .ranking-analysis__section > * :nth-child(1) {
    padding-left: 0;
  }
`;

const BreakdownAnalysis = styled.div`
  flex-grow: 7;
  display: flex;

  flex-direction: column;
  justify-content: flex-center;
  align-items: flex-start;

  .breakdown-analysis__section {
    // flex-grow: 1;
    display: flex;
    // justify-content: center;
    margin: 0;
    margin-right: 50px;
    margin-top: 20px;
  }
`;

const BarangayInfo = styled.div`
  flex-grow: 3;
  max-width: 300px;
  margin-top: 15px;

  .barangay-info__section {
    display: flex;
    justify-content: flex-start;
    padding-top: 5px;
  }
  .barangay-info__section:nth-child(1) {
    padding-top: 0;
    padding-bottom: 5px;
  }
  .barangay-info__section > div {
    padding-top: 0;
    padding-left: 30px;
  }
  .barangay-info__section > div:nth-child(1) {
    padding-left: 0;
  }
`;

const BarangayInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: ${props => props.theme.labelColor};

  .barangay-info__wrapper__main {
    font-weight: 900;
    font-size: 2em;
    line-height: 1;
    margin-top: 15px;
    color: ${props => props.theme.labelColor};
  }

  .barangay-info__wrapper__value {
    font-weight: 900;
    font-size: 1.7em;
    line-height: 1;
  }

  .barangay-info__wrapper__label {
    font-size: 1.2em;
    font-weight: 400;
  }
`;

const RankingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.labelColor};

  .ranking-wrapper__score {
    font-weight: 900;
    font-size: 2em;
    line-height: 1;
  }

  // TODO: transfer colors to styles.js
  .ranking-wrapper__score--good {
    color: green;
  }
  .ranking-wrapper__score--okay {
    color: yellow;
  }
  .ranking-wrapper__score--bad {
    // color: red;
    color: #dd5239;
  }
  .ranking-wrapper__label {
    font-size: 1.4em;
  }
`;

// TODO: set width to side-bar width val in props
const WidgetContainer = styled.div`
  position: absolute;
  // padding-top: ${props => props.theme.sidePanel.margin.top}px;
  // padding-right: ${props => props.theme.sidePanel.margin.right}px;
  // padding-bottom: ${props => props.theme.sidePanel.margin.bottom}px;
  padding-left: ${props => props.theme.sidePanel.margin.left}px;
  top: 0;
  right: 0;
  z-index: 5;
  width: 340px;
  // maxWidth: ${props => props.width}px;
  // width: 35vw;
  width: 340px;
  // ${props => props.theme.sidePanelScrollBar};
  display: ${props => (props.display ? 'flex' : 'none')};

  // overflow-y: scroll;
  overflow-x: hidden;

  .bottom-widget--inner {
    background-color: ${props => props.theme.sidePanelBg};
    // padding: 10px ${innerPdSide}px;
    padding: 0.95em;
    position: relative;
    // height: 220px;
    height: 100vh;
    overflow-x: hidden;
  }
`;

const TopSectionWrapper = styled.div`

  position: absolute;
  top: 0;
  left: 0;
  padding: 0 12px;
  // background-color: ${props => props.theme.sidePanelHeaderBg};
  background-color: #18273e;
  display: flex;
  justify-content: space-between;
  width: 100%;
  // padding-right: ${innerPdSide * 2}px;
  color: ${props => props.theme.labelColor};
  font-size: 1.2em;
  font-weight: 400;

  .bottom-widget--close {
    display: none;
  }

  .bottom-widget__y-axis {
    flex-grow: 1;
    margin-left: 20px;
  }

  .bottom-widget__field-select {
    width: 160px;
    display: inline-block;
  }
`;

/* eslint-disable no-unused-vars */
const Tabs = styled.div`
  padding-right: 76px;
`;

const Tab = styled.div`
  border-bottom: 1px solid
    ${props => (props.active ? props.theme.textColorHl : 'transparent')};
  color: ${props =>
    props.active ? props.theme.textColorHl : props.theme.labelColor};
  display: inline-block;
  font-size: 12px;
  height: 24px;
  margin-right: 4px;
  text-align: center;
  // width: 24px;
  line-height: 24px;
  padding: 0px 12px;

  :hover {
    cursor: pointer;
  }
`;
/* eslint-enable no-unused-vars */

const StyledTitle = CenterFlexbox.extend`
  flex-grow: 0;
  color: ${props => props.theme.textColor};

  .bottom-widget__icon {
    margin-right: 6px;
  }
`;

const IndicatorInfo = styled.div`
  font-size: 1.8em;
  font-weight: 600;
  color: #C3C9C5;
  margin-top: 20px;
  margin-bottom: -25px;
  color: ${props => props.theme.labelColor};
`;

const RelatedIndWrapper = styled.div`
  color: ${props => props.theme.labelColor};
  font-size: 1em;
  font-weight: 500;
  margin-bottom: 20px;
`;

const RelatedIndItemWrapper = styled.div`
  display: flex;
  flex: row;
`;

const RelatedIndItem = styled.div`
  font-size: 0.9em;
  background-color: #18273e;
  color: ${props => props.theme.labelColor};
  padding: 8px;
  margin: 3px;
  border-radius: 10px;
  cursor: pointer;
  :hover {
    opacity: 0.7;
  }
`;

const PhysInd = styled.div`
  color: ${props => props.theme.labelColor};
  font-size: 1em;
  font-weight: 500;
  margin-left: 5px;
  display: flex;
`;

const PercentPhys = styled.div`
  font-size: 1.4em;
  background-color: ${props => props.theme.activeColor};;
  padding: 5px;
  border-radius: 10px;
  width: 20%;
  text-align-last: center;
  margin-right: 10px;
`;

export default function BottomWidgetFactory(
  TimeWidget,
  BarChart,
  ParallelCoordinatesK,
  DonutChart,
  StackedBarChart,
  PaginatedRanking,
  StackedBarGroup,
) {
  const BottomWidget = props => {
    const {
      datasets,
      filters,
      visStateActions,
      uiStateActions,
      containerW,
      uiState,
      sidePanelWidth,
      selected,
      visState,
      layers, // for domain+colors / TODO: move somewhere else
      mapLayers, // for domain+colors / TODO: move somewhere else
      legends
    } = props;
    const {activeSidePanel} = uiState;
    const isOpen = Boolean(activeSidePanel);
    const width = modMaxWidth;

    const DEFAULT_LIST = 5;
    const SCALE = 1;

    let cityMeans = [];
    var indicatorValues = [];
    INDICATORS.forEach(i => indicatorValues.push(i.value));

    let maxListSize = DEFAULT_LIST;
    let bgyIncl;
    let amtyCnt;
    let destCnt, oriCnt;
    let bgy;
    let ranking;
    let bgyRef = {};

    if (datasets.barangays) {
      if (datasets.barangays.data) {

        maxListSize = Math.min(DEFAULT_LIST, datasets.barangays.data.length);

        // formatted barangay data
        datasets.barangays.allData.forEach(d => {
          let obj = {};
          BGY_DATA_DISPLAY.forEach(b => {
            obj[b.id] = d[b.idx];
          });
          bgyRef[obj['id']] = obj['name'];
          // bgyIncl.push(obj);
        });

        bgyIncl = [];
        datasets.barangays.data.forEach(d => {
          let obj = {};
          BGY_DATA_DISPLAY.forEach(b => {
            obj[b.id] = d[b.idx];
          });
          // bgyRef[obj['id']] = obj['name'];
          bgyIncl.push(obj);
        });
        bgyIncl = bgyIncl.sort((a, b) => b[selected] - a[selected]);

        datasets.barangays.fields.forEach(e => {
          if (indicatorValues.includes(e.name)) {
            cityMeans.push({
              value: e.name,
              y: INDICATORS[INDICATORS.findIndex(i => i.value == e.name)].label,
              x:
                bgyIncl.reduce((total, next) => total + next[e.name], 0) /
                bgyIncl.length
            });
          }
        });
      }
      if (visState.activeBarangay) {
        const ind = INDICATORS.map((d)=>{return d.value});

        // format active barangay data
        bgy = visState.activeBarangay.map((d, idx) => ({
          x: d,
          label: datasets.barangays.fields[idx].name,
          display:
            ind.includes(datasets.barangays.fields[idx].name)
        }));

        // ind.append('_geojson')
        // bgy = bgy.filter((d)=>(ind.contains(d.label)));

        bgy = bgy.map((d, idx) => ({
          ...d,
          y:
            INDICATORS.findIndex(i => i.value == d.label) >= 0
              ? INDICATORS[INDICATORS.findIndex(i => i.value == d.label)].label
              : ''
        }));

        // Get active bgy ranking
        // TODO get bgy ranking by id
        ranking =
          bgyIncl.findIndex(b => b['name'] == visState.activeBarangay[1]) + 1;

        // amenities
        let inserted = {};
        amtyCnt = [];
        datasets.amenities.allData.forEach(d => {
          let key = d[AMENITY_DATA_INDICES['class']];
          if (
            d[AMENITY_DATA_INDICES['barangay']] ==
            bgy.filter(b => b['label'] == 'name')[0].x
          ) {
            if (key in inserted) {
              amtyCnt.filter(a => a.name == key)[0].count += 1;
            } else {
              inserted[key] = 0;
              amtyCnt.push({
                name: key,
                count: 1
              });
            }
          }
        });

        // // destinations
        inserted = {};
        let oInserted = {};
        destCnt = [];
        oriCnt = [];
        datasets.pairs.allData.forEach(d => {
          let oId = d[OD_DATA_INDICES['o_id']];
          let dId = d[OD_DATA_INDICES['d_id']];
          if (dId == bgy.filter(b => b['label'] == 'id')[0].x) {
            if (oId in inserted) {
              destCnt.filter(d => d.id == oId)[0].count +=
                d[OD_DATA_INDICES['count']];
            } else {
              inserted[oId] = 0;
              destCnt.push({
                name: bgyRef[oId],
                id: oId,
                count: d[OD_DATA_INDICES['count']]
              });
            }
          }

          if (oId == bgy.filter(b => b['label'] == 'id')[0].x) {
            if (dId in oInserted) {
              oriCnt.filter(d => d.id == dId)[0].count +=
                d[OD_DATA_INDICES['count']];
            } else {
              oInserted[dId] = 0;
              oriCnt.push({
                name: bgyRef[dId],
                id: dId,
                count: d[OD_DATA_INDICES['count']]
              });
            }
          }
          // if(key == bgy.filter(b => b['label'] == 'id')[0].x) {
          //   if(key in inserted) {
          //     destCnt.filter(d=>d.id==key)[0].count += d[OD_DATA_INDICES['count']];
          //   } else {
          //     inserted[key] = 0;
          //     destCnt.push({
          //       name: bgyRef[key],
          //       id: key,
          //       count: d[OD_DATA_INDICES['count']],
          //     });
          //   }
          // }
        });

        // console.error(destCnt);
        // console.error(oriCnt);
        // console.error(bgy);
        // console.error(SEGMENTED_DESTINATIONS);
        // console.error(SEGMENTED_DESTINATIONS.filter(d=>d.name && d.id==bgy.filter(e=>e.label=='id')[0].x));
      } else {

      }
    }

    const changeBarangay = id => {
      console.error('set bgy');
      let idIndex = BGY_DATA_DISPLAY.filter(bdd => bdd.id == 'id')[0].idx;
      let newBgy = datasets.barangays.data.filter(b => b[idIndex] == id)[0];
      console.error(newBgy);
      visStateActions.setActiveBarangay(newBgy);
    };

    const ACTIVE_INDICATOR_LABEL =
      INDICATORS[INDICATORS.findIndex(d => d.value == selected)].label;

    return (
      <WidgetContainer
        display={selected != 'desirability' || visState.activeBarangay}
      >
        {/* <WidgetContainer display={true}> */}
        {/* <WidgetContainer width={width}> */}
        {/* <div className="bottom-widget--inner"> */}
        <div
          className={
            visState.activeBarangay || selected != 'desirability'
              ? 'bottom-widget--inner'
              : 'bottom-widget--close'
          }
        >
          <TopSectionWrapper
            style={{
              display:
                visState.activeBarangay || selected != 'desirability'
                  ? 'block'
                  : 'none'
            }}
          >
            {/* <TopSectionWrapper> */}
            <p>{!visState.activeBarangay ? 'City ' : 'Barangay '}Overview</p>
          </TopSectionWrapper>
          <AnalysisSectionWrapper>
            {visState.activeBarangay &&
            visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
            bgyIncl ? (
              <BarangayInfo>
                <div className="barangay-info__section">
                  <BarangayInfoWrapper>
                    <div className="barangay-info__wrapper__main">
                      {bgy.filter(e => e.label == 'name')[0].x}
                    </div>
                  </BarangayInfoWrapper>
                </div>
                <div className="barangay-info__section">
                  <BarangayInfoWrapper>
                    <div className="barangay-info__wrapper__label">
                      Population:
                    </div>
                    <div className="barangay-info__wrapper__value">
                      {bgy
                        .filter(e => e.label == 'population')[0]
                        .x.toLocaleString()}
                    </div>
                  </BarangayInfoWrapper>
                  <BarangayInfoWrapper>
                    <div className="barangay-info__wrapper__label">
                      Average Income:
                    </div>
                    <div className="barangay-info__wrapper__value">
                      {bgy
                        .filter(e => e.label == 'income')[0]
                        .x.toLocaleString()}
                    </div>
                  </BarangayInfoWrapper>
                </div>
                <div className="barangay-info__section">
                  <BarangayInfoWrapper>
                    <div className="barangay-info__wrapper__label">
                      {ACTIVE_INDICATOR_LABEL} Ranking:
                    </div>
                    <div className="barangay-info__wrapper__value">
                      {ranking}/{bgyIncl.length}
                    </div>
                  </BarangayInfoWrapper>
                </div>
              </BarangayInfo>
            ) : null}
            <BreakdownAnalysis>
              {/* barangay selected*/}

              {visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_BGY.profile.value ? (
                <div className="breakdown-analysis__section">
                  <BarChart
                    height={300}
                    floatFormat={true}
                    title={'Indicator Breakdown'}
                    data={bgy
                      .filter(
                        e =>
                          typeof e.x == 'number' &&
                          e.label != 'population' &&
                          e.label != 'income'
                      )
                      .reverse()}
                    domainMax={100}
                  />
                </div>
              ) : null}

              {visState.activeBarangay &&
              amtyCnt.length > 0 &&
              visState.activeAnalysisTab == ANALYSIS_TABS_BGY.profile.value ? (
                <div className="breakdown-analysis__section">
                  <BarChart
                    data={amtyCnt}
                    xKey={'count'}
                    yKey={'name'}
                    title={'Barangay Amenities'}
                    height={50 + amtyCnt.length * 22}
                  />
                </div>
              ) : null}

              {visState.activeBarangay && oriCnt.length > 0 ? (
                <div className="breakdown-analysis__section">
                  <PaginatedRanking
                    // floatFormat
                    listSize={oriCnt.length}
                    maxBar={5}
                    data={oriCnt
                      .filter(d => d.name)
                      .sort((a, b) => b['count'] - a['count'])}
                    xKey={'count'}
                    yKey={'name'}
                    title={'Barangays going to ' + bgy.filter(e => e.label == 'name')[0].x}
                    // onLabelClick={changeBarangay}
                    paginationFunc={visStateActions.changeOriPage}
                    reverseFunc={visStateActions.sortOriReverse}
                    analysisRankingReverse={visState.oriReverse}
                    analysisRankingPage={visState.oriPage}
                  />
                </div>
              ) : null}

              {/* {visState.activeBarangay && destCnt.length > 0 ? (
                <div className="breakdown-analysis__section">
                  <BarChart
                    data={destCnt
                      .filter(d => d.name)
                      .sort((a, b) => b['count'] - a['count'])
                      .reverse()}
                    xKey={'count'}
                    yKey={'name'}
                    title={'Frequently Occuring Origins'}
                    onLabelClick={changeBarangay}
                    height={50 + destCnt.length * 22}
                  />
                </div>
              ) : null} */}

              {/* {visState.activeBarangay && oriCnt.length > 0 ? (
                <div className="breakdown-analysis__section">
                  <BarChart
                    data={oriCnt
                      .filter(d => d.name)
                      .sort((a, b) => b['count'] - a['count'])
                      .reverse()}
                    xKey={'count'}
                    yKey={'name'}
                    title={'Most Common Destinations'}
                    onLabelClick={changeBarangay}
                    height={50 + oriCnt.length * 22}
                  />
                </div>
              ) : null} */}

              {visState.activeBarangay && destCnt.length > 0 ? (
                <div className="breakdown-analysis__section">
                  <PaginatedRanking
                    // floatFormat
                    listSize={destCnt.length}
                    maxBar={5}
                    data={destCnt
                      .filter(d => d.name)
                      .sort((a, b) => b['count'] - a['count'])
                    }
                    xKey={'count'}
                    yKey={'name'}
                    title={'Most Common Destinations'}
                    onLabelClick={changeBarangay}
                    paginationFunc={visStateActions.changeDestPage}
                    reverseFunc={visStateActions.sortDestReverse}
                    analysisRankingReverse={visState.destReverse}
                    analysisRankingPage={visState.destPage}
                  />
                </div>
              ) : null}

              {/* indicator overview */}
              {/* {!visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value && bgyIncl ? (
                <div className="breakdown-analysis__section">
                  <StackedBarChart
                    title={'Survey Sample'}
                    values={[1021,30210 - 1021]}
                     />
                </div>
              ) : null} */}

              {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl ? (
                <div className="breakdown-analysis__section">
                  <StackedBarChart
                    title={ACTIVE_INDICATOR_LABEL + ' Distribution'}
                    activeIndicator={selected}
                    data={bgyIncl}
                    legends={legends}
                    showLegend
                    // values={[1021,30210 - 1021]}
                  />
                  {/* <DonutChart
                    title={ACTIVE_INDICATOR_LABEL + ' Proportion'}
                    displayLabel
                    activeIndicator={selected}
                    data={bgyIncl}
                    legends={legends}
                     /> */}
                </div>
              ) : null}

              {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl ? (
                <div className="breakdown-analysis__section">
                  <PaginatedRanking
                    floatFormat
                    listSize={bgyIncl.length}
                    maxBar={10}
                    data={bgyIncl}
                    xKey={selected}
                    yKey={'name'}
                    title={ACTIVE_INDICATOR_LABEL + ' Scores'}
                    onLabelClick={changeBarangay}
                    paginationFunc={visStateActions.changeAnalysisRankPage}
                    reverseFunc={visStateActions.sortAnalysisReverse}
                    analysisRankingReverse={visState.analysisRankingReverse}
                    analysisRankingPage={visState.analysisRankingPage}
                    legends={legends}
                  />
                  {/* <BarChart
                    floatFormat
                    listSize={bgyIncl.length}
                    maxBar={maxListSize}
                    data={bgyIncl}
                    xKey={selected}
                    yKey={'name'}
                    title={ACTIVE_INDICATOR_LABEL + ' Scores'}
                    onLabelClick={changeBarangay}
                    paginationFunc={visStateActions.changeAnalysisRankPage}
                    reverseFunc={visStateActions.sortAnalysisReverse}
                    analysisRankingReverse={visState.analysisRankingReverse}
                    analysisRankingPage={visState.analysisRankingPage}
                  /> */}
                </div>
              ) : null}

              {/* Spatial Indicator */}
            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Spatial' ? (
                <div className = "breakdown-analysis__section">
                  <BarChart
                    listSize={9}
                    data={AVE_AMENITIES}
                    xKey={'average'}
                    yKey={'name'}
                    title={'Average Count of City Amenities'}
                    height={250}
                  />
                </div>
              ) : null}

            {console.log('sample data for travel time')}
            {console.log(LONGEST_TRAVEL_TIMES)}
            {console.log(SHORTEST_TRAVEL_TIMES)}

            {/* Temporal Indicator */}
            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Temporal' ? (
                <div className = "breakdown-analysis__section">
                  {console.log(datasets.barangays.allData)}
                  <PaginatedRanking
                    // floatFormat
                    listSize={datasets.barangays.allData.length}
                    maxBar={10}
                    data={[...datasets.barangays.allData].sort((a, b) => a[22] - b[22])}
                    xKey={22}
                    yKey={1}
                    title={'Ave. Travel Times (in mins)'}
                    onLabelClick={changeBarangay}
                    paginationFunc={visStateActions.changeOriPage}
                    reverseFunc={visStateActions.sortOriReverse}
                    analysisRankingReverse={visState.oriReverse}
                    analysisRankingPage={visState.oriPage}
                  />
                </div>
              ) : null}

            {/* {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Temporal' ? (
                <div className = "breakdown-analysis__section">
                  <PaginatedRanking
                    // floatFormat
                    listSize={SHORTEST_TRAVEL_TIMES.length}
                    maxBar={10}
                    data={SHORTEST_TRAVEL_TIMES}
                    xKey={'time'}
                    yKey={'name'}
                    title={'Shortest Ave. Travel Times (in mins)'}
                    onLabelClick={changeBarangay}
                    paginationFunc={visStateActions.changeOriPage}
                    reverseFunc={visStateActions.sortOriReverse}
                    analysisRankingReverse={visState.oriReverse}
                    analysisRankingPage={visState.oriPage}
                  />
                </div>
              ) : null} */}

            {/* Economic Indicator */}
            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Economic' ? (
                <div className = "breakdown-analysis__section">

                </div>
              ) : null}

            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Economic' ? (
                <div className = "breakdown-analysis__section">
                  <PaginatedRanking
                    // floatFormat
                    listSize={HIGHEST_COSTS.length}
                    maxBar={10}
                    data={HIGHEST_COSTS}
                    xKey={'cost'}
                    yKey={'name'}
                    title={'Highest Travel Costs (in pesos)'}
                    onLabelClick={changeBarangay}
                    paginationFunc={visStateActions.changeOriPage}
                    reverseFunc={visStateActions.sortOriReverse}
                    analysisRankingReverse={visState.oriReverse}
                    analysisRankingPage={visState.oriPage}
                  />
                </div>
              ) : null}

            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Economic' ? (
                <div className = "breakdown-analysis__section">
                  <PaginatedRanking
                    // floatFormat
                    listSize={LOWEST_COSTS.length}
                    maxBar={10}
                    data={LOWEST_COSTS}
                    xKey={'cost'}
                    yKey={'name'}
                    title={'Lowest Travel Costs (in pesos)'}
                    onLabelClick={changeBarangay}
                    paginationFunc={visStateActions.changeOriPage}
                    reverseFunc={visStateActions.sortOriReverse}
                    analysisRankingReverse={visState.oriReverse}
                    analysisRankingPage={visState.oriPage}
                  />
                </div>
              ) : null}

            {/* Physical Indicator */}
            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Physical' ? (
                <div className = "breakdown-analysis__section">
                  <PaginatedRanking
                    floatFormat
                    listSize={10}
                    maxBar={10}
                    data={bgyIncl}
                    xKey={selected}
                    yKey={'name'}
                    title={'% of Respondents Flooded per Barangay'}
                    onLabelClick={changeBarangay}
                    paginationFunc={visStateActions.changeAnalysisRankPage}
                    reverseFunc={visStateActions.sortAnalysisReverse}
                    analysisRankingReverse={visState.analysisRankingReverse}
                    analysisRankingPage={visState.analysisRankingPage}
                    legends={legends}
                  />
                </div>
              ) : null}

            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Physical' ? (
                <div className = "breakdown-analysis__section">
                  <PhysInd>
                    <PercentPhys>33%</PercentPhys> of respondents from the city will cancel their trips during flooding
                  </PhysInd>
                </div>
              ) : null}

            {/* {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Physical' ? (
                <div className = "breakdown-analysis__section">
                  {console.log('city flooding')}
                  {console.log(CITY_FLOODING.name)}
                  {console.log(CITY_FLOODING.rate)}
                  <StackedBarChart
                    title={'For Baguio'}
                    values={[0.33, 0.67]}
                    legendLabels={['Yes', 'No']}
                    showLegend
                    // xKeyArr={CITY_FLOODING}
                    // showLegend
                  />
                </div>
              ) : null} */}

            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Physical' ? (
                <div className = "breakdown-analysis__section">
                  <PaginatedRanking
                    floatFormat
                    listSize={bgyIncl.length}
                    maxBar={10}
                    data={bgyIncl}
                    xKey={selected}
                    yKey={'name'}
                    title={'% of Respondents Who Will Cancel their Trips During Flooding'}
                    onLabelClick={changeBarangay}
                    paginationFunc={visStateActions.changeAnalysisRankPage}
                    reverseFunc={visStateActions.sortAnalysisReverse}
                    analysisRankingReverse={visState.analysisRankingReverse}
                    analysisRankingPage={visState.analysisRankingPage}
                    legends={legends}
                  />
                </div>
              ) : null}

            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Physical' ? (
                <div className = "breakdown-analysis__section">
                  <PhysInd>
                    Additional Travel Cost
                  </PhysInd>
                </div>
              ) : null}

            {/* Psychological Indicator */}
            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Psychological' ? (
                <div className = "breakdown-analysis__section">

                </div>
              ) : null}

            {/* Physiological Indicator */}
            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Physiological' ? (
                <div className = "breakdown-analysis__section">

                </div>
              ) : null}

            {/* Sustainability Indicator */}
            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Sustainability' ? (
                <div className = "breakdown-analysis__section">
                  <PhysInd>
                    Breakdown
                  </PhysInd>
                </div>
              ) : null}

            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Sustainability' ? (
                <div className = "breakdown-analysis__section">
                  <PhysInd>
                    Energy Use
                  </PhysInd>
                </div>
              ) : null}

            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Sustainability' ? (
                <div className = "breakdown-analysis__section">
                  <PhysInd>
                    Health Contribution
                  </PhysInd>
                </div>
              ) : null}

            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Sustainability' ? (
                <div className = "breakdown-analysis__section">
                  <PhysInd>
                    GHG Social Cost Contribution
                  </PhysInd>
                </div>
              ) : null}

            {/* Performance Indicator */}
            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Performance' ? (
                <div className = "breakdown-analysis__section">

                </div>
              ) : null}

            {/* Fairness Indicator */}
            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl && ACTIVE_INDICATOR_LABEL == 'Fairness' ? (
                <div className = "breakdown-analysis__section">

                </div>
              ) : null}

            {!visState.activeBarangay &&
              visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value &&
              bgyIncl ? (
                <div className = "breakdown-analysis__section">
                  <RelatedIndWrapper>
                    Related Indicators
                    <RelatedIndItemWrapper>
                      <RelatedIndItem>Spatial</RelatedIndItem>
                      <RelatedIndItem>Temporal</RelatedIndItem>
                    </RelatedIndItemWrapper>
                  </RelatedIndWrapper>
                </div>
              ) : null}
            </BreakdownAnalysis>
          </AnalysisSectionWrapper>
        </div>
      </WidgetContainer>

      // <TimeWidget
      //   fields={datasets[filters[enlargedFilterIdx].dataId].fields}
      //   setFilterPlot={visStateActions.setFilterPlot}
      //   setFilter={visStateActions.setFilter}
      //   toggleAnimation={visStateActions.toggleAnimation}
      //   updateAnimationSpeed={visStateActions.updateAnimationSpeed}
      //   enlargeFilter={visStateActions.enlargeFilter}
      //   width={Math.min(maxWidth, enlargedFilterWidth)}
      //   isAnyFilterAnimating={isAnyFilterAnimating}
      //   enlargedIdx={enlargedFilterIdx}
      //   filter={filters[enlargedFilterIdx]}
      // />
    );
  };

  BottomWidget.propTypes = propTypes;

  return BottomWidget;
}

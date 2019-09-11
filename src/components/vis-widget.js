
import React from 'react';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { IconRoundSmall } from 'components/common/styled-components';
import { Close } from 'components/common/icons';

import PropTypes from 'prop-types';
import {
  INDICATORS,
  BGY_DATA_DISPLAY,
  AMENITY_DATA_INDICES,
  OD_DATA_INDICES,
  SAMPLE_DATA_AMENITIES,
  SAMPLE_DEMOGRAPHICS_SEX,
  SAMPLE_DEMOGRAPHICS_AGE
} from 'utils/filter-utils';
// import {subDivideDestinationData} from 'utils/plexus-utils/sample-data-utils';
import {
  TRANSPORT_MODES,
  SEGMENTED_DESTINATIONS,
  BGY_MODE_SHARE,
  BGY_DEMOGRAPHICS,
  M_SEX,
  M_INCOME,
  M_AGE,
  MS_SEX,
  generateModeShareDemographics,
  MS_INCOME,
  MS_AGE,
  TRANSPORT_MODES_LABELS
} from 'utils/plexus-utils/sample-data-utils';

// import {scaleLinear} from 'd3-scale';

import BarChartFactory from './plexus-analysis/bar-chart';
import StackedBarChartFactory from './plexus-analysis/stacked-bar';
import StackedBarGroupFactory from './plexus-analysis/stacked-bar-group';
import ParallelCoordinatesKFactory from './plexus-analysis/parallel-coordinates';
import ParallelCoordinatesD3Factory from './plexus-analysis/parallel-coordinates-d3';
import ScatterPlotFactory from './plexus-analysis/scatter-plot';
import DonutChartFactory from './plexus-analysis/donut-chart';
import RankingFactory from './plexus-analysis/ranking';

import { SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER } from 'constants';

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

const ControlPanel = styled.div`
  display: flex;
  background-color: ${props => props.theme.sidePanelHeaderBg};
  justify-content: space-between;
  width: 100%;
  padding: 6px 12px;
  position: sticky;
  top: 0;
  z-index: 1;

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

const ControlBtn = styled.button`
  cursor: pointer;
  color: ${props => props.theme.labelColor};
  background: none;
  border: none;
`;

const WidgetContainer = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  position: absolute;
  // padding-top: ${props => props.theme.sidePanel.margin.top}px;
  // padding-right: ${props => props.theme.sidePanel.margin.right}px;
  // padding-bottom: ${props => props.theme.sidePanel.margin.bottom}px;
  // padding-left: ${props => props.theme.sidePanel.margin.left}px;
  bottom: 0;
  right: 0;
  z-index: 5;
  // display:none;
 
  // maxwidth: ${props => props.width}px;
  // maxwidth: 1200px;
  // width: 35vw;
  // width: 1080px;
  // width: 75vw;
  width: ${props => props.width}px;
  // padding: 20px 0;

  .bottom-widget--inner {
    background-color: ${props => props.theme.sidePanelBg};
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100vh;   
    // overflow-y: scroll;  
    overflow-x:hidden;   
  }

  // .bottom-widget--inner {
  //   background-color: ${props => props.theme.sidePanelBg};
  //   position: relative;
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: flex-start;
  //   align-items: flex-start;
  //   height: auto;   
  //   overflow: scroll;     
  // }

  .bottom-widget--content {
    padding-right: ${innerPdSide}px;
    padding-left: ${innerPdSide}px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100vh;    
  }

  .bottom-widget--info {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: flex-start;
  }

  .bottom-widget--info-title {
    font-weight: 500;
    font-size: 1.8em;
    line-height: 1;
    margin-top:25px;
    color: #fff;
    // color: ${props => props.theme.labelColor};
  }

  .bottom-widget--info-desc {
    font-size: 1.2em;
    font-weight: 400;
    color: ${props => props.theme.labelColor};    
    // color: #C3C9C5;
    padding-top: 10px;
    max-width: 800px;
    line-height: 1.3em;
    // font-size: 1.2em;
    // font-weight: 400;
  }
`;

const DescriptionBlock = styled.div`
  font-size: 1.2em;
  font-weight: 400;
  color: #C3C9C5;
  padding-top: 10px;
  max-width: 800px;
  line-height: 1.3em;
`;

const PBlock = styled.div`
  color: ${props => props.theme.labelColor};
  float: left;
  margin-top: 20px;
`;

const VisRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 15px;
  margin-bottom: 15px;

  > * {
    &:not(:first-child) {
      margin-left: 20px;
    }
  }
`;

const BoldBlock = styled.div`
font-size: 2.5em;
font-weight: 900;
color: #C3C9C5;
width: 150px;
line-height: 1.3em;
`;

VisWidgetFactory.deps = [
  BarChartFactory,
  ParallelCoordinatesKFactory,
  ParallelCoordinatesD3Factory,
  DonutChartFactory,
  ScatterPlotFactory,
  StackedBarChartFactory,
  StackedBarGroupFactory,
  RankingFactory,
];

export default function VisWidgetFactory(
  BarChart,
  ParallelCoordinatesK,
  ParallelCoordinatesD3,
  DonutChart,
  ScatterPlot,
  StackedBarChart,
  StackedBarGroup,
  Ranking
) {
  const VisWidget = props => {
    const {
      datasets,
      filters,
      visStateActions,
      uiStateActions,
      uiState,
      sidePanelWidth,
      selected,
      visState,
      layers,
      mapLayers,
      containerW,
      isOpen,
      toggleOpen
    } = props;

    let bgyIncl,
      amtyCnt,
      destCnt,
      oriCnt,
      destMax;

    // const enlargedFilterWidth = isOpen ? containerW - sidePanelWidth : containerW;
    // const currView = selected;
    const maxWidth = 1080;
    // const widgetWidth = Math.min(maxWidth, containerW + 200);
    const widgetWidth = Math.min(containerW - 340);
    // const DEFAULT_LIST = 5;

    if (datasets.barangays) {
      if (datasets.barangays.data) {
        // console.error(datasets);
        // formatted barangay data
        bgyIncl = [];
        let bgyRef = {};

        // OPTION A: map bgy names to id for reference (filtered bgys)
        datasets.barangays.allData.forEach(d => {
          let obj = {};
          BGY_DATA_DISPLAY.forEach(b => {
            obj[b.id] = d[b.idx];
          });

          bgyRef[obj['id']] = obj['name'];
        });

        // format filtered barangays
        datasets.barangays.data.forEach(d => {
          let obj = {};
          BGY_DATA_DISPLAY.forEach(b => {
            obj[b.id] = d[b.idx];
          });

          // OPTION B: map bgy names to id for reference (ALL bgys)
          // bgyRef[obj['id']] = obj['name'];

          bgyIncl.push(obj);
        });
        bgyIncl = bgyIncl.sort((a, b) => b[selected] - a[selected]);

        // format amenities
        let inserted = {};
        amtyCnt = [];
        datasets.amenities.allData.forEach(d => {
          let key = d[AMENITY_DATA_INDICES['class']];

          if (key in inserted) {
            amtyCnt.filter(a => a.name == key)[0].count += 1;
          } else {
            inserted[key] = 0;
            amtyCnt.push({
              name: key,
              count: 1
            });
          }
        });

        // format origins and destinations
        inserted = {};
        let oInserted = {};
        destCnt = [];
        oriCnt = [];

        datasets.pairs.allData.forEach(d => {
          let key = d[OD_DATA_INDICES['d_id']];
          let oKey = d[OD_DATA_INDICES['o_id']];

          if (key in inserted) {
            destCnt.filter(d => d.id == key)[0].count +=
              d[OD_DATA_INDICES['count']];
          } else {
            inserted[key] = 0;
            destCnt.push({
              name: bgyRef[key],
              id: key,
              count: d[OD_DATA_INDICES['count']]
            });
          }

          if (oKey in oInserted) {
            oriCnt.filter(d => d.id == oKey)[0].count +=
              d[OD_DATA_INDICES['count']];
          } else {
            oInserted[oKey] = 0;
            oriCnt.push({
              name: bgyRef[oKey],
              id: oKey,
              count: d[OD_DATA_INDICES['count']]
            });
          }
        });
        // console.error(bgyIncl);
        // get maximum
        destMax = destCnt.reduce((prev, current) =>
          prev.count > current.count ? prev : current
        ).count;

        // filters undefined barangays
        destCnt = destCnt.filter(d => d.name);
      }
    }

    const changeBarangay = id => {
      // console.error('set bgy');
      let idIndex = BGY_DATA_DISPLAY.filter(bdd => bdd.id == 'id')[0].idx;
      let newBgy = datasets.barangays.data.filter(b => b[idIndex] == id)[0];
      // console.error(newBgy);
      visStateActions.setActiveBarangay(newBgy);
    };

    // generateModeShareDemographics();
    // let demo = generateDemographics();
    // console.error(demo);

    // const destinations = subDivideDestinationData();
    // console.error(destinations);

    const visBlockDescr = {
      overview: {
        title: 'Overview of All Indicator Scores of a Barangay',
        desc: 'This is a multi-indicator explorer of the transport desirability framework in the city. Each line indicates a barangay, while each vertical line is the values of an indicator. Multiple lines going to a single point signifies that there are a lot of barangays that have similar indicator scores. Lines converging to the top of the coordinates means that many barangays have a higher score, while lines converging at the bottom specifies that many barangays have a lower score. This can be filtered using the range filters found in the left panel.'
      },
      scatterPlot: {
        title: 'Relationship of Transport Desirability with Indicators',
        desc: 'These scatter plots show the relationship of the transport desirability score and each indicator. From these, you can see how much each indicator affects the overall desirability score - if it has a direct (diagonal line going up), indirect (diagonal line going down), or no relationship at all. This can also be filtered using the range filters found in the left panel.',
      },
      amenities: {
        title: 'City Amenities and Frequented Destinations',
        desc: 'The number of each amenity category located in the city is shown here. Additionally, frequented destinations are ranked in descending order and are divided by transport mode. Each color in the bar chart represents a transportation mode going to that barangay. Longer bars mean that many individuals utilize this certain transport mode. Hovering the bars will show what type of mode share it represents and how many people use it.',
      },
      demographics: {
        title: 'Survey Respondents by Demographic',
        desc: 'This section shows the survey respondents divided by sex, income level, and age. It is composed of two visualizations: a donut chart for the distribution of survey respondents by demographic for the whole city, and a stacked bar chart for each barangay. Each color in the charts represent a certain demographic and its corresponding count. Hovering on these will show their information.',
      }
    };

    const scatterData = [
      {
        title: 'Spatial X Desirability',
        xKey: '',
        xKey: 'desirability',
        yKey: 'spatial',
        xLabel: 'Transport Desirability',
        yLabel: 'Spatial'
      },
      {
        title: 'Temporal X Desirability',
        xKey: '',
        xKey: 'desirability',
        yKey: 'temporal',
        xLabel: 'Transport Desirability',
        yLabel: 'temporal'
      },
      {
        title: 'Economic X Desirability',
        xKey: '',
        xKey: 'desirability',
        yKey: 'economic',
        xLabel: 'Transport Desirability',
        yLabel: 'economic'
      },
      {
        title: 'Physical X Desirability',
        xKey: '',
        xKey: 'desirability',
        yKey: 'physical',
        xLabel: 'Transport Desirability',
        yLabel: 'Physical'
      },
      {
        title: 'Psychological X Desirability',
        xKey: '',
        xKey: 'desirability',
        yKey: 'psychological',
        xLabel: 'Transport Desirability',
        yLabel: 'Psychological'
      },
      {
        title: 'Physiological X Desirability',
        xKey: '',
        xKey: 'desirability',
        yKey: 'physiological',
        xLabel: 'Transport Desirability',
        yLabel: 'Physiological',
      },
      {
        title: 'Sustainability X Desirability',
        xKey: '',
        xKey: 'desirability',
        yKey: 'sustainability',
        xLabel: 'Transport Desirability',
        yLabel: 'Sustainability'
      },
      {
        title: 'Performance X Desirability',
        xKey: '',
        xKey: 'desirability',
        yKey: 'performance',
        xLabel: 'Transport Desirability',
        yLabel: 'Performance'
      },
      {
        title: 'Fairness X Desirability',
        xKey: '',
        xKey: 'desirability',
        yKey: 'fairness',
        xLabel: 'Transport Desirability',
        yLabel: 'Fairness',
      },
    ];

    const scatterComp = [];

    if (bgyIncl) {
      for (var i = 0; i < 3; i++) { // 0 1 2 3 
        // let vr = <VisRow />;
        for (var j = 0; j < 3; j++) {
          scatterComp.push(
            <ScatterPlot
              title={scatterData[i * 3 + j].title}
              data={bgyIncl}
              xKey={scatterData[i * 3 + j].xKey}
              yKey={scatterData[i * 3 + j].yKey}
              xLabel={scatterData[i * 3 + j].xLabel}
              yLabel={scatterData[i * 3 + j].yLabel}
            />
          )
        }
        // scatterComp.push(vr);
      }
    }

    return (
      <WidgetContainer width={widgetWidth}>
        <div className={isOpen ? "bottom-widget--inner" : "bottom-widget--close"}>
          {/* TODO move to parent */}
          <ControlPanel>
            <div className="control-panel-item">
              <p className="control-panel__title">Data Summary</p>
            </div>
            <div className="control-panel-item">
              <IconRoundSmall
                onClick={() => toggleOpen(!isOpen)}
              >
                <Close
                  height="12px"
                  onClick={() => toggleOpen(!isOpen)}
                />
              </IconRoundSmall>
            </div>
          </ControlPanel>
          {isOpen ?
            (uiState.bottomTab != 'default' ?
              <div className="bottom-widget--content">
                <div className="bottom-widget--info">
                  <div className="bottom-widget--info-title">
                    {visBlockDescr.overview.title}
                  </div>
                  <div className="bottom-widget--info-desc">
                    {visBlockDescr.overview.desc}
                  </div>
                </div>
                {bgyIncl ? (
                  <ParallelCoordinatesD3
                    data={bgyIncl}
                    selected={selected}
                    width={widgetWidth}
                  />
                ) : null}

                <PBlock><i>* Income is represented as peso and is the average income of the barangay.</i></PBlock>

                <div className="bottom-widget--info">
                  <div className="bottom-widget--info-title">
                    {visBlockDescr.scatterPlot.title}
                  </div>
                  <div className="bottom-widget--info-desc">
                    {visBlockDescr.scatterPlot.desc}
                  </div>
                </div>

                {bgyIncl ? (
                  <VisRow>
                    {scatterComp.slice(0, 3)}
                  </VisRow>
                ) : null}

                {bgyIncl ? (
                  <VisRow>
                    {scatterComp.slice(3, 6)}
                  </VisRow>
                ) : null}

                {bgyIncl ? (
                  <VisRow>
                    {scatterComp.slice(6, 9)}
                  </VisRow>
                ) : null}

                <div className="bottom-widget--info">
                  <div className="bottom-widget--info-title">
                    {visBlockDescr.amenities.title}
                  </div>
                  <div className="bottom-widget--info-desc">
                    {visBlockDescr.amenities.desc}
                  </div>
                </div>
                {/* TODO: change to TOP destinations  */}
                {bgyIncl ? (
                  <VisRow>
                    <BarChart
                      data={amtyCnt}
                      xKey={'count'}
                      yKey={'name'}
                      title={'City Amenities'}
                      height={250}
                    />

                    <BarChart
                      data={SEGMENTED_DESTINATIONS.filter(d => d.name)
                        .sort((a, b) => b['count'] - a['count'])
                        .slice(0, 10)
                        .reverse()}
                      xKeyArr={TRANSPORT_MODES}
                      onLabelClick={changeBarangay}
                      yKey={'name'}
                      title={'Frequent destinations'}
                      height={250}
                      domainMax={destMax}
                    />
                  </VisRow>
                ) : null}

                <div className="bottom-widget--info">
                  <div className="bottom-widget--info-title">
                    {visBlockDescr.demographics.title}
                  </div>
                  <div className="bottom-widget--info-desc">
                    {visBlockDescr.demographics.desc}
                  </div>
                </div>
                {/* DEMOGRAPHIS */}
                {bgyIncl ? (
                  <VisRow>
                    <StackedBarChart
                      title={'By Gender'}
                      values={BGY_DEMOGRAPHICS}
                      xKeyArr={M_SEX}
                      showLegend
                    />
                    <StackedBarGroup
                      title={'Mode Share By Gender'}
                      values={MS_SEX}
                      xKeyArr={TRANSPORT_MODES}
                      xKeyArrLabels={TRANSPORT_MODES_LABELS}
                      showLegend
                    />
                  </VisRow>
                ) : null}

                {bgyIncl ? (
                  <VisRow>
                    <StackedBarChart
                      title={'By Income Level'}
                      values={BGY_DEMOGRAPHICS}
                      xKeyArr={M_INCOME}
                      showLegend
                    />
                    <StackedBarGroup
                      title={'Mode Share By Income Level'}
                      values={MS_INCOME}
                      xKeyArr={TRANSPORT_MODES}
                      xKeyArrLabels={TRANSPORT_MODES_LABELS}
                      categoryLabel={'Income Level'}
                      showLegend
                    />

                  </VisRow>
                ) : null}

                {bgyIncl ? (
                  <VisRow>
                    <StackedBarChart
                      title={'By Age'}
                      values={BGY_DEMOGRAPHICS}
                      xKeyArr={M_AGE}
                      showLegend
                    />
                    <StackedBarGroup
                      title={'Mode Share By Age'}
                      values={MS_AGE}
                      xKeyArr={TRANSPORT_MODES}
                      xKeyArrLabels={TRANSPORT_MODES_LABELS}
                      categoryLabel={'Age Group'}
                      showLegend
                    />

                  </VisRow>
                ) : null}
              </div> :


              //
              //      
              //      D A T A    S T O R Y   
              //
              //

              <div className="bottom-widget--content">
                <div className="bottom-widget--info">
                  <div className="bottom-widget--info-title">
                    Transport Desirability Score of Baguio
              </div>
                  <div className="bottom-widget--info-desc">
                    Insert a detailed description of Transport Desirability here. Baguio is ranked 130th of 200 cities in the Philippines based on Transport Desirability.
              </div>
                </div>
                <VisRow>
                  <Ranking
                    // floatFormat
                    data={[
                      {
                        name: 'Spatial',
                        value: 49.42,
                      },
                      {
                        name: 'Temporal',
                        value: 49.72,
                      },
                      {
                        name: 'Economic',
                        value: 50.29,
                      },
                      {
                        name: 'Physical',
                        value: 49.86,
                      },
                      {
                        name: 'Psychological',
                        value: 47.24,
                      },
                      {
                        name: 'Physiological',
                        value: 53.05,
                      },
                      {
                        name: 'Sustainability',
                        value: 51.12,
                      },
                      {
                        name: 'Performance',
                        value: 48.16,
                      },
                      {
                        name: 'Fairness',
                        value: 49.88,
                      },
                    ]}
                    xKey={'value'}
                    yKey={'name'}
                    title={'City Indicators'}
                    maxColItems={5}
                  />
                </VisRow>

                <DescriptionBlock>
                  The next two sections highlight the best features of the city's transport system.
            </DescriptionBlock>

                <div className="bottom-widget--info">
                  <div className="bottom-widget--info-title">
                    Spatial
              </div>
                  <div className="bottom-widget--info-desc">
                    Insert a detailed description of the Spatial indicator here. What constitutes its score? What does it mean if it's good? If it's bad? How can I improve it?
              </div>
                </div>
                <VisRow>
                  <Ranking
                    noted={true}
                    data={[
                      {
                        name: 'Food Establishments',
                        value: 127,
                        note: 'More than 50'
                      },
                      {
                        name: 'Hospitals',
                        value: 6,
                        note: 'Reaches more than 60% of barangays'
                      },
                      {
                        name: 'Schools',
                        value: 13,
                        note: 'Reaches more than 57% of barangays'
                      },
                    ]}
                    xKey={'value'}
                    yKey={'name'}
                  />
                </VisRow>

                <DescriptionBlock>
                  However, 6 out of 129 barangays do not meet the standard barangay amenity counts.
            </DescriptionBlock>

                <VisRow>
                  {/* <StackedBarChart
                    title={'Distance of All Trips'}
                    values={[
                      {
                        'Less than 5km': 33,
                        '6km to 20km': 45,
                        '21km to 50km': 21,
                        '51km above': 13,
                      }
                    ]}
                    xKeyArr={[
                      'Less than 5km',
                      '6km to 20km',
                      '21km to 50km',
                      '51km above'
                    ]}
                    // xKeyArrLabels={TRANSPORT_MODES_LABELS}
                    // legendOrientation={'horizontal'}
                    showLegend
                    isXKeyArrReg
                  /> */}
                  <BarChart
                    data={[
                      {
                        name: 'Less than 5km',
                        count: 30,
                      },
                      {
                        name: '6km to 20km',
                        count: 42,
                      },
                      {
                        name: '21km to 50km',
                        count: 21,
                      },
                      {
                        name: '51km above',
                        count: 7,
                      },
                    ].reverse()}
                    xKey={'count'}
                    yKey={'name'}
                    title={'Average Distance of All Trips (in %)'}
                    height={180}
                  />


                  <StackedBarChart
                    title={'Mode Share'}
                    values={BGY_MODE_SHARE}
                    xKeyArr={TRANSPORT_MODES}
                    xKeyArrLabels={TRANSPORT_MODES_LABELS}
                    // legendOrientation={'horizontal'}
                    showLegend
                    isXKeyArrReg
                  />

                </VisRow>

                <DescriptionBlock>
                  Insights on the trip distance and mode share.
                </DescriptionBlock>

                <div className="bottom-widget--info">
                  <div className="bottom-widget--info-title">
                    Temporal
                  </div>
                  <div className="bottom-widget--info-desc">
                    Insert a detailed description of the Temporal indicator here. What constitutes its score? What does it mean if it's good? If it's bad? How can I improve it?
                  </div>
                </div>

                <VisRow>
                  {/* <StackedBarChart
                    title={'Average Distance of All Trips'}
                    values={[
                      {
                        'Less than 5km': 33,
                        '6km to 20km': 45,
                        '21km to 50km': 21,
                        '51km above': 7,
                      }
                    ]}
                    xKeyArr={[
                      'Less than 5km',
                      '6km to 20km',
                      '21km to 50km',
                      '51km above'
                    ]}
                    showLegend
                    isXKeyArrReg
                  /> */}

                  <BarChart
                    data={[
                      {
                        name: 'Less than 5km',
                        count: 30,
                      },
                      {
                        name: '6km to 20km',
                        count: 42,
                      },
                      {
                        name: '21km to 50km',
                        count: 21,
                      },
                      {
                        name: '51km above',
                        count: 7,
                      },
                    ].reverse()}
                    xKey={'count'}
                    yKey={'name'}
                    title={'Average Distance of All Trips (in %)'}
                    height={180}
                  />

                  <BarChart
                    data={[
                      {
                        name: 'Less than 10 minutes',
                        count: 18,
                      },
                      {
                        name: '11 to 30 minutes',
                        count: 39,
                      },
                      {
                        name: '31 minutes to 1 hour',
                        count: 19,
                      },
                      {
                        name: '1 hour to 2 hours',
                        count: 14,
                      },
                      {
                        name: '2 hours above',
                        count: 10,
                      },
                    ].reverse()}
                    xKey={'count'}
                    yKey={'name'}
                    title={'Average Travel Times of All Trips (in %)'}
                    height={180}
                  />

                  {/* <StackedBarChart
                    title={'Average Travel Times of All Trips'}
                    values={[
                      {
                        'Less than 10 minutes': 21,
                        '11 to 30 minutes': 81,
                        '31 minutes to 1 hour': 68,
                        '1 hour to 2 hours': 38,
                        '2 hours above': 14,
                      }
                    ]}
                    xKeyArr={[
                      'Less than 10 minutes',
                      '11 to 30 minutes',
                      '31 minutes to 1 hour',
                      '1 hour to 2 hours',
                      '2 hours above'
                    ]}
                    showLegend
                    isXKeyArrReg
                  /> */}
                </VisRow>
                <VisRow>
                  <Ranking
                    // floatFormat
                    data={[
                      {
                        name: 'Scout Barrio to Irisan',
                        value: '79km',
                      },
                      {
                        name: 'Irisan to Crystal Cove',
                        value: '72km',
                      },
                      {
                        name: 'Irisan to Fort del Pilar',
                        value: '67km',
                      },
                    ]}
                    xKey={'value'}
                    yKey={'name'}
                    title={'Highest Travel Distances'}
                  />

                  <Ranking
                    // floatFormat
                    data={[
                      {
                        name: 'Kirad to Happy Hollow',
                        value: '154 minutes',
                      },
                      {
                        name: 'Irisan to Irisan',
                        value: '133 minutes',
                      },
                      {
                        name: 'Lourdes Subdivision to Happy Hollow',
                        value: '122 minutes',
                      },
                    ]}
                    xKey={'value'}
                    yKey={'name'}
                    title={'Highest Travel Times'}
                  />
                </VisRow>
                <VisRow>
                  <StackedBarChart
                    title={'Mode Share'}
                    values={BGY_MODE_SHARE}
                    xKeyArr={TRANSPORT_MODES}
                    xKeyArrLabels={TRANSPORT_MODES_LABELS}
                    legendOrientation={'horizontal'}
                    showLegend
                    isXKeyArrReg
                  />
                </VisRow>

                <DescriptionBlock>
                  Overall insights and summary goes here.
                </DescriptionBlock>

                <div className="bottom-widget--info">
                  <div className="bottom-widget--info-title">
                    Economic
                  </div>
                  <div className="bottom-widget--info-desc">
                    Insert a detailed description of the Economic indicator here. What constitutes its score? What does it mean if it's good? If it's bad? How can I improve it?
                  </div>
                </div>

                <VisRow>
                  <StackedBarChart
                    title={'Demographics by Income Level'}
                    values={BGY_DEMOGRAPHICS}
                    xKeyArr={M_INCOME}
                    showLegend
                  />
                  <StackedBarGroup
                    title={'Mode Share By Income Level'}
                    values={MS_INCOME}
                    xKeyArr={TRANSPORT_MODES}
                    xKeyArrLabels={TRANSPORT_MODES_LABELS}
                    categoryLabel={'Income Level'}
                    showLegend
                  />
                </VisRow>

                <div className="bottom-widget--info">
                  <div className="bottom-widget--info-title">
                    Physical
                  </div>
                  <div className="bottom-widget--info-desc">
                    Insert a detailed description of the Physical indicator here. What constitutes its score? What does it mean if it's good? If it's bad? How can I improve it?
                  </div>
                </div>

                <VisRow>
                  <StackedBarChart
                    title={'Trips affected by Flooding'}
                    values={[20, 80]}
                    legendLabels={['No', 'Yes']}
                    // xKeyArr={M_INCOME}
                    showLegend
                  />
                  <DescriptionBlock>
                    About 80% of trips are affected by flooding. Insert possible causes and solutions.
                  </DescriptionBlock>
                </VisRow>

                <VisRow>
                  <StackedBarChart
                    title={'Trips affected by Flooding'}
                    values={[40, 60]}
                    legendLabels={['No', 'Yes']}
                    // xKeyArr={M_INCOME}
                    showLegend
                  />
                  <DescriptionBlock>
                    About 20% of trips are cancelled in the event of a flood. Insert possible causes and solutions.
                  </DescriptionBlock>
                </VisRow>

                <VisRow>
                  <BoldBlock>
                    + 20 Php
                  </BoldBlock>
                  <DescriptionBlock>
                    The increase in cost amounts to an average of 20 Php in the event of a flood.
                  </DescriptionBlock>
                </VisRow>

                <VisRow>
                  <BoldBlock>
                    + 30 mins
                  </BoldBlock>
                  <DescriptionBlock>
                    The increase in travel time amounts to an average of 30 minutes in the event of a flood.
                  </DescriptionBlock>
                </VisRow>

                <div className="bottom-widget--info">
                  <div className="bottom-widget--info-title">
                    Psychological
                  </div>
                  <div className="bottom-widget--info-desc">
                    Insert a detailed description of the Psychological indicator here. What constitutes its score? What does it mean if it's good? If it's bad? How can I improve it?
                  </div>

                  <VisRow>
                    <StackedBarChart
                      title={'Mode Share'}
                      values={BGY_MODE_SHARE}
                      xKeyArr={TRANSPORT_MODES}
                      xKeyArrLabels={TRANSPORT_MODES_LABELS}
                      legendOrientation={'horizontal'}
                      showLegend
                      isXKeyArrReg
                    />
                  </VisRow>
                </div>

                <div className="bottom-widget--info">
                  <div className="bottom-widget--info-title">
                    Performance
                  </div>
                  <div className="bottom-widget--info-desc">
                    Insert a detailed description of the Performance indicator here. What constitutes its score? What does it mean if it's good? If it's bad? How can I improve it?
                  </div>

                  <VisRow>
                    <StackedBarChart
                      title={'Mode Share'}
                      values={BGY_MODE_SHARE}
                      xKeyArr={TRANSPORT_MODES}
                      xKeyArrLabels={TRANSPORT_MODES_LABELS}
                      legendOrientation={'horizontal'}
                      showLegend
                      isXKeyArrReg
                    />
                  </VisRow>
                </div>
              </div>

            ) : null}
        </div>
      </WidgetContainer>
    );
  };

  VisWidget.propTypes = propTypes;

  return VisWidget;
}

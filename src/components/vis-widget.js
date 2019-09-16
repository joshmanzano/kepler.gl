
import React from 'react';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { IconRoundSmall } from 'components/common/styled-components';
import { Close } from 'components/common/icons';

import PropTypes from 'prop-types';
import {
  INDICATORS,
  BGY_DATA_DISPLAY,
  BGY_DATA_MS,
  AMENITY_DATA_INDICES,
  OD_DATA_INDICES,
  ANALYSIS_TABS_DEF,
  SAMPLE_DATA_AMENITIES,
  SAMPLE_DEMOGRAPHICS_SEX,
  SAMPLE_DEMOGRAPHICS_AGE
} from 'utils/filter-utils';
// import {subDivideDestinationData} from 'utils/plexus-utils/sample-data-utils';
import {
  TRANSPORT_MODES_SAMPLE,
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
  TRANSPORT_MODES_LABELS_SAMPLE
} from 'utils/plexus-utils/sample-data-utils';

import {
  DescriptionBlock,
  PBlock,
  VisRow,
  BoldBlock,
  ControlPanel,
  ContentWrapper
} from './plexus-analysis/data-summary-components'

import DataStory from './plexus-analysis/data-story';
import DataSummary from './plexus-analysis/data-summary';

import BarChartFactory from './plexus-analysis/bar-chart';
import StackedBarChartFactory from './plexus-analysis/stacked-bar';
import StackedBarGroupFactory from './plexus-analysis/stacked-bar-group';
import ParallelCoordinatesKFactory from './plexus-analysis/parallel-coordinates';
import ParallelCoordinatesD3Factory from './plexus-analysis/parallel-coordinates-d3';
import ScatterPlotFactory from './plexus-analysis/scatter-plot';
import DonutChartFactory from './plexus-analysis/donut-chart';
import RankingFactory from './plexus-analysis/ranking';

import { SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER } from 'constants';

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


const AnalysisSectionToggle = ({ activeTab, update }) => (
  <Tabs>
    {
      Object.keys(ANALYSIS_TABS_DEF).map((e) => (
        <Tab key={ANALYSIS_TABS_DEF[e].value} active={ANALYSIS_TABS_DEF[e].value === activeTab}
          onClick={() => { update(ANALYSIS_TABS_DEF[e].value); console.log(ANALYSIS_TABS_DEF[e].label + " " + ANALYSIS_TABS_DEF[e].value); }}>{ANALYSIS_TABS_DEF[e].label}</Tab>
      ))}
  </Tabs>
);

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
  width: ${props => props.width}px;

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
      destMax,
      modeShareCnt;

    // const enlargedFilterWidth = isOpen ? containerW - sidePanelWidth : containerW;
    // const currView = selected;
    const maxWidth = 1080;
    // const widgetWidth = Math.min(maxWidth, containerW + 200);
    const widgetWidth = Math.min(containerW - 340);
    // const DEFAULT_LIST = 5;

    if (datasets.barangays) {
      if (datasets.barangays.data) {
        console.error(datasets);
        // formatted barangay data

        bgyIncl = [];
        modeShareCnt = [];
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
          let objms = {};

          BGY_DATA_DISPLAY.forEach(b => {
            obj[b.id] = d[b.idx];
          });

          BGY_DATA_MS.forEach(b => {
            objms[b.id] = d[b.idx];
          });

          // OPTION B: map bgy names to id for reference (ALL bgys)
          // bgyRef[obj['id']] = obj['name'];

          bgyIncl.push(obj);
          modeShareCnt.push(objms);
        });
        bgyIncl = bgyIncl.sort((a, b) => b[selected] - a[selected]);
        console.error(bgyIncl);
        // console.error(bgyIncl);
        // console.error(modeShareCnt);
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
      for (var i = 0; i < 3; i++) {
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
          <AnalysisSectionToggle
            update={(activeAnalysisTab) => { uiStateActions.setBottomTab(activeAnalysisTab) }}
            activeTab={uiState.bottomTab} />
          {isOpen ?
            (uiState.bottomTab == 'profile' ?
              // <DataSummary
              // selected
              // barangays={bgyIncl}
              // amenities={amtyCnt}
              // widthParallelCoordinates={widgetWidth}
              // />
              <ContentWrapper>

                <div className="content-block">
                  {/* <div className="bottom-widget--content"> */}
                  <div className="content-wrapper__desc-wrapper">
                    <div className="content-wrapper__desc-wrapper__title">
                      {visBlockDescr.overview.title}
                    </div>
                    <div className="content-wrapper__desc-wrapper__desc">
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
                </div>

                <div className="content-block content-block--dark">
                  <div className="content-wrapper__desc-wrapper">
                    <div className="content-wrapper__desc-wrapper__title">
                      {visBlockDescr.scatterPlot.title}
                    </div>
                    <div className="content-wrapper__desc-wrapper__desc">
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

                </div>

                <div className="content-block">
                  <div className="content-wrapper__desc-wrapper">
                    <div className="content-wrapper__desc-wrapper__title">
                      {visBlockDescr.amenities.title}
                    </div>
                    <div className="content-wrapper__desc-wrapper__desc">
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

                      {/* <BarChart
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
                    /> */}
                    </VisRow>
                  ) : null}
                </div>
                <div className="content-block content-block--dark">
                  <div className="content-wrapper__desc-wrapper">
                    <div className="content-wrapper__desc-wrapper__title">
                      {visBlockDescr.demographics.title}
                    </div>
                    <div className="content-wrapper__desc-wrapper__desc">
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
                        xKeyArr={TRANSPORT_MODES_SAMPLE}
                        xKeyArrLabels={TRANSPORT_MODES_LABELS_SAMPLE}
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
                        xKeyArr={TRANSPORT_MODES_SAMPLE}
                        xKeyArrLabels={TRANSPORT_MODES_LABELS_SAMPLE}
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
                        xKeyArr={TRANSPORT_MODES_SAMPLE}
                        xKeyArrLabels={TRANSPORT_MODES_LABELS_SAMPLE}
                        categoryLabel={'Age Group'}
                        showLegend
                      />

                    </VisRow>
                  ) : null}
                </div>
              </ContentWrapper>
              : <DataStory
                amenities={amtyCnt}
                modeData={modeShareCnt} />)
            : null}
        </div>
      </WidgetContainer>
    );
  };

  VisWidget.propTypes = propTypes;

  return VisWidget;
}

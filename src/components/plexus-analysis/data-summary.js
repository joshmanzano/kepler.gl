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

import {
    DescriptionBlock,
    PBlock,
    VisRow,
    BoldBlock,
    ControlPanel,
    ContentWrapper
} from './data-summary-components'

import { BarChart } from './bar-chart';
import { StackedBarChart } from './stacked-bar';
import { StackedBarGroup } from './stacked-bar-group';
import { ParallelCoordinatesK } from './parallel-coordinates';
import { ParallelCoordinatesD3 } from './parallel-coordinates-d3';
import { ScatterPlot } from './scatter-plot';
import { DonutChart } from './donut-chart';
import { Ranking } from './ranking';

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



export default class DataSummary extends Component {


    render() {

        const {
            selected,
            barangays,
            amenities,
            widthParallelCoordinates,
        } = this.props;

        const scatterComp = [];

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                scatterComp.push(
                    <ScatterPlot
                        title={scatterData[i * 3 + j].title}
                        data={barangays}
                        xKey={scatterData[i * 3 + j].xKey}
                        yKey={scatterData[i * 3 + j].yKey}
                        xLabel={scatterData[i * 3 + j].xLabel}
                        yLabel={scatterData[i * 3 + j].yLabel}
                    />
                )
            }
        }


        return (

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
                    {barangays ? (
                        <ParallelCoordinatesD3
                            data={barangays}
                            selected={selected}
                            width={widthParallelCoordinates}
                        />
                    ) : null}

                    <PBlock><i>* Income is represented as peso and is the average income of the barangay.</i></PBlock>
                </div>
                <div className="content-block">
                    <div className="content-wrapper__desc-wrapper">
                        <div className="content-wrapper__desc-wrapper__title">
                            {visBlockDescr.scatterPlot.title}
                        </div>
                        <div className="content-wrapper__desc-wrapper__desc">
                            {visBlockDescr.scatterPlot.desc}
                        </div>
                    </div>

                    {barangays ? (
                        <VisRow>
                            {scatterComp.slice(0, 3)}
                        </VisRow>
                    ) : null}

                    {barangays ? (
                        <VisRow>
                            {scatterComp.slice(3, 6)}
                        </VisRow>
                    ) : null}

                    {barangays ? (
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
                    {barangays ? (
                        <VisRow>
                            <BarChart
                                data={amenities}
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
                </div><div className="content-block">
                    <div className="content-wrapper__desc-wrapper">
                        <div className="content-wrapper__desc-wrapper__title">
                            {visBlockDescr.demographics.title}
                        </div>
                        <div className="content-wrapper__desc-wrapper__desc">
                            {visBlockDescr.demographics.desc}
                        </div>
                    </div>
                    {/* DEMOGRAPHIS */}
                    {barangays ? (
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

                    {barangays ? (
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

                    {barangays ? (
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
                </div>
            </ContentWrapper>);
    }
}


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
    TRANSPORT_MODES_LABELS_SAMPLE
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

const TEST_INDICATOR_DATA = [
    {
        name: 'Spatial',
        value: 42.05,
    },
    {
        name: 'Psychological',
        value: 47.24,
    },
    {
        name: 'Performance',
        value: 48.16,
    },
    {
        name: 'Temporal',
        value: 49.72,
    },
    {
        name: 'Physical',
        value: 49.86,
    },
    {
        name: 'Fairness',
        value: 49.88,
    },
    {
        name: 'Economic',
        value: 50.29,
    },
    {
        name: 'Sustainability',
        value: 51.12,
    },
    {
        name: 'Physiological',
        value: 53.05,
    },
];
export default class DataStory extends Component {

    render() {
        const {modeData, amenities}=this.props;
        return (
            <ContentWrapper>
                <div className="content-block">
                    <div className="content-wrapper__desc-wrapper">
                        <div className="content-block__title">
                            The Transport Desirability Score of Baguio
                  </div>
                        <div className="content-wrapper__desc-wrapper__desc content-wrapper__desc-wrapper__desc--center">
                            <p>Transport Desirability is a weighted score based on nine different indicators. Baguio is ranked 130th of 200 cities in the Philippines based on Transport Desirability.</p>
                        </div>
                    </div>
                    <VisRow>
                        {/* <BarChart
                            data={TEST_INDICATOR_DATA.reverse()}
                            xKey={'value'}
                            yKey={'name'}
                            title={'City Indicators'}
                            height={250}
                        /> */}
                        <Ranking
                        // floatFormat
                        data={TEST_INDICATOR_DATA}
                        xKey={'value'}
                        yKey={'name'}
                        title={'City Indicators'}
                        maxColItems={5}
                    />
                    </VisRow>
                </div>

                <div className="content-block content-block--dark">
                    <div className="content-wrapper__desc-wrapper">
                        <div className="content-block__title">
                            The Best-Scoring Indicators
                  </div>
                        <div className="content-wrapper__desc-wrapper__desc content-wrapper__desc-wrapper__desc--center">
                        <p>The next two sections highlight the best features of the city's transport system.Insert a detailed description of Transport Desirability here.</p>
                  </div>
                    </div>

                    <div className="content-wrapper__desc-wrapper">
                        <div className="content-wrapper__desc-wrapper__title">
                            Physiological <span className="title-tag title-tag--good">53.05</span> 
                        </div>
                        <div className="content-wrapper__desc-wrapper__desc">
                            This indicator considers the <b>comfort</b> and <b>convenience</b> of transport modes in that area. When the score of the barangay is low, available transport modes in that area may be uncomfortable and inconvenient. Transport modes may be far from residents and may not be able to supply demand.
                            {/* Insert a detailed description of the Physiological indicator here. What constitutes its score? What does it mean if it's good? If it's bad? How can I improve it? */}
                        </div>
                    </div>

                    <VisRow>
                        <StackedBarChart
                            title={'Mode Share'}
                            values={modeData}
                            xKeyArr={TRANSPORT_MODES}
                            xKeyArrLabels={TRANSPORT_MODES_LABELS_SAMPLE}
                            legendOrientation={'horizontal'}
                            showLegend
                            isXKeyArrReg
                        />
                    </VisRow>
                    {/* </div> */}

                    <div className="content-wrapper__desc-wrapper">
                        <div className="content-wrapper__desc-wrapper__title">
                            Sustainability <span className="title-tag title-tag--good">51.12</span>
                        </div>
                        <div className="content-wrapper__desc-wrapper__desc">
                            {/* Insert a detailed description of the Physiological indicator here. What constitutes its score? What does it mean if it's good? If it's bad? How can I improve it? */}
                           <p>The <b>Sustainability</b> indicator considers energy use, health cost, and greenhouse gas (GHG) social cost of per transport mode in the area. When the score of the barangay is low, available transport modes in that area are less eco-friendly and may cause harmful effects to residents’ health and the environment.</p>
                        <li><b>Energy use</b> estimates the amount of energy/fuel used by a single person for transport purposes in a month.</li>
                        <li><b>Health cost</b> measures the contribution of each person to health-related costs in the city, because of airborne pollutants generated by his/her own transport activities in a month.</li>
                        <li><b>GHG Social cost</b> measures the contribution of each person to greenhouse gas (GHG) mitigation costs in the city, because of GHG emissions generated by his/her own transport activities in a month.</li> 
                  </div>
                    </div>

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
                            // xKeyArrLabels={TRANSPORT_MODES_LABELS_SAMPLE}
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
                            values={modeData}
                            xKeyArr={TRANSPORT_MODES}
                            xKeyArrLabels={TRANSPORT_MODES_LABELS_SAMPLE}
                            legendOrientation={'horizontal'}
                            showLegend
                            isXKeyArrReg
                        />
                    </VisRow>
                </div>

                <div className="content-block">
                <div className="content-wrapper__desc-wrapper">
                        <div className="content-block__title">
                            The Worst-Scoring Indicators
                  </div>
                        <div className="content-wrapper__desc-wrapper__desc content-wrapper__desc-wrapper__desc--center">
                        <p>The next three sections highlight the worst features of the city's transport system. Improving the conditions of aspects related to these indicators should be prioritized.</p>
                  </div>
                    </div>

                    <div className="content-wrapper__desc-wrapper">
                        <div className="content-wrapper__desc-wrapper__title">
                            Spatial <span className="title-tag title-tag--bad">42.05</span> 
                  </div>
                        <div className="content-wrapper__desc-wrapper__desc">
                        Spatial indicator refers to how accessible different types of amenities are (e.g. hospitals, schools) in an area. The lower the score of a barangay, the lesser the access to different amenities.
                        {/* Insert a detailed description of the Spatial indicator here. What constitutes its score? What does it mean if it's good? If it's bad? How can I improve it? */}
                  </div>
                    </div>
                    <VisRow>
                        <Ranking
                            // noted={true}
                            data={amenities}
                            title={'City Amenity Count'}
                            maxColItems={5}
                            xKey={'count'}
                            yKey={'name'}
                        />
                    </VisRow>
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
                    // xKeyArrLabels={TRANSPORT_MODES_LABELS_SAMPLE}
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
                            values={modeData}
                            xKeyArr={TRANSPORT_MODES}
                            xKeyArrLabels={TRANSPORT_MODES_LABELS_SAMPLE}
                            // legendOrientation={'horizontal'}
                            showLegend
                            isXKeyArrReg
                        />

                    </VisRow>

                    <DescriptionBlock>
                    It could be observed that a majority of trips in the city have a distance of around 6km to 20km. Since the trip distance is far, it may be said that amenities are not spread out around the city, thus forcing commuters to travel to farther places just to access some amenities.  Most of the city's trips are also via Jeepney.
                    </DescriptionBlock>

                    <div className="content-wrapper__desc-wrapper">
                        <div className="content-wrapper__desc-wrapper__title">
                            Psychological <span className="title-tag title-tag--bad">47.24</span>
                  </div>
                        <div className="content-wrapper__desc-wrapper__desc">
                        <b>Psychological</b> indicator considers <b>security, accidents,</b> and <b>privacy</b> per transport mode in that area. When the score of the barangay is low, the barangay may lack security and privacy in its available transport modes. Also, these transport modes may be accident prone. 
                        {/* Insert a detailed description of the Psychological indicator here. What constitutes its score? What does it mean if it's good? If it's bad? How can I improve it? */}
                  </div>

                        <VisRow>
                            <StackedBarChart
                                title={'Mode Share'}
                                values={modeData}
                                xKeyArr={TRANSPORT_MODES}
                                xKeyArrLabels={TRANSPORT_MODES_LABELS_SAMPLE}
                                legendOrientation={'horizontal'}
                                showLegend
                                isXKeyArrReg
                            />
                            <DescriptionBlock>
                            The people of Baguio predominantly use <b>jeepneys</b> in their daily traveling, having a <b>56.69%</b> transport mode share in the city. The <b>relatively low security, high susceptibility to accidents, and low privacy</b> of <b>jeepneys</b> may have largely contributed to the low Psychological indicator score.
                            </DescriptionBlock>
                        </VisRow>
                    </div>

                    <div className="content-wrapper__desc-wrapper">
                        <div className="content-wrapper__desc-wrapper__title">
                            Performance <span className="title-tag title-tag--bad">48.16</span>
                  </div>
                        <div className="content-wrapper__desc-wrapper__desc">
                        <p><b>Performance</b> indicator considers the <b>efficiency, resilience, connectivity, orderliness, and service reliability</b> of the transport mode. When the score of the barangay is low, available transport modes in that area may be less accessible and less reliable to residents. Improving the operations and distances of transport modes may lead to a higher score.</p>
                        <li><b>Efficiency</b> measures how 'worth it' a trip is by estimating the efficiency of transportation coming from a certain barangay, measured in terms of kilometers traveled per PhP100. This indicator also factors in the value of time for each person, based on his/her personal income.</li>
                        <li><b>Resilience</b> measures the vulnerability of travelers from a certain barangay to flooding, computed as a percentage of travelers affected by flood in their daily commute.</li>
                        <li><b>Connectivity</b> measures the ease of transferring from one mode to another when traveling from a certain barangay. <b>(Measured by transport mode)</b></li> 
                        <li><b>Orderliness</b> estimates the ease of commuting from a certain barangay, as indicated by the presence of proper queueing mechanisms, ticketing, security, etc. <b>(Measured by transport mode)</b></li> 
                        <li><b>Service reliability</b> measures the reliability of transport options from a certain barangay, based on historical maintenance breakdowns, and other issues. <b>(Measured by transport mode)</b></li> 
                        {/* Insert a detailed description of the Performance indicator here. What constitutes its score? What does it mean if it's good? If it's bad? How can I improve it? */}
                  </div>
                   
                    <VisRow>
                        <BoldBlock>
                            27%
                    </BoldBlock>
                        <DescriptionBlock>
                            The increase in cost amounts to an average of 27% in the event of a flood.
                    </DescriptionBlock>
                    </VisRow>

                    <VisRow>
                        <BoldBlock>
                            35%
                        </BoldBlock>
                        <DescriptionBlock>
                            The increase in travel time amounts to an average of 35% in the event of a flood.
                        </DescriptionBlock>
                    </VisRow>
                        <VisRow>
                            <StackedBarChart
                                title={'Mode Share'}
                                values={modeData}
                                xKeyArr={TRANSPORT_MODES}
                                xKeyArrLabels={TRANSPORT_MODES_LABELS_SAMPLE}
                                legendOrientation={'horizontal'}
                                showLegend
                                isXKeyArrReg
                            />

                            <DescriptionBlock>
                            The people of Baguio predominantly use <b>jeepneys</b> in their daily traveling, having a <b>56.69%</b> transport mode share in the city.
                            </DescriptionBlock>

                        </VisRow>
                    </div>
                </div>
                {/* <div className="content-wrapper__desc-wrapper">
                    <div className="content-wrapper__desc-wrapper__title">
                        Temporal
                  </div>
                    <div className="content-wrapper__desc-wrapper__desc">
                        Insert a detailed description of the Temporal indicator here. What constitutes its score? What does it mean if it's good? If it's bad? How can I improve it?
                  </div>
                </div>

                <VisRow> */}
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

                {/* <BarChart
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
                    /> */}

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
                {/* </VisRow> */}
                {/* <VisRow>
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
                        xKeyArrLabels={TRANSPORT_MODES_LABELS_SAMPLE}
                        legendOrientation={'horizontal'}
                        showLegend
                        isXKeyArrReg
                    />
                </VisRow>

                <DescriptionBlock>
                    Overall insights and summary goes here.
                </DescriptionBlock>

                <div className="content-wrapper__desc-wrapper">
                    <div className="content-wrapper__desc-wrapper__title">
                        Economic
                  </div>
                    <div className="content-wrapper__desc-wrapper__desc">
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
                        xKeyArrLabels={TRANSPORT_MODES_LABELS_SAMPLE}
                        categoryLabel={'Income Level'}
                        showLegend
                    />
                </VisRow> */}

                {/* <div className="content-wrapper__desc-wrapper">
                    <div className="content-wrapper__desc-wrapper__title">
                        Physical
                  </div>
                    <div className="content-wrapper__desc-wrapper__desc">
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
                </VisRow> */}

            </ContentWrapper>
        );
    }
}
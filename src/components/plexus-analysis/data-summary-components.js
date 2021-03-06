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

import styled from 'styled-components';

export const DescriptionBlock = styled.div`
font-size: 1.2em;
font-weight: 400;
color: #C3C9C5;
padding-top: 10px;
max-width: 800px;
line-height: 1.3em;

b {
  color: white;
  font-weight: 500;
}
`;

export const PBlock = styled.div`
color: ${props => props.theme.labelColor};
float: left;
margin-top: 20px;

b {
  color: white;
  font-weight: 500;
}
`;

export const VisRow = styled.div`
display: flex;
// justify-content: space-between;
align-items: flex-start;
margin-top: 15px;
margin-bottom: 15px;

> * {
  &:not(:first-child) {
    margin-left: 20px;
  }
}
`;

export const BoldBlock = styled.div`
font-size: 2.5em;
font-weight: 900;
color: white;
width: 90px;
line-height: 1.3em;
`;

export const ControlPanel = styled.div`
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

export const ControlBtn = styled.button`
  cursor: pointer;
  color: ${props => props.theme.labelColor};
  background: none;
  border: none;
`;

const innerPdSide = 32;

export const ContentWrapper = styled.div`
//   padding-right: ${innerPdSide}px;
//   padding-left: ${innerPdSide}px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100vh;   
  width: 100%; 

  b {
    color: white;
    font-weight: 500;
  }
li{
  margin-bottom: 10px;
}
  .content-block {
    // padding: 40px 32px;
    padding: 50px 112px;
    width: 100%;
  }

  .content-block--dark {
      background-color: #080e25;
  }

  .content-block__title {
    font-weight: 500;
    font-size: 1.8em;
    line-height: 1;
    margin-top:25px;
    color: #fff;
    width: 100%;
    text-align: center;
  }

  .content-wrapper__desc-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: flex-start;
  }

  .content-wrapper__desc-wrapper__title {
    font-weight: 500;
    font-size: 1.8em;
    line-height: 1;
    margin-top:25px;
    color: #fff;
    // color: ${props => props.theme.labelColor};
  }

  .content-wrapper__desc-wrapper__desc {
    font-size: 1.2em;
    font-weight: 400;
    color: ${props => props.theme.labelColor};    
    // color: #C3C9C5;
    padding-top: 10px;
    max-width: 800px;
    line-height: 1.3em;
  }

  .content-wrapper__desc-wrapper__desc--center {
    width: 100%;
    max-width: unset;
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .content-wrapper__desc-wrapper__desc--center p {
    max-width: 800px;
  }

  .title-tag {
    padding: 2px 14px;
    margin: 0 0 0 7px;
    border-radius: 6px;
    font-weight: normal;
    font-size: 0.9em;
  }

  .title-tag--good {
    background-color: #59a14e;
  }

  .title-tag--bad {
    background-color: #c54a4b; 
  }
`;
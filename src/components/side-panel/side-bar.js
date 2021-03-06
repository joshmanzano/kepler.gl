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
import {ArrowRight} from 'components/common/icons';

const StyledSidePanelContainer = styled.div`
  z-index: 99;
  // height: 70%;
  height: 100vh;
  width: ${props => props.width + 2 * props.theme.sidePanel.margin.left}px;
  display: flex;
  transition: width 250ms;
  position: absolute;
  // padding-top: ${props => props.theme.sidePanel.margin.top}px;
  // padding-right: ${props => props.theme.sidePanel.margin.right}px;
  // padding-bottom: ${props => props.theme.sidePanel.margin.bottom}px;
  // padding-left: ${props => props.theme.sidePanel.margin.left}px;
`;

const SideBarContainer = styled.div`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: left 250ms, right 250ms;
  left: ${props => props.left}px;
  align-items: stretch;
  flex-grow: 1;
`;

const SideBarInner = styled.div`
  background-color: ${props => props.theme.sidePanelBg};
  border-radius: 1px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const CollapseButtonFactory = () => (
  styled.div`
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    justify-content: center;
    background-color: ${props => props.theme.sideBarCloseBtnBgd};
    border-radius: 1px;
    color: ${props => props.theme.sideBarCloseBtnColor};
    display: flex;
    height: 20px;
    position: absolute;
    right: -8px;
    top: ${props => props.theme.sidePanel.margin.top}px;
    width: 20px;

    :hover {
      cursor: pointer;
      box-shadow: none;
      background-color: ${props => props.theme.sideBarCloseBtnBgdHover};
    }
  `
);

SidebarFactory.deps = [CollapseButtonFactory];

function SidebarFactory(CollapseButton) {
  return class SideBar extends Component {
    static defaultProps = {
      width: 200,
      minifiedWidth: 0,
      isOpen: true,
      onOpenOrClose: function noop() {}
    };

    static propTypes = {
      width: PropTypes.number,
      isOpen: PropTypes.bool,
      minifiedWidth: PropTypes.number,
      onOpenOrClose: PropTypes.func
    };

    _onOpenOrClose = () => {
      this.props.onOpenOrClose({isOpen: !this.props.isOpen});
    };

    render() {
      const {isOpen, minifiedWidth, width} = this.props;
      const horizontalOffset = isOpen ? 0 : minifiedWidth - width;

      return (
        <StyledSidePanelContainer
          width={isOpen ? width : 0}
          className="side-panel--container"
        >
          <SideBarContainer className="side-bar" style={{width: `${width}px`}}
                            left={horizontalOffset}>
            {isOpen ? (
              <SideBarInner className="side-bar__inner">
                {this.props.children}
              </SideBarInner>
            ) : null}
            <CollapseButton
              className="side-bar__close"
              onClick={this._onOpenOrClose}
            >
              <ArrowRight
                height="12px"
                style={{transform: `rotate(${isOpen ? 180 : 0}deg)`}}
              />
            </CollapseButton>
          </SideBarContainer>
        </StyledSidePanelContainer>
      );
    }
  };
}

export default SidebarFactory;

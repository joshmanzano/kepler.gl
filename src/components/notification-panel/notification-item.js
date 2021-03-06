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
import {Delete, Info, Warning, Checkmark} from 'components/common/icons';
import ReactMarkdown from 'react-markdown';

const NotificationItemContent = styled.div`
  background-color: ${props => props.theme.notificationColors[props.notification.type] || '#000'};
  color: #fff;
  display: flex;
  flex-direction: row;
  width: ${props => props.theme.notificationPanelItemWidth * (1 + Number(props.isExpanded))}px;
  height: ${props => 
    props.theme.notificationPanelItemHeight * (1 + Number(props.isExpanded)) 
  }px;
  font-size: 10px;
  margin-bottom: 1rem;
  padding: 1em;
  border-radius: 4px;
  box-shadow: ${props => props.theme.boxShadow};
  cursor: pointer;
`;

const DeleteIcon = styled(Delete)`
  cursor: pointer;
`;

const NotificationMessage = styled.div`
  flex-grow: 2;
  width: ${props => props.theme.notificationPanelItemWidth}px;
  margin: 0 1em;
  overflow: ${props => props.isExpanded ? 'auto' : 'hidden'};
  padding-right: ${props => props.isExpanded ? '1em' : 0};
  p {
    margin-top: 0;
  }
`;

const NotificationIcon = styled.div`
  svg {
    vertical-align: text-top;
  }
`;

const icons = {
  info: <Info />,
  warning: <Warning />,
  error: <Warning />,
  success: <Checkmark />
};

export default function NotificationItemFactory()
{
  return class NotificationItem extends Component {
    static propTypes = {
      notification: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired
      }).isRequired
    };

    constructor(props) {
      super(props);
      this.state = {
        isExpanded: false
      };
    }

    render() {
      const {notification, removeNotification} = this.props;
      return (
        <NotificationItemContent
          className="notification-item"
          {...this.props}
          onClick={() => this.setState({isExpanded: !this.state.isExpanded})}
          isExpanded={this.state.isExpanded}>
          <NotificationIcon
            className="notification-item--icon">
            {icons[notification.type]}
          </NotificationIcon>
          <NotificationMessage
            className="notification-item--message"
            expanded={this.state.isExpanded}
            theme={this.props.theme}>
            <ReactMarkdown source={notification.message} />
          </NotificationMessage>
          <div
            className="notification-item--action">
            <DeleteIcon height="10px" onClick={() => removeNotification(notification.id)} />
          </div>
        </NotificationItemContent>
      );
    }
  }
}


import styled from 'styled-components';

export const DescriptionBlock = styled.div`
font-size: 1.2em;
font-weight: 400;
color: #C3C9C5;
padding-top: 10px;
max-width: 800px;
line-height: 1.3em;
`;

export const PBlock = styled.div`
color: ${props => props.theme.labelColor};
float: left;
margin-top: 20px;
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
color: #C3C9C5;
width: 150px;
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

  .content-block {
    // padding: 40px 32px;
    padding: 50px 112px;
    width: 100%;
  }

  .content-block--dark {
      background-color: #141e2c;
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
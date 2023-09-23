import React from 'react';
import styled from 'styled-components';
import NowIndicator from './NowIndicator';
import Ghost from './Ghost';
import Appointment from './Appointment';
import Row from './Row';

const Wrapper = styled.div`
  touch-action: pan-y;
  position: relative;
  background-size: 8px 8px;
  background-image: linear-gradient(
    45deg,
    transparent 46%,
    rgba(16, 25, 40, 0.2) 49%,
    rgba(16, 25, 40, 0.2) 51%,
    transparent 55%
  );
  background-color: #eef0f2;
  box-shadow: -2px 0px 4px 0px rgba(164, 173, 186, 0.5);
`;

type TGrid = { parentWidth: number };

const Grid: React.FC<TGrid> = ({ parentWidth }) => {
  return (
    <Wrapper data-idtf={'grid'}>
      <NowIndicator type={'LINE'} parentWidth={parentWidth} />
      <Ghost parentWidth={parentWidth} />
      <Appointment parentWidth={parentWidth} />
      <Row />
    </Wrapper>
  );
};

export default Grid;

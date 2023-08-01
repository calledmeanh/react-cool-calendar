import React from 'react';
import { styled } from 'styled-components';
import { TRect } from '../model';
import { Flex } from './common';

const Wrapper = styled(Flex)<{ $rect: TRect }>`
  width: ${(props) => props.$rect.width}px;
  height: ${(props) => props.$rect.height}px;
  transform: translateX(${(props) => props.$rect.left}px) translateY(${(props) => props.$rect.top}px);
  background: #68a6ec;
  color: #fff;
  position: absolute;
  z-index: 1;
`;

type TGhost = {
  rect: TRect;
  time: string;
};

const Ghost: React.FC<{ value: TGhost }> = ({ value }) => {
  return (
    <Wrapper $rect={value.rect} $align={'center'}>
      {value.time}
    </Wrapper>
  );
};

export default Ghost;

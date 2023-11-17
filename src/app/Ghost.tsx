import React from 'react';
import { styled } from 'styled-components';
import { CONFIG } from '../constant';
import { TRect } from '../model';
import { Flex } from './common';

const Wrapper = styled(Flex)<{ $rect: TRect }>`
  width: ${(props) => props.$rect.width}px;
  height: ${(props) => props.$rect.height}px;
  line-height: ${(props) => props.$rect.height}px;
  padding: 0 5px;
  background: ${CONFIG.CSS.HIGHLIGHT_PRIMARY_COLOR};
  color: ${CONFIG.CSS.HIGHLIGHT_SECONDARY_COLOR};
  position: absolute;
  z-index: 1;
  transform: translateX(${(props) => props.$rect.left}px) translateY(${(props) => props.$rect.top}px);
  transition: transform 0.15s cubic-bezier(0, 0, 1, 1);
`;

type TGhost = {
  rect: TRect;
  timeEachCell: string;
};

const Ghost: React.FC<TGhost> = ({ rect, timeEachCell }) => {
  return (
    <Wrapper data-idtf={CONFIG.DATA_IDTF.GHOST} $rect={rect}>
      {timeEachCell}
    </Wrapper>
  );
};

export default Ghost;

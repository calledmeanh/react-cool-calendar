import React from "react";
import { styled } from "styled-components";
import { CONFIG } from "../constant";
import { TRect } from "../model";
import { Flex } from "./common";

const Wrapper = styled(Flex)<{ $rect: TRect }>`
  padding: 0 5px;
  position: absolute;
  z-index: 1;
  transition: transform 0.15s cubic-bezier(0, 0, 1, 1);
  -webkit-transition: transform 0.15s cubic-bezier(0, 0, 1, 1);
  color: ${CONFIG.CSS.HIGHLIGHT_SECONDARY_COLOR};
  background: ${CONFIG.CSS.HIGHLIGHT_PRIMARY_COLOR};
  width: ${(props) => props.$rect.width}px;
  height: ${(props) => props.$rect.height}px;
  line-height: ${(props) => props.$rect.height}px;
  transform: translateX(${(props) => props.$rect.x}px) translateY(${(props) => props.$rect.y}px);
  -webkit-transform: translateX(${(props) => props.$rect.x}px) translateY(${(props) => props.$rect.y}px);
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

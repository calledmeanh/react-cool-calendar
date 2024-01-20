import styled from "styled-components";
import { TStyleFlexDir, TStyleFlexJustify, TStyleFlexAlign } from "../../model";

export const Flex = styled.div<{ $dir?: TStyleFlexDir; $justify?: TStyleFlexJustify; $align?: TStyleFlexAlign }>`
  display: flex;

  flex-direction: ${(props) => props.$dir};

  justify-content: ${(props) => props.$justify};
  -webkit-box-pack: ${(props) => props.$justify};
  -ms-flex-pack: ${(props) => props.$justify};

  align-items: ${(props) => props.$align};
  -webkit-box-align: ${(props) => props.$align};
  -ms-flex-align: ${(props) => props.$align};
`;

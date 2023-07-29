import styled from 'styled-components';
import { TStyleFlexDir, TStyleFlexJustify, TStyleFlexAlign } from '../../model';

export const Flex = styled.div<{ $dir?: TStyleFlexDir; $justify?: TStyleFlexJustify; $align?: TStyleFlexAlign }>`
  display: flex;
  flex-direction: ${(props) => props.$dir};
  justify-content: ${(props) => props.$justify};
  align-items: ${(props) => props.$align};
`;

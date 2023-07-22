import styled from 'styled-components';
import { TStylePosition } from '../../model';

/**
 * to hide something, use it
 */
export const Box = styled.div<{ $pos: TStylePosition }>`
  width: 48px;
  height: 60px;
  position: absolute;
  top: ${(props) => props.$pos[0] || 0}px;
  left: ${(props) => props.$pos[1] || 0}px;
  background: #f7f7f8;
  z-index: 1;
`;

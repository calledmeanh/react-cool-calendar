import styled from 'styled-components';
import { TStylePadding, TStyleBorderRadius } from '../../model';
import { Flex } from './Flex';

export const Text = styled(Flex)<{ $padding: TStylePadding; $isborderradius?: TStyleBorderRadius }>`
  padding: ${(props) => `${props.$padding[0]}px ${props.$padding[1]}px`};
  border-radius: ${(props) => (props.$isborderradius ? `4px` : 0)};
  border: 1px solid #d5d7da;
  background: #fff;
  color: #101928;
  user-select: none;
`;

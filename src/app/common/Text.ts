import styled from 'styled-components';
import { CONFIG } from '../../constant';
import { TStylePadding, TStyleBorderRadius } from '../../model';
import { Flex } from './Flex';

export const Text = styled(Flex)<{ $padding: TStylePadding; $isborderradius?: TStyleBorderRadius }>`
  padding: ${(props) => `${props.$padding[0]}px ${props.$padding[1]}px`};
  border-radius: ${(props) => (props.$isborderradius ? `4px` : 0)};
  border: 1px solid ${CONFIG.CSS.GRAY_THIRD_COLOR};
  background: ${CONFIG.CSS.LIGHT_THEME_BG_COLOR};
  color: ${CONFIG.CSS.FONT_DARK_COLOR};
  text-transform: capitalize;
`;

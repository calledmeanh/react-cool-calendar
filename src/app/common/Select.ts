import styled from "styled-components";
import { CONFIG } from "../../constant";
import { TStyleBorderRadius, TStylePadding } from "../../model";

export const Select = styled.select<{ $padding: TStylePadding; $isborderradius?: TStyleBorderRadius }>`
  border-radius: ${(props) => (props.$isborderradius ? `4px` : 0)};
  padding: ${(props) => `${props.$padding[0]}px ${props.$padding[1]}px`};
  border: 1px solid ${CONFIG.CSS.GRAY_THIRD_COLOR};
  outline: none;
  background: ${CONFIG.CSS.LIGHT_THEME_BG_COLOR};
  cursor: pointer;
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
  text-transform: capitalize;
  transition: all 0.15s cubic-bezier(0, 0, 1, 1);
  &:hover {
    box-shadow: 0 3px 5px 0 ${CONFIG.CSS.BOX_SHADOW_COLOR};
  }
  &:active {
    box-shadow: none;
  }
`;

export const Option = styled.option``;

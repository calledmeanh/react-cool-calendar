import styled from "styled-components";
import { CONFIG } from "../../constant";
import { TStyleBorderRadius, TStylePadding } from "../../model";

export const Select = styled.select<{ $padding: TStylePadding; $isborderradius?: TStyleBorderRadius }>`
  outline: none;
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.15s cubic-bezier(0, 0, 1, 1);
  -webkit-transition: transform 0.15s cubic-bezier(0, 0, 1, 1);
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
  background: ${CONFIG.CSS.LIGHT_THEME_BG_COLOR};
  border: 1px solid ${CONFIG.CSS.GRAY_THIRD_COLOR};
  border-radius: ${(props) => (props.$isborderradius ? `4px` : 0)};
  padding: ${(props) => `${props.$padding[0]}px ${props.$padding[1]}px`};
  &:hover {
    box-shadow: 0 3px 5px 0 ${CONFIG.CSS.BOX_SHADOW_COLOR};
  }
  &:active {
    box-shadow: none;
  }
`;

export const Option = styled.option``;

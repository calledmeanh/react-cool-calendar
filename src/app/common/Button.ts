import styled from "styled-components";
import { CONFIG } from "../../constant";
import { TStyleColor, TStyleBorderRadius, TStylePadding } from "../../model";

export const Button = styled.button<{
  $padding: TStylePadding;
  $isborderradius?: TStyleBorderRadius;
  $color?: TStyleColor;
  $background?: TStyleColor;
}>`
  outline: none;
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.15s cubic-bezier(0, 0, 1, 1);
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
  border: 1px solid ${CONFIG.CSS.GRAY_THIRD_COLOR};
  color: ${(props) => props.$color || CONFIG.CSS.FONT_DARK_COLOR};
  border-radius: ${(props) => (props.$isborderradius ? `4px` : 0)};
  padding: ${(props) => `${props.$padding[0]}px ${props.$padding[1]}px`};
  background: ${(props) => props.$background || CONFIG.CSS.LIGHT_THEME_BG_COLOR};
  &:hover {
    box-shadow: 0 3px 5px 0 ${CONFIG.CSS.BOX_SHADOW_COLOR};
  }
  &:active {
    box-shadow: none;
  }
  &:disabled {
    background: ${CONFIG.CSS.DISABLED_COLOR};
    box-shadow: none;
    cursor: not-allowed;
  }
`;

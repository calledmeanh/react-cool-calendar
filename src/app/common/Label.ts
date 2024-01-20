import styled from "styled-components";
import { CONFIG } from "../../constant";
import { TStylePadding, TStyleBorderRadius } from "../../model";
import { Flex } from "./Flex";

export const Label = styled(Flex)<{ $padding: TStylePadding; $isborderradius?: TStyleBorderRadius }>`
text-transform: capitalize;
color: ${CONFIG.CSS.FONT_DARK_COLOR};
background: ${CONFIG.CSS.LIGHT_THEME_BG_COLOR};
border: 1px solid ${CONFIG.CSS.GRAY_THIRD_COLOR};
border-radius: ${(props) => (props.$isborderradius ? `4px` : 0)};
padding: ${(props) => `${props.$padding[0]}px ${props.$padding[1]}px`};
`;

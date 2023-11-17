import styled from 'styled-components';
import { CONFIG } from '../../constant';
import { Flex } from './Flex';

export const Line = styled(Flex)`
  height: ${CONFIG.CSS.LINE_HEIGHT}px;
  color: ${CONFIG.CSS.FONT_DARK_COLOR};
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
  line-height: 14px;
  font-weight: 500;
  border-top: 1px solid ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
  &.wt {
    background-color: ${CONFIG.CSS.WT_COLORS.PRIMARY};
  }
  &.gt {
    border-top: 1px solid ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
  }
  &.ngt {
    border-top: none;
  }
`;

/* 
    wt = working time
    gt = group time
    ngt = no group time
 */

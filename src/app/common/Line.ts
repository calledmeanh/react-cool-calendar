import styled from 'styled-components';
import { Flex } from './Flex';
import { CONFIG } from '../../constant';

export const Line = styled(Flex)`
  min-height: 24px;
  max-height: 36px;
  color: ${CONFIG.CSS.FONT_DARK_COLOR};
  font-size: 14px;
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

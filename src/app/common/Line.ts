import styled from 'styled-components';
import { Flex } from './Flex';

export const Line = styled(Flex)`
  flex-grow: 1;
  flex-shrink: 0;
  min-height: 24px;
  max-height: 36px;
  color: #101928;
  font-size: 14px;
  line-height: 14px;
  font-weight: 500;
  border-top: 1px solid #eef0f2;
  &.wt {
    background-color: #fff;
  }
  &.gt {
    border-top: 1px solid #dee3e7;
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

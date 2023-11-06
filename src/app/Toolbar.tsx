import React from 'react';
import styled from 'styled-components';
import { Flex } from './common';
import ViewMode from './ViewMode';
import Zoom from './Zoom';
import DateManipulation from './DateManipulation';
import { CONFIG } from '../constant';

const Wrapper = styled(Flex)`
  height: 68px;
  padding: 16px 24px;
`;

const Toolbar: React.FC = () => {
  return (
    <Wrapper data-idtf={CONFIG.DATA_IDTF.TOOLBAR} $justify={'space-between'}>
      <Zoom />
      <DateManipulation />
      <ViewMode />
    </Wrapper>
  );
};

export default Toolbar;

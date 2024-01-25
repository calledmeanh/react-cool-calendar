import React, { useState } from "react";
import styled from "styled-components";
import { Dayjs } from "dayjs";
import { CONFIG } from "../constant";
import { TAppointmentForUser } from "../model";
import { Modal, TModalUsage } from "./common";
import Dateline from "./Dateline";
import DayGrid from "./DayGrid";

const Wrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const TitleRender = styled.div`
  width: calc(100% - 40px);
  text-align: center;
  font-weight: 400;
  color: ${CONFIG.CSS.FONT_DARK_COLOR};
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM + 4}px;
`;

const Month: React.FC = () => {
  const [modalData, setModalData] = useState<TModalUsage>({
    isOpen: false,
    title: "",
    data: [],
  });

  const onShowMoreEvent = (dateInMonth: Dayjs, apptByDay: TAppointmentForUser[]) => {
    setModalData({ isOpen: true, title: `${dateInMonth.format("DD")} ${dateInMonth.format("dddd")}`, data: apptByDay });
  };

  return (
    <Wrapper data-idtf={CONFIG.DATA_IDTF.MONTH}>
      <Dateline />
      <DayGrid onShowMoreEvent={onShowMoreEvent} />
      {modalData.isOpen && (
        <Modal
          titleRender={<TitleRender>{modalData.title}</TitleRender>}
          data={modalData.data}
          onClose={() =>
            setModalData({
              isOpen: false,
              title: "",
              data: [],
            })
          }
        />
      )}
    </Wrapper>
  );
};

export default Month;

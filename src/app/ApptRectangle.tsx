import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { CONFIG } from "../constant";
import { EStatus, TAppointmentForUser } from "../model";
import { AppointmentUtils, TimeUtils } from "../util";
import { Flex } from "./common";

const Wrapper = styled(Flex)<{ $status: EStatus }>`
  height: 30px;
  border-radius: 4px;
  padding: 0 4px;
  cursor: pointer;
  &:hover {
    background-color: ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
  }
`;

const DotCircle = styled.div<{ $status: EStatus }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
  background: ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
  border: 1px solid ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
`;

const Content = styled.span`
  width: calc(100% - 20px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${CONFIG.CSS.FONT_DARK_COLOR};
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
`;

type TApptRectangle = {
  value: TAppointmentForUser;
  mouseCoords: { x: number; y: number };
};

const ApptRectangle: React.FC<TApptRectangle> = ({ value, mouseCoords }) => {
  // const isDragRef: React.MutableRefObject<boolean> = useRef(false);

  const [apptCoords, setApptCoords] = useState({ x: 0, y: 0 });
  const [isPress, setIsPress] = useState(false);

  const origDeltaXRef: React.MutableRefObject<number> = useRef(0);
  const origDeltaYRef: React.MutableRefObject<number> = useRef(0);

  const startTime: string = TimeUtils.convertSecondsToHourString(value.startTime);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsPress(true);

    origDeltaXRef.current = mouseCoords.x - apptCoords.x;
    origDeltaYRef.current = mouseCoords.y - apptCoords.y;
  };

  const onMove = useCallback(() => {
    if (!isPress) return;

    const distanceLeft: number = mouseCoords.x - origDeltaXRef.current;
    const distanceUp: number = mouseCoords.y - origDeltaYRef.current;

    setApptCoords({ x: distanceLeft, y: distanceUp });

    // TODO: right now, I have passed the mouse's coordinates into ApptRect and make it stick to the mouse when dragging
    //       when dragging, it should display 200px of width
    //       when drag over any DayCell, it should change the background of DayCell (highlight color)
    //       when mouse-up, it should place into the corresponding DayCell component
    //       if the user drag outside DayCell, Month or not outside parent element, it should mouseup and comeback into first place
  }, [isPress, mouseCoords.x, mouseCoords.y]);

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsPress(false);
    setApptCoords({ x: 0, y: 0 });
  };

  useEffect(() => {
    onMove();
  }, [onMove]);

  return (
    <Wrapper
      $align={"center"}
      $status={value.status}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      style={{
        position: isPress ? "absolute" : "unset",
        transform: `translateX(${apptCoords.x}px) translateY(${apptCoords.y}px)`,
      }}
    >
      <DotCircle $status={value.status} />{" "}
      <Content title={value.title}>
        {startTime} - {value.title}
      </Content>
    </Wrapper>
  );
};

export default ApptRectangle;

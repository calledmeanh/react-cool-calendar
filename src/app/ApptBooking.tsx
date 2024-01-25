import React, { useEffect, useCallback, useRef, useState } from "react";
import { styled } from "styled-components";
import { CONFIG } from "../constant";
import { useCalendarDispatch, useCalendarState } from "../hook";
import { EAction, EStatus, TAppointmentForApp, TCalendarAction, TCalendarStateForApp } from "../model";
import { AppointmentUtils, ElementUtils, TimeUtils, clsx } from "../util";
import { Flex } from "./common";

const Wrapper = styled.div<{ $status: EStatus }>`
  border-radius: 4px;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  position: absolute;
  color: ${CONFIG.CSS.FONT_DARK_COLOR};
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
  background: ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
  border: 1px solid ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
  &:hover {
    box-shadow: 0 3px 5px 0 ${CONFIG.CSS.BOX_SHADOW_COLOR};
  }
  &.drag,
  &.resize {
    box-shadow: 0 5px 8px 3px ${CONFIG.CSS.BOX_SHADOW_COLOR};
    z-index: 50;
  }
  &.drag {
    cursor: move;
  }
  &.resize {
    cursor: row-resize;
  }
`;

const Info = styled(Flex)`
  padding: 4px;
  pointer-events: none;
  -webkit-pointer-events: none;
`;

const ShareStyle = styled.span`
  width: calc(100% - 5px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Title = styled(ShareStyle)``;
const Content = styled(ShareStyle)``;

const Resize = styled.div`
  position: absolute;
  width: 100%;
  height: 20px;
  bottom: 0;
  cursor: row-resize;
  z-index: 11;
`;

type TApptBooking = {
  value: TAppointmentForApp;
  scrollEl: HTMLDivElement | null;
  coords: { x: number; y: number; pageX: number; pageY: number };
  widthTimeline: number;
  onPressAppt: (value: TAppointmentForApp) => void;
  onReleaseAppt: (id: string, startTime: number, duration: number) => void;
};

const ApptBooking: React.FC<TApptBooking> = ({ value, scrollEl, coords, widthTimeline, onPressAppt, onReleaseAppt }) => {
  const calendarState: TCalendarStateForApp = useCalendarState();
  const dispath: React.Dispatch<TCalendarAction> = useCalendarDispatch();

  // initial position when calculated by the layout algorithm
  const [apptCoords, setApptCoords] = useState({ x: value.x, y: value.y });
  const [size, setSize] = useState({ width: value.width, height: value.height });

  const isDragRef: React.MutableRefObject<boolean> = useRef(false);
  const isResizeRef: React.MutableRefObject<boolean> = useRef(false);
  const origDeltaXRef: React.MutableRefObject<number> = useRef(0);
  const origDeltaYRef: React.MutableRefObject<number> = useRef(0);
  const lastMouseYPositionRef: React.MutableRefObject<number> = useRef(0);
  const sizeBackerRef: React.MutableRefObject<number> = useRef(0);
  const edgeYRef: React.MutableRefObject<number> = useRef(0);
  const calendarRef: React.MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
  const removeAutoScrollIntervalRef: React.MutableRefObject<Function> = useRef(() => {});
  const preventDragEventRef: React.MutableRefObject<Function> = useRef(() => {});
  const autoScrollThresholdRef: React.MutableRefObject<number> = useRef(value.height / 5); // threshold to start auto scroll

  const floorY: number = Math.floor(coords.pageY / CONFIG.CSS.LINE_HEIGHT) * CONFIG.CSS.LINE_HEIGHT;

  const lineIdx: number = apptCoords.y / CONFIG.CSS.LINE_HEIGHT;
  const startTime: number = lineIdx * calendarState.duration + calendarState.dayTime.start;
  const endTimeByDragging: number = startTime + ((value.height + 1) * calendarState.duration) / CONFIG.CSS.LINE_HEIGHT;
  const endTimeByResizing: number = startTime + ((size.height + 1) * calendarState.duration) / CONFIG.CSS.LINE_HEIGHT;
  const newStartTime: number = isDragRef.current ? startTime : value.startTime;
  const newEndTime: number = isDragRef.current ? endTimeByDragging : isResizeRef.current ? endTimeByResizing : value.endTime;

  const updatedStartTime: string = TimeUtils.convertSecondsToHourString(newStartTime);
  const updatedEndTime: string = TimeUtils.convertSecondsToHourString(newEndTime);
  const updatedWidth: number = isDragRef.current ? widthTimeline : size.width;
  const updatedX: number = isDragRef.current ? coords.x : apptCoords.x;
  const updatedHeight: number = isResizeRef.current ? size.height : value.height;

  const calendarHeight: number = calendarRef.current?.offsetHeight || 0;

  const scrollBarHeight: number = scrollEl?.offsetHeight || 0;
  const maxScrollY: number = scrollEl?.scrollHeight || 0;

  // distance from mouse to
  const distanceUp: number = coords.y - origDeltaYRef.current;
  const distanceLeft: number = coords.x - origDeltaXRef.current;
  const distanceDown: number = coords.y + (value.height - origDeltaYRef.current);

  const steps: number = TimeUtils.calcTimeStep(calendarState.dayTime.end, calendarState.dayTime.start, calendarState.duration);
  const maxGridHeight: number = steps * CONFIG.CSS.LINE_HEIGHT;

  /* handle drag event */
  const updateDraggingState = (value: boolean) => {
    if (value) {
      isDragRef.current = value;
      dispath({ type: EAction.UPDATE_FIRE_EVENT, payload: value });
    } else {
      isDragRef.current = value;
      dispath({ type: EAction.UPDATE_FIRE_EVENT, payload: value });
    }
  };

  const handleMouseOutsideWhileDragging = (e: MouseEvent) => {
    e.stopPropagation();

    if (isDragRef.current) {
      onReleaseAppt(value.id, startTime, value.duration);

      updateDraggingState(false);
    }
  };

  const onStartDragging = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventDragEventRef.current = TimeUtils.wrapperSetTimeout(() => {
      updateDraggingState(true);
    }, 250);

    origDeltaXRef.current = coords.x - apptCoords.x;
    origDeltaYRef.current = coords.y - apptCoords.y;

    // save data for later use
    edgeYRef.current = ElementUtils.getOffsetToDocument(e.currentTarget, "top");
    calendarRef.current = ElementUtils.getParentNodeFrom(e.currentTarget, CONFIG.DATA_IDTF.CALENDAR) as HTMLDivElement | null;

    onPressAppt({ ...value, x: apptCoords.x, y: apptCoords.y });

    // handle when mouse is outside a component while mouse-down is still happening and suddenly mouse-up comes in
    document.addEventListener("mouseup", handleMouseOutsideWhileDragging, { once: true });
  };

  const onDragging = useCallback(() => {
    if (isDragRef.current) {
      let currScrollBarY = scrollEl?.scrollTop || 0;
      let curApptY = apptCoords.y;

      // touch the edge of top
      if (distanceUp <= 0) {
        setApptCoords({
          x: distanceLeft,
          y: 0,
        });
      }
      // touch the edge of botoom
      else if (distanceDown >= maxGridHeight) {
        setApptCoords({
          x: distanceLeft,
          y: maxGridHeight - value.height,
        });
      } else {
        /* auto scroll to top while dragging if match condition */
        // ================ TOP ================
        if (floorY - autoScrollThresholdRef.current <= edgeYRef.current && scrollEl) {
          removeAutoScrollIntervalRef.current && removeAutoScrollIntervalRef.current();

          removeAutoScrollIntervalRef.current = TimeUtils.wrapperSetInterval(() => {
            currScrollBarY -= CONFIG.SPEED;
            curApptY -= CONFIG.SPEED;

            setApptCoords((prev) => ({
              ...prev,
              y: curApptY,
            }));

            if (currScrollBarY <= 0 || apptCoords.y <= 0) {
              currScrollBarY = 0;
              setApptCoords((prev) => ({
                ...prev,
                y: 0,
              }));

              removeAutoScrollIntervalRef.current && removeAutoScrollIntervalRef.current();
            }

            scrollEl.scrollTop = currScrollBarY;
          }, CONFIG.FPS);
        }
        // ================ BOTTOM ================
        else if (floorY + autoScrollThresholdRef.current >= calendarHeight && scrollEl) {
          removeAutoScrollIntervalRef.current && removeAutoScrollIntervalRef.current();

          removeAutoScrollIntervalRef.current = TimeUtils.wrapperSetInterval(() => {
            currScrollBarY += CONFIG.SPEED;
            curApptY += CONFIG.SPEED;
            setApptCoords((prev) => ({
              ...prev,
              y: curApptY,
            }));

            if (currScrollBarY + scrollBarHeight >= maxScrollY || apptCoords.y + value.height >= maxGridHeight) {
              currScrollBarY = maxScrollY - scrollBarHeight;
              setApptCoords((prev) => ({
                ...prev,
                y: maxGridHeight - value.height,
              }));
              removeAutoScrollIntervalRef.current && removeAutoScrollIntervalRef.current();
            }

            scrollEl.scrollTop = currScrollBarY;
          }, CONFIG.FPS);
        } else {
          removeAutoScrollIntervalRef.current && removeAutoScrollIntervalRef.current();
          setApptCoords({
            x: distanceLeft,
            y: distanceUp,
          });
        }
      }
    }
  }, [
    value.height,
    autoScrollThresholdRef,
    floorY,
    apptCoords.y,
    scrollEl,
    calendarHeight,
    distanceDown,
    distanceLeft,
    distanceUp,
    maxGridHeight,
    maxScrollY,
    scrollBarHeight,
  ]);

  const onEndDragging = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // if still false means the user is not drag at all, just click
    if (!isDragRef.current) preventDragEventRef.current && preventDragEventRef.current();
    else {
      onReleaseAppt(value.id, startTime, value.duration);

      updateDraggingState(false);
    }
  };
  /* handle drag event */

  /* handle resize event */
  const updateResizeState = (value: boolean) => {
    if (value) {
      isResizeRef.current = value;
      dispath({ type: EAction.UPDATE_FIRE_EVENT, payload: value });
    } else {
      isResizeRef.current = value;
      dispath({ type: EAction.UPDATE_FIRE_EVENT, payload: value });
    }
  };

  const handleMouseOutsideWhileResizing = (e: MouseEvent) => {
    e.stopPropagation();

    if (isResizeRef.current) {
      const newDuration: number = TimeUtils.convertHeightToDuration(sizeBackerRef.current + 1, CONFIG.CSS.LINE_HEIGHT, calendarState.duration);
      onReleaseAppt(value.id, startTime, newDuration);

      updateResizeState(false);
    }
  };

  const onStartResize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // prevent to fire a drag event on parent div

    lastMouseYPositionRef.current = coords.y;

    updateResizeState(true);

    // handle when mouse is outside a component while mouse-down is still happening and suddenly mouse-up comes in
    document.addEventListener("mouseup", handleMouseOutsideWhileResizing, { once: true });
  };

  const onResizing = useCallback(() => {
    if (isResizeRef.current) {
      const distance: number = lastMouseYPositionRef.current - coords.y;
      const newHeight: number = value.height - distance;
      sizeBackerRef.current = newHeight;
      setSize((s) => ({ ...s, height: newHeight }));
    }
  }, [coords.y, value.height]);

  const onEndResize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // prevent to fire a drag event on parent div

    if (isResizeRef.current) {
      const newDuration: number = TimeUtils.convertHeightToDuration(size.height + 1, CONFIG.CSS.LINE_HEIGHT, calendarState.duration);
      onReleaseAppt(value.id, startTime, newDuration);

      updateResizeState(false);
    }
  };
  /* handle resize event */

  // re-render the first position of appt
  useEffect(() => {
    setSize({ width: value.width, height: value.height });
    setApptCoords({ x: value.x, y: value.y });
  }, [value.width, value.height, value.y]);

  // when move mouse around
  useEffect(() => {
    onDragging();
    onResizing();
  }, [onDragging, onResizing]);

  const classname: string = clsx({
    drag: isDragRef.current,
    resize: isResizeRef.current,
  });

  return (
    <Wrapper
      data-idtf={CONFIG.DATA_IDTF.APPT_BOOKING}
      $status={value.status}
      style={{
        transform: `translateX(${updatedX}px) translateY(${apptCoords.y}px)`,
        width: updatedWidth,
        height: updatedHeight,
      }}
      className={classname}
      onMouseDown={onStartDragging}
      onMouseUp={onEndDragging}
    >
      <Info $dir={"column"}>
        <div>
          {updatedStartTime}-{updatedEndTime}
        </div>
        <Title title={value.title}>{value.title}</Title>
        <Content title={value.content}>{value.content}</Content>
      </Info>
      <Resize data-idtf={CONFIG.DATA_IDTF.APPT_RESIZE} onMouseDown={onStartResize} onMouseUp={onEndResize}></Resize>
    </Wrapper>
  );
};

export default ApptBooking;

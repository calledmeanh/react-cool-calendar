import React, { useEffect, useCallback, useRef, useState } from "react";
import { styled } from "styled-components";
import { CONFIG } from "../constant";
import { useCalendarDispatch, useCalendarState } from "../hook";
import { EAction, EStatus, TAppointmentForApp, TCalendarAction, TCalendarStateForApp } from "../model";
import { AppointmentUtils, ElementUtils, TimeUtils, clsx } from "../util";
import { Flex } from "./common";

const Wrapper = styled.div<{ $status: EStatus }>`
  background: ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
  border: 1px solid ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
  color: ${CONFIG.CSS.FONT_DARK_COLOR};
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
  border-radius: 4px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  cursor: pointer;
  position: absolute;
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

const Content = styled(Flex)`
  padding: 3px 4px 3px 8px;
  pointer-events: none;
`;

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
  mousePosition: { top: number; left: number; pageY: number; pageX: number };
  widthTimeline: number;
  onPressAppt: (value: TAppointmentForApp) => void;
  onReleaseAppt: (id: string, startTime: number, duration: number) => void;
};

const ApptBooking: React.FC<TApptBooking> = ({ value, scrollEl, mousePosition, widthTimeline, onPressAppt, onReleaseAppt }) => {
  const calendarState: TCalendarStateForApp = useCalendarState();
  const dispath: React.Dispatch<TCalendarAction> = useCalendarDispatch();

  // initial position when calculated by the layout algorithm
  const [position, setPosition] = useState({ top: value.top, left: value.left });
  const [size, setSize] = useState({ width: value.width, height: value.height });

  const isDragRef: React.MutableRefObject<boolean> = useRef(false);
  const isResizeRef: React.MutableRefObject<boolean> = useRef(false);
  const origDeltaXRef: React.MutableRefObject<number> = useRef(0);
  const origDeltaYRef: React.MutableRefObject<number> = useRef(0);
  const lastMouseTopPositionRef: React.MutableRefObject<number> = useRef(0);
  const sizeBackerRef: React.MutableRefObject<number> = useRef(0);
  const topEdgeRef: React.MutableRefObject<number> = useRef(0);
  const calendarRef: React.MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
  const removeAutoScrollIntervalRef: React.MutableRefObject<Function> = useRef(() => {});
  const preventDragEventRef: React.MutableRefObject<Function> = useRef(() => {});
  const autoScrollThresholdRef: React.MutableRefObject<number> = useRef(value.height / 5); // threshold to start auto scroll

  const floorY: number = Math.floor(mousePosition.pageY / CONFIG.CSS.LINE_HEIGHT) * CONFIG.CSS.LINE_HEIGHT;

  const lineIdx: number = position.top / CONFIG.CSS.LINE_HEIGHT;
  const startTime: number = lineIdx * calendarState.duration + calendarState.dayTime.start;
  const endTimeByDragging: number = startTime + ((value.height + 1) * calendarState.duration) / CONFIG.CSS.LINE_HEIGHT;
  const endTimeByResizing: number = startTime + ((size.height + 1) * calendarState.duration) / CONFIG.CSS.LINE_HEIGHT;
  const newStartTime: number = isDragRef.current ? startTime : value.startTime;
  const newEndTime: number = isDragRef.current ? endTimeByDragging : isResizeRef.current ? endTimeByResizing : value.endTime;

  const updatedStartTime: string = TimeUtils.convertSecondsToHourString(newStartTime);
  const updatedEndTime: string = TimeUtils.convertSecondsToHourString(newEndTime);
  const updatedWidth: number = isDragRef.current ? widthTimeline : size.width;
  const updatedLeft: number = isDragRef.current ? mousePosition.left : position.left;
  const updatedHeight: number = isResizeRef.current ? size.height : value.height;

  const calendarHeight: number = calendarRef.current?.offsetHeight || 0;

  const scrollBarHeight: number = scrollEl?.offsetHeight || 0;
  const maxScrollTop: number = scrollEl?.scrollHeight || 0;

  // distance from mouse to
  const distanceUp: number = mousePosition.top - origDeltaYRef.current;
  const distanceLeft: number = mousePosition.left - origDeltaXRef.current;
  const distanceDown: number = mousePosition.top + (value.height - origDeltaYRef.current);

  const steps: number = TimeUtils.calcTimeStep(calendarState.dayTime.end, calendarState.dayTime.start, calendarState.duration);
  const maxGridHeight: number = steps * CONFIG.CSS.LINE_HEIGHT;

  /* handle drag event */
  const updateDraggingState = (value: boolean) => {
    if (value) {
      isDragRef.current = true;
      dispath({ type: EAction.UPDATE_FIRE_EVENT, payload: true });
    } else {
      isDragRef.current = false;
      dispath({ type: EAction.UPDATE_FIRE_EVENT, payload: false });
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

    origDeltaXRef.current = mousePosition.left - position.left;
    origDeltaYRef.current = mousePosition.top - position.top;

    // save data for later use
    topEdgeRef.current = ElementUtils.getOffsetToDocument(e.currentTarget, "top");
    calendarRef.current = ElementUtils.getParentNodeFrom(e.currentTarget, CONFIG.DATA_IDTF.CALENDAR) as HTMLDivElement | null;

    onPressAppt({ ...value, top: position.top, left: position.left });

    // handle when mouse is outside a component while mouse-down is still happening and suddenly mouse-up comes in
    document.addEventListener("mouseup", handleMouseOutsideWhileDragging, { once: true });
  };

  const onDragging = useCallback(() => {
    if (isDragRef.current) {
      let currScrollBarTop = scrollEl?.scrollTop || 0;
      let curApptTop = position.top;

      // touch the edge of top
      if (distanceUp <= 0) {
        setPosition({
          top: 0,
          left: distanceLeft,
        });
      }
      // touch the edge of botoom
      else if (distanceDown >= maxGridHeight) {
        setPosition({
          top: maxGridHeight - value.height,
          left: distanceLeft,
        });
      } else {
        /* auto scroll to top while dragging if match condition */
        // ================ TOP ================
        if (floorY - autoScrollThresholdRef.current <= topEdgeRef.current && scrollEl) {
          removeAutoScrollIntervalRef.current && removeAutoScrollIntervalRef.current();

          removeAutoScrollIntervalRef.current = TimeUtils.wrapperSetInterval(() => {
            currScrollBarTop -= CONFIG.SPEED;
            curApptTop -= CONFIG.SPEED;

            setPosition((prev) => ({
              ...prev,
              top: curApptTop,
            }));

            if (currScrollBarTop <= 0 || position.top <= 0) {
              currScrollBarTop = 0;
              setPosition((prev) => ({
                ...prev,
                top: 0,
              }));

              removeAutoScrollIntervalRef.current && removeAutoScrollIntervalRef.current();
            }

            scrollEl.scrollTop = currScrollBarTop;
          }, CONFIG.FPS);
        }
        // ================ BOTTOM ================
        else if (floorY + autoScrollThresholdRef.current >= calendarHeight && scrollEl) {
          removeAutoScrollIntervalRef.current && removeAutoScrollIntervalRef.current();

          removeAutoScrollIntervalRef.current = TimeUtils.wrapperSetInterval(() => {
            currScrollBarTop += CONFIG.SPEED;
            curApptTop += CONFIG.SPEED;
            setPosition((prev) => ({
              ...prev,
              top: curApptTop,
            }));

            if (currScrollBarTop + scrollBarHeight >= maxScrollTop || position.top + value.height >= maxGridHeight) {
              currScrollBarTop = maxScrollTop - scrollBarHeight;
              setPosition((prev) => ({
                ...prev,
                top: maxGridHeight - value.height,
              }));
              removeAutoScrollIntervalRef.current && removeAutoScrollIntervalRef.current();
            }

            scrollEl.scrollTop = currScrollBarTop;
          }, CONFIG.FPS);
        } else {
          removeAutoScrollIntervalRef.current && removeAutoScrollIntervalRef.current();
          setPosition({
            top: distanceUp,
            left: distanceLeft,
          });
        }
      }
    }
  }, [value.height, autoScrollThresholdRef, floorY, position.top, scrollEl, calendarHeight, distanceDown, distanceLeft, distanceUp, maxGridHeight, maxScrollTop, scrollBarHeight]);

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
      isResizeRef.current = true;
      dispath({ type: EAction.UPDATE_FIRE_EVENT, payload: true });
    } else {
      isResizeRef.current = false;
      dispath({ type: EAction.UPDATE_FIRE_EVENT, payload: false });
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

    lastMouseTopPositionRef.current = mousePosition.top;

    updateResizeState(true);

    // handle when mouse is outside a component while mouse-down is still happening and suddenly mouse-up comes in
    document.addEventListener("mouseup", handleMouseOutsideWhileResizing, { once: true });
  };

  const onResizing = useCallback(() => {
    if (isResizeRef.current) {
      const distance: number = lastMouseTopPositionRef.current - mousePosition.top;
      const newHeight: number = value.height - distance;
      sizeBackerRef.current = newHeight;
      setSize((s) => ({ ...s, height: newHeight }));
    }
  }, [mousePosition.top, value.height]);

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
    setPosition({ top: value.top, left: value.left });
  }, [value.width, value.height, value.top, value.left]);

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
        transform: `translateX(${updatedLeft}px) translateY(${position.top}px)`,
        width: updatedWidth,
        height: updatedHeight,
      }}
      className={classname}
      onMouseDown={onStartDragging}
      onMouseUp={onEndDragging}
    >
      <Content $dir={"column"}>
        <div>
          {updatedStartTime}-{updatedEndTime}
        </div>
        <div>{value.title}</div>
        <div>{value.content}</div>
      </Content>
      <Resize data-idtf={CONFIG.DATA_IDTF.APPT_RESIZE} onMouseDown={onStartResize} onMouseUp={onEndResize}></Resize>
    </Wrapper>
  );
};

export default ApptBooking;

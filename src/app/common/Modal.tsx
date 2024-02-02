import React from "react";
import styled from "styled-components";
import { useOutsideClick } from "../../hook";
import { TAppointmentForUser } from "../../model";
import { Flex, Button } from ".";
import ApptRectangle from "../ApptRectangle";

const Wrapper = styled(Flex)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`;

const Container = styled(Flex)`
  background: #fff;
  padding: 14px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  width: 280px;
  height: 200px;
`;

const Title = styled(Flex)`
  width: 100%;
  height: 40px;
`;

const List = styled(Flex)`
  padding-top: 10px;
  width: 100%;
  height: calc(100% - 40px);
  overflow-x: hidden;
  overflow-y: auto;
`;

type TModal = {
  titleRender: JSX.Element;
  data: TAppointmentForUser[];
  onClose: Function;
};

export type TModalUsage = {
  isOpen: boolean;
  title: string;
  data: TAppointmentForUser[];
};

export const Modal: React.FC<TModal> = ({ titleRender, data, onClose }) => {
  const modalRef: React.MutableRefObject<HTMLDivElement | null> = useOutsideClick(() => onClose());

  return (
    <Wrapper $align={"center"} $justify={"center"}>
      <Container ref={modalRef} $dir={"column"}>
        <Title $align={"center"}>
          {titleRender}
          <Button style={{ width: 40, height: 40, borderRadius: 40, border: "none" }} $padding={[8, 12]} onClick={() => onClose()}>
            X
          </Button>
        </Title>
        <List $dir={"column"}>
          {data.map((d: TAppointmentForUser) => (
            <ApptRectangle key={d.id} value={d} mouseCoords={{ x: 0, y: 0 }} />
          ))}
        </List>
      </Container>
    </Wrapper>
  );
};

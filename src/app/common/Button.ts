import styled from 'styled-components';
import { TStyleColor, TStyleBorderRadius, TStylePadding } from '../../model';

export const Button = styled.button<{
  $padding: TStylePadding;
  $isborderradius?: TStyleBorderRadius;
  _color?: TStyleColor;
}>`
  padding: ${(props) => `${props.$padding[0]}px ${props.$padding[1]}px`};
  border-radius: ${(props) => (props.$isborderradius ? `4px` : 0)};
  outline: none;
  border: 1px solid #d5d7da;
  background: #fff;
  color: ${(props) => props.color || '#101928'};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s cubic-bezier(0, 0, 1, 1);
  &:hover {
    box-shadow: 0 2px 10px 0 rgba(16, 25, 40, 0.2);
  }
  &:active {
    box-shadow: none;
  }
  &:disabled {
    background: #dee3e7;
    box-shadow: none;
    cursor: not-allowed;
  }
`;

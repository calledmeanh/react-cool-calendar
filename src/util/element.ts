import { TRect } from '../model';

export const ElementUtils = {
  getValueFromUserInput,
  calcRectFromMouse,
  getOffsetToDocument,
};

/**
 * get value from input or select element
 */
function getValueFromUserInput(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): string {
  return e && e.target ? e.target.value : '';
}

function calcRectFromMouse(pageX: number, pageY: number, element: { width: number; height: number }): TRect {
  const colIdx: number = Math.floor(pageX / element.width);
  const lineIdx: number = Math.floor(pageY / element.height);
  const width: number = element.width;
  const height: number = element.height;
  const top: number = lineIdx * height;
  const left: number = colIdx * width;

  return {
    width,
    height,
    top,
    left,
  };
}

function getOffsetToDocument(elem: any, dir: 'left' | 'top'): number {
  const offset = dir === 'left' ? 'offsetLeft' : 'offsetTop';
  let value = 0;
  do {
    if (!isNaN(elem[offset])) {
      value += elem[offset];
    }
  } while ((elem = elem.offsetParent));
  return value;
}

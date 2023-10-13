export const ElementUtils = {
  getValueFromUserInput,
  getOffsetToDocument,
};

/**
 * get value from input or select element
 */
function getValueFromUserInput(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): string {
  return e && e.target ? e.target.value : '';
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

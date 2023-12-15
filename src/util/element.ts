import { CONFIG } from "../constant";

export const ElementUtils = {
  getValueFromUserInput,
  getOffsetToDocument,
  getParentNodeFrom,
};

/**
 * get value from input or select element
 */
function getValueFromUserInput(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): string {
  return e && e.target ? e.target.value : "";
}

function getOffsetToDocument(elem: any, dir: "left" | "top"): number {
  const offset = dir === "left" ? "offsetLeft" : "offsetTop";
  let value = 0;
  do {
    if (!isNaN(elem[offset])) {
      value += elem[offset];
    }
  } while ((elem = elem.offsetParent));
  return value;
}

function getParentNodeFrom(elem: any, targetData: string): any {
  let target = null;
  do {
    const dataIdtf = elem.getAttribute(CONFIG.DATA_IDTF.THIS);
    if (dataIdtf === targetData) {
      target = elem;
      return target;
    }
  } while ((elem = elem.parentElement));
  return target;
}

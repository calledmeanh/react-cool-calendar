/**
 * get value from input or select element
 */
export const getValueFromUserInput = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
  e && e.target ? e.target.value : '';

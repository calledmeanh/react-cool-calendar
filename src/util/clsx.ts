type TClsx = {
  [key: string]: boolean;
};

export function clsx(props: TClsx): string {
  let string: string = "";
  for (let key in props) {
    if (props[key]) {
      string += key + " ";
    }
  }
  return string.trim();
}

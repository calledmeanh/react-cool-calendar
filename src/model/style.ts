/**
 * top, left
 */
export type TStylePosition = [number, number];

/**
 * top-bottom left-right
 */
export type TStylePadding = [number, number];

/**
 * boolean, true is setup and otherwise
 */
export type TStyleBorderRadius = boolean;

export type TStyleColor = string;

/**
 * row | column |  row-reverse | column-reverse
 */
export type TStyleFlexDir = "row" | "column" | " row-reverse" | "column-reverse";

/**
 * stretch | center | flex-start | flex-end | baseline | initial | inherit
 */
export type TStyleFlexAlign = "stretch" | "center" | "flex-start" | "flex-end" | "baseline" | "initial" | "inherit";

/**
 *  flex-start | flex-end center | space-between | space-around | initial | inherit
 */
export type TStyleFlexJustify = "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "initial" | "inherit";

// module will determine the size of the browser window and return the size of an element
// based on the passed in percentage

export default function getSvgWidth(percent, minWidth = 310) {
  let width = window.innerWidth * percent;
    // create max and min-widths
    if (width < minWidth) {
        width = minWidth;
      }
    return width;
}
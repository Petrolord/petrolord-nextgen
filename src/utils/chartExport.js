// PNG export for the chart kit (ChartFrame and SvgChartFrame exportFilename).
// The Suite keeps this helper in src/utils/declineCurve/dcaExport.js; NextGen
// has no DCA module, so the one function the chart kit needs lives here with
// the same signature and behaviour.
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

/**
 * Captures the element with id `elementId` (the chart plus its watermark) and
 * saves it as `<fileName>.png`.
 */
export const exportChartAsImage = async (elementId, fileName) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // scrollHeight captures the element's full laid-out size even if an
    // ancestor is scrolled or clipping it; the white background matches the
    // chart surface (a transparent PNG looks broken in viewers).
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });
    canvas.toBlob((blob) => {
      saveAs(blob, `${fileName}.png`);
    });
  } catch (err) {
    console.error('Failed to export chart image:', err);
  }
};

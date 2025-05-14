import { Selection } from 'd3';

export function truncateSVGText(
  self: Selection<SVGTextElement, unknown, null, undefined>,
  width: number,
  padding: number,
): void {
  let text = self.text();
  let textLength = self.node()?.getComputedTextLength();
  if (!textLength) return;

  while (textLength > width - 2 * padding && text.length > 0) {
    text = text.slice(0, -1);
    self.text(text + '...');
    textLength = self.node()?.getComputedTextLength();
    if (!textLength) return;
  }
}

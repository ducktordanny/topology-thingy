import { truncateSVGText } from '../truncate-svg-text.util';

describe('truncateSVGText', () => {
  let baseMockText = '';
  const selfMockLongText = {
    text: (text?: string) => {
      if (text) baseMockText = text;
      return baseMockText;
    },
    node: () => ({ getComputedTextLength: () => baseMockText.length * 10 }),
  };

  it('should truncate text', () => {
    baseMockText = 'BananosKremmelTalaltLangosFagyiKaposztasTesztaval';
    truncateSVGText(selfMockLongText as any, 100, 8);
    expect(baseMockText).toBe('Banan...');
  });

  it('should not truncate text', () => {
    baseMockText = 'AAAA';
    truncateSVGText(selfMockLongText as any, 100, 8);
    console.log(baseMockText);
    expect(baseMockText).toBe('AAAA');
  });
});

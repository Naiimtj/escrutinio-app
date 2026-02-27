import { describe, it, expect } from 'vitest';
import { getIconSize } from '../../utils/sizeIcon';

describe('getIconSize', () => {
  it.each([
    ['x-small', '16'],
    ['small', '20'],
    ['md', '24'],
    ['large', '38'],
    ['x-large', '48'],
  ])('returns %s for size "%s"', (size, expected) => {
    expect(getIconSize(size)).toBe(expected);
  });

  it('defaults to md for unknown size', () => {
    expect(getIconSize('unknown')).toBe('24');
  });

  it('defaults to md when no argument passed', () => {
    expect(getIconSize()).toBe('24');
  });
});

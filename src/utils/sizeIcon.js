export const getIconSize = (size = 'md') => {
  const sizeMap = {
    'x-small': '16',
    small: '20',
    md: '24',
    large: '38',
    'x-large': '48',
  };

  return sizeMap[size] || sizeMap.md;
};
import {StyleSheet} from 'react-native';

export const color = {
  // https://dougssfelipe.deviantart.com/art/Ghost-in-the-Shell-1995-Color-Palette-657447323
  darkest: '#0a1112',
  darker: '#1e2d28',
  dark: '#314742',
  light: '#526d65',
  lighter: '#7d9d87',
  lightest: '#d0dcc1',
  // https://www.sessions.edu/color-calculator/
  complementaryLighter: '#9d807d',
  complementaryLightest: '#dcc1d0',
};

const fontSize = {
  medium: 28,
};

export const spacing = {
  medium: 16,
};

export default StyleSheet.create({
  // TODO: Move nav styles into App.js.
  navigationCard: {
    backgroundColor: color.darkest,
  },
  navigationHeader: {
    backgroundColor: color.darkest,
    borderBottomWidth: 0,
    elevation: 0,
  },
  navigationHeaderTitle: {
    color: color.light,
    fontSize: fontSize.medium,
  },
  textDefault: {
    color: color.lightest,
    fontSize: fontSize.medium,
  },
});

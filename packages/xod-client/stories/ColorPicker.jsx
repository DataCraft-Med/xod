import React from 'react';
import { storiesOf } from '@storybook/react';
import { withState } from 'recompose';
import convert from 'color-convert';

import '../src/core/styles/main.scss';
import ColorPicker from '../src/editor/components/ColorPicker/index';

const hsl = [45, 100, 50];
const hex = convert.hsl.hex(hsl);

const ColorPickerContainer = withState('color', 'onChange', { hsl, hex })(
  ({ color, onChange }) => <ColorPicker color={color} onChange={onChange} />
);

storiesOf('ColorPicker', module).add('base', () => <ColorPickerContainer />);

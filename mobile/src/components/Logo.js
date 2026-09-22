import React from 'react';
import { View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Rect,
} from 'react-native-svg';

export default function Logo({ size = 40, style }) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg viewBox="0 0 100 100" width={size} height={size}>
        <Defs>
          <LinearGradient id="flameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FF6B00" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FF9A3C" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1a1a2e" stopOpacity="1" />
            <Stop offset="100%" stopColor="#16213e" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Shield/Flame outer shape */}
        <Path
          d="M50 5 L85 20 L85 55 C85 75 65 90 50 97 C35 90 15 75 15 55 L15 20 Z"
          fill="url(#flameGrad)"
        />

        {/* Inner dark shield */}
        <Path
          d="M50 14 L78 27 L78 55 C78 71 62 84 50 90 C38 84 22 71 22 55 L22 27 Z"
          fill="url(#shieldGrad)"
        />

        {/* Arrow path (forward movement) */}
        <Path
          d="M32 52 L52 52 L52 44 L68 54 L52 64 L52 56 L32 56 Z"
          fill="url(#flameGrad)"
        />

        {/* Small hammer head on top of arrow */}
        <Rect
          x="60"
          y="36"
          width="12"
          height="7"
          rx="2"
          fill="#FF9A3C"
          transform="rotate(-35, 66, 39)"
        />
        <Rect
          x="63"
          y="38"
          width="4"
          height="12"
          rx="1.5"
          fill="#FF7A1A"
          transform="rotate(-35, 65, 44)"
        />
      </Svg>
    </View>
  );
}

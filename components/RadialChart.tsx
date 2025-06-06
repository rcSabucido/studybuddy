import React from 'react';
import { ColorValue, Text, TextStyle, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import styles from '../app/styles';

type Props = {
  size?: number,
  strokeWidth?: number,
  percentage?: number,
  activeColor?: ColorValue,
  finishedColor?: ColorValue,
  textStyle?: TextStyle,
  text?: string,
  largeText?: boolean,
}

const RadialChart = ({ size = 100, strokeWidth = 10,
                      percentage = 80, activeColor = "#3D3D3D",
                      finishedColor = "#CDCDCD", textStyle, text, largeText = false }: Props) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} transform={[{ scaleX: -1 }]}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={finishedColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {
            percentage > 0 &&
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={activeColor}
              strokeDasharray={`${progress}, ${circumference - progress}`}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          }
        </G>
      </Svg>
      <Text style={[largeText ? styles.timer_progress_text_large : styles.timer_progress_text, textStyle, { position: 'absolute' }]}>
        {text || `${percentage}%`}
      </Text>
    </View>
  );
};

export default RadialChart;

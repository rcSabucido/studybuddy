import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

const PieProgress = ({ size = 84, progress = 0.975, color = '#72E2AE', backgroundColor = '#e6e6e6' }) => {
  const radius = size / 2;
  const angle = Math.min(0.999, progress) * 360;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      `M ${x} ${y}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');
  };

  const path = describeArc(radius, radius, radius, 0, angle);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G>
          <Path
            d={describeArc(radius, radius, radius, 0, 360)}
            fill={backgroundColor}
          />
          <Path d={path} fill={color} />
        </G>
      </Svg>
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <View style={{
            justifyContent: "center",
            alignItems: "center",
            height: '100%'}}>
          <Text style={{ fontSize: size / 5, fontWeight: 'bold', color: 'purple' }}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PieProgress;

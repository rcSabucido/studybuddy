import { useRef } from 'react';
import { Animated, Pressable, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  viewStyle?: ViewStyle | ViewStyle[];
  accessibilityLabel?: string;
};

export default function AnimatedPressable({ children, onPress, accessibilityLabel, style, viewStyle }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }
  return (
    <Animated.View style={[viewStyle, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable style={[style, {width: "100%", alignItems: "center"}]} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} accessibilityLabel={accessibilityLabel}>
        {children}
      </Pressable>
    </Animated.View>
  )
}
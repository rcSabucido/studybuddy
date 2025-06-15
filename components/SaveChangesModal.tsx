import { Modal, Pressable, Text, View, Animated } from "react-native";
import { useRef } from 'react';

type Props = {
  onClose: (shouldSave: boolean) => void;
};

export default function SaveChangesModal({ onClose }: Props) {
  const noButtonScale = useRef(new Animated.Value(1)).current;
  const yesButtonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (animatedValue: Animated.Value) => {
    Animated.spring(animatedValue, {
      toValue: 0.75,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (animatedValue: Animated.Value) => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal animationType="fade" transparent={false} visible={true} backdropColor="rgba(0, 0, 0, 0.35))">
      <View style={{
        width: '80%',
        height: 'auto',
        padding: 19,
        borderRadius: 16,
        shadowColor: 'rgba(0, 0, 0, 0.35)',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
        elevation: 4, 
        margin: 'auto',
        backgroundColor: "white",
        position: "relative",
        flexDirection: 'column',
      }}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 40,
          gap: 16,
        }}>
          <Text style={{
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontFamily: 'Poppins_500Medium',
            marginBottom: 20,
          }}>
            Do you wish to save changes?
          </Text>
          
          <View style={{
            flexDirection: 'row',
            gap: 16,
          }}>
            <Pressable 
              onPressIn={() => handlePressIn(noButtonScale)}
              onPressOut={() => handlePressOut(noButtonScale)} 
              onPress={() => onClose(false)}
            >
              <Animated.View style={{
                transform: [{ scale: noButtonScale }],
                backgroundColor: '#ffffff', 
                paddingHorizontal: 32,
                height: 50,
                justifyContent: 'center',
                borderRadius: 10,
                borderWidth: 1,
              }}>
                <Text style={{
                  fontSize: 14,
                  fontFamily: 'Poppins_500Medium',
                  color: 'black'
                }}>No</Text>
              </Animated.View>
            </Pressable>

             <Pressable 
              onPressIn={() => handlePressIn(yesButtonScale)}
              onPressOut={() => handlePressOut(yesButtonScale)} 
              onPress={() => onClose(true)}
            >
              <Animated.View style={{
                transform: [{ scale: yesButtonScale }],
                backgroundColor: '#1AE843', 
                paddingHorizontal: 32,
                height: 50,
                justifyContent: 'center',
                borderRadius: 10,
              }}>
                <Text style={{
                  fontSize: 14,
                  fontFamily: 'Poppins_500Medium',
                  color: 'white'
                }}>Yes</Text>
              </Animated.View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
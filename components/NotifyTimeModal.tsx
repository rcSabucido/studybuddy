import RollerPicker from "@/components/RollerPicker";
import { useState } from 'react';
import { Modal, Pressable, Text, View } from "react-native";

type TimeValue = {
  hours: number;
  minutes: number;
  period: string;
};

type Props = {
  previousValue: TimeValue;
  onClose: (newValue?: TimeValue) => void;
};

export default function MinStudyHoursModal({ onClose, previousValue }: Props) {
  const [selectedTime, setSelectedTime] = useState<TimeValue>(previousValue);

  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1));

  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  const periodOptions = ['AM', 'PM'];

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.35)",
      }}>
        <View style={{
          width: '80%',
          padding: 16,
          borderRadius: 16,
          backgroundColor: "white",
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Select Time</Text>

          <View style={{ gap: 16, flexDirection: "row", paddingTop: 32 }}>
            <RollerPicker selectedItem={selectedTime.hours} numberPadding={2} items={hourOptions} isNumerical={true} onSelect={function (newValue: any): void {
              setSelectedTime((prev) => ({ ...prev, hours: newValue as number }))
            } } />

            <RollerPicker selectedItem={selectedTime.minutes} numberPadding={2} items={minuteOptions} isNumerical={true} onSelect={function (newValue: any): void {
              setSelectedTime((prev) => ({ ...prev, minutes: newValue as number }))
            } } />
            
            <RollerPicker selectedItem={selectedTime.period} items={periodOptions} isNumerical={true} onSelect={function (newValue: any): void {
              setSelectedTime((prev) => ({ ...prev, period: newValue as 'AM' | 'PM' }))
            } } />
          </View>

          <Pressable
            style={{
              backgroundColor: '#9B41E9',
              width: '60%',
              paddingHorizontal: 13,
              height: 50,
              justifyContent: 'center',
              borderRadius: 10,
              marginTop: 24,
            }}
            onPress={() => onClose(selectedTime)}
          >
            <View style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Poppins_500Medium',
                color: 'white'
              }}>Accept</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

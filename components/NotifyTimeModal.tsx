import { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, Text, View } from "react-native";
import {
    SectionsWheelPicker,
    WheelPickerProps
} from 'react-native-ui-lib';

type TimeValue = {
  hours: number;
  minutes: number;
  period: 'AM' | 'PM';
};

type Props = {
  previousValue: TimeValue;
  onClose: (newValue?: TimeValue) => void;
};

export default function MinStudyHoursModal({onClose, previousValue}: Props) {
  const [selectedTime, setSelectedTime] = useState<TimeValue>(previousValue);

  const hoursChange = useCallback((item: number | string) => {
    setSelectedTime(prev => ({...prev, hours: item as number}));
  }, []);

  const minutesChange = useCallback((item: number | string) => {
    setSelectedTime(prev => ({...prev, minutes: item as number}));
  }, []);

  const periodChange = useCallback((item: number | string) => {
    setSelectedTime(prev => ({...prev, period: item as 'AM' | 'PM'}));
  }, []);

  const sections: WheelPickerProps<string | number>[] = useMemo(() => {
    return [
      {
        items: Array.from({length: 12}, (_, i) => ({value: i + 1, label: `${i + 1}`})),
        onChange: hoursChange,
        initialValue: selectedTime.hours,
        label: 'hour'
      },
      {
        items: Array.from({length: 60}, (_, i) => ({value: i, label: i.toString().padStart(2, '0')})),
        onChange: minutesChange,
        initialValue: selectedTime.minutes,
        label: 'min'
      },
      {
        items: [{value: 'AM', label: 'AM'}, {value: 'PM', label: 'PM'}],
        onChange: periodChange,
        initialValue: selectedTime.period,
      }
    ]
  }, [selectedTime]);

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={{
        width: '80%',
        height: 'auto',
        padding: 16,
        borderRadius: 16,
        filter: 'drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.35))',
        margin: 'auto',
        backgroundColor: "white",
        position: "relative",
        flexDirection: 'column',
      }}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <SectionsWheelPicker 
            numberOfVisibleRows={2} 
            sections={sections} 
            itemHeight={48} 
            textStyle={{
              color: "#ddd",
              fontSize: 20,
              fontFamily: 'Poppins_700Bold',
            }} 
          />
          <Pressable 
            style={{
              backgroundColor: '#9B41E9', 
              width: '60%',
              paddingHorizontal: 13,
              height: 50,
              justifyContent: 'center',
              borderRadius: 10,
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
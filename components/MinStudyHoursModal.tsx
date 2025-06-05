import { useCallback, useMemo, useState } from 'react';
import { Modal, View } from "react-native";
import {
  SectionsWheelPicker,
  WheelPickerProps
} from 'react-native-ui-lib';
import Button from './Button';

type Props = {
  previousValue: number,
  onClose: (newValue?: number) => void
};

export default function MinStudyHoursModal({onClose, previousValue}: Props) {
  const [minimumHoursStudy, setMinimumHoursStudy] = useState(previousValue);
  const hoursStudyChange = useCallback((item: number | string) => {
    setMinimumHoursStudy(item as number);
  }, []);
  const sections: WheelPickerProps<string | number>[] = useMemo(() => {
    return [
      {
        items: Array.from({length: 24}, (_, i) => ({value: i+1, label: `${i+1}`})),
        onChange: hoursStudyChange,
        initialValue: minimumHoursStudy,
        label: 'hours'
      }
    ]
  }, [
    minimumHoursStudy
  ])
    return (
      <>
        <Modal animationType="fade" transparent={false} visible={true} backdropColor="rgba(0, 0, 0, 0.35))">
            <View style={{
                width: '60%',
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
                <SectionsWheelPicker numberOfVisibleRows={2} sections={sections} itemHeight={48} textStyle={{
                  color: "#ddd",
                  fontSize: 20,
                  fontFamily: 'Poppins_700Bold',
                }} />
                <Button
                  label="Accept"
                  bgColor="#9B41E9"
                  width="60%"
                  style={{
                              width: '60%',
                              paddingHorizontal: 13,
                              height: 50,
                  }}
                  onPress={() => onClose(minimumHoursStudy)}
                />
              </View>
            </View>
        </Modal>
      </>
    )
}
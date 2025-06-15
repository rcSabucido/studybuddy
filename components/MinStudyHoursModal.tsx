import { useState } from 'react';
import { Modal, Text, View } from "react-native";
import Dropdown from 'react-native-input-select';
import Button from './Button';

type Props = {
  previousValue: number,
  onClose: (newValue?: number) => void
};

export default function MinStudyHoursModal({ onClose, previousValue }: Props) {
  const [minimumHoursStudy, setMinimumHoursStudy] = useState(previousValue);

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.35)",
      }}>
        <View style={{
          width: '60%',
          padding: 16,
          borderRadius: 16,
          backgroundColor: "white",
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Minimum Study Hours</Text>

          <Dropdown
            options={hourOptions}
            placeholder="Select hours"
            selectedValue={minimumHoursStudy}
            onValueChange={(value) => setMinimumHoursStudy(value as number)}
            primaryColor="#9B41E9"
          />

          <Button
            label="Accept"
            bgColor="#9B41E9"
            width="60%"
            style={{
              width: '60%',
              paddingHorizontal: 13,
              height: 50,
              marginTop: 24,
            }}
            onPress={() => onClose(minimumHoursStudy)}
          />
        </View>
      </View>
    </Modal>
  );
}

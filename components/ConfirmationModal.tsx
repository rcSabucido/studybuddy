import { Modal, Text, View } from "react-native";
import styles from '../app/styles';
import Button from './Button';

type Props = {
  onYes: () => void,
  onNo: () => void,
  message: string,
  icon?: any,
};

export default function ConfirmationModal({message, onYes, onNo, icon: IconComponent}: Props) {
  return (
    <>
      <Modal animationType="fade" transparent={false} visible={true} backdropColor="rgba(0, 0, 0, 0.35))">
          <View style={{
              width: '80%',
              height: '40%',
              padding: 16,
              borderRadius: 16,
              filter: 'drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.35))',
              margin: 'auto',
              backgroundColor: "white",
              position: "relative",
              justifyContent: "space-around",
              flexDirection: 'column',
          }}>
            <View style={{flexDirection: "row", width: "80%", margin: "auto"}}>
              <View style={{width: "30%", justifyContent: "center"}}>
                {IconComponent && <IconComponent size={48} strokeWidth={1.5} color="black"/>}
              </View>
              <View style={{width: "69%"}}>
                <Text style={[styles.container_header_text, {color: "#000000"}]}>{message}</Text>
              </View>
            </View>
            <View style={{flexDirection: "row", width: "80%"}}>
              <Button
                label="No"
                textColor="#000000"
                width="60%"
                style={{
                  width: '60%',
                  paddingHorizontal: 13,
                  height: 50,
                  borderWidth: 1,
                  marginRight: 12,
                }}
                onPress={onNo}
              />
              <Button
                label="Yes"
                bgColor="#1AE843"
                width="60%"
                style={{
                  width: '60%',
                  paddingHorizontal: 13,
                  height: 50,
                }}
                onPress={onYes}
              />
            </View>
          </View>
      </Modal>
    </>
  )
}
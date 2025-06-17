import { Modal, Text, View } from "react-native";

export default function LoadingModal() {
  return (
    <>
      <Modal animationType="fade" transparent={false} visible={true} backdropColor="rgba(0, 0, 0, 0.35))">
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 32,
            fontFamily: 'Poppins_500Medium',
            color: 'white',
          }}>
            {"Loading..."}
          </Text>
        </View>
      </Modal>
    </>
  )
}
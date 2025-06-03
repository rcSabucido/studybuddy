import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  onClose: (shouldSave: boolean) => void;
};

export default function SaveChangesModal({ onClose }: Props) {
  return (
    <Modal animationType="fade" transparent={false} visible={true} backdropColor="rgba(0, 0, 0, 0.35))">
      <View style={{
        width: '80%',
        height: 'auto',
        padding: 19,
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
              style={{
                backgroundColor: '#fffffff', 
                paddingHorizontal: 32,
                height: 50,
                justifyContent: 'center',
                borderRadius: 10,
                borderWidth: 1,
              }} 
              onPress={() => onClose(true)}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: 'Poppins_500Medium',
                color: 'black'
              }}>No</Text>
            </Pressable>

            <Pressable 
              style={{
                backgroundColor: '#1AE843', 
                paddingHorizontal: 32,
                height: 50,
                justifyContent: 'center',
                borderRadius: 10,
              }} 
              onPress={() => onClose(false)}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: 'Poppins_500Medium',
                color: 'white'
              }}>Yes</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
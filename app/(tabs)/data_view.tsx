import { Text, View } from "react-native";
import styles from '../styles';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{
        width: '100%',
      }}>
        <Text style={{
            fontSize: 24,
            color: '#333',
            fontFamily: 'Poppins_700Bold',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>You've studied for</Text>
        <Text style={{
            fontSize: 24,
            color: '#333',
            fontFamily: 'Poppins_700Bold',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>4 hours today.</Text>
      </View>
      <View style={{
        width: '100%',
        paddingTop: 24,
        paddingBottom: 24
      }}>
        <Text style={{
          fontSize: 24,
          color: '#333',
          fontFamily: 'Poppins_700Bold',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>Score: 70%</Text>
      </View>
      <View style={styles.content_container}>
        <Text style={{
          color: "#ddd",
          fontSize: 20,
          fontFamily: 'Poppins_700Bold',
        }}>Minimum Hours to Study</Text>
      </View>
    </View>
  );
}

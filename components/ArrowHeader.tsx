import { StyleSheet, Text, View } from "react-native";
import ArrowButton from "./ArrowButton";

type HeaderProps = {
    title: string;
    onPress?: () => void;
}

export default function ArrowHeader({ title, onPress }: HeaderProps) {
    return (
        <View style={styles.headerContainer}>
            <ArrowButton onPress={onPress}/>
            <Text style={styles.headerText}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: '23%'
  },
  headerText: {
    fontSize: 20,
    paddingTop: '2%',
    fontFamily: 'Poppins_700Bold',
    color: '#333',
  }
});
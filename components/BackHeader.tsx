import ArrowHeader from "@/components/ArrowHeader";
import { useRouter } from 'expo-router';
import { View } from "react-native";
import styles from '../app/styles';

function goBack() {
  const router = useRouter();
  router.back()
}

export default function BackHeader() {
  return (
    <View style={[styles.navheader_container]}>
      <ArrowHeader onPress={goBack} title="" />
    </View>
  )
}
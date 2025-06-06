import ArrowHeader from "@/components/ArrowHeader";
import { useRouter } from 'expo-router';
import { View } from "react-native";
import styles from '../app/styles';

type Props = {
  onBack?: () => void,
}

function goBack() {
  const router = useRouter();
  router.back()
}

export default function BackHeader({onBack}: Props) {
  return (
    <View style={[styles.navheader_container]}>
      <ArrowHeader onPress={() => onBack ? onBack() : goBack()} title="" />
    </View>
  )
}
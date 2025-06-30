import { SupabaseClient } from '@supabase/supabase-js';
import { StyleSheet, Text } from 'react-native';

export const formatStudyTime = (totalHours: number) => {
  const totalSeconds = Math.floor(totalHours * 3600);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }
  if (minutes > 0 || (hours > 0 && seconds > 0)) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }
  if (seconds > 0 || (hours === 0 && minutes === 0)) {
    parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
  }

  return parts; //`${parts.join(', ')} today.`;
}

const styleSheet = StyleSheet.create({
  text: {
    fontSize: 24,
    color: '#333',
    fontFamily: 'Poppins_700Bold',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
});

type FormatStudyTimeProps = {
  totalHour: number,
  fontSize?: number,
  prepend?: string,
}

export const formatStudyTimeText = ({totalHour, fontSize = 24, prepend = ""}: FormatStudyTimeProps) => {
  const studyTimes = formatStudyTime(totalHour);

  if (studyTimes.length < 3) {
    const text = `${prepend}${studyTimes.join(', ')} today.`;
    return (<Text style={[styleSheet.text, {fontSize: fontSize}]}>{text}</Text>);
  }
  const first = studyTimes.slice(0, 2);
  const firstText = `${prepend}${first.join(', ')} and`;
  const last = studyTimes.slice(2, studyTimes.length);
  const lastText = `${last.join(', ')} today.`;
  return (
    <>
      <Text style={[styleSheet.text, {fontSize: fontSize}]}>{firstText}</Text>
      <Text style={[styleSheet.text, {fontSize: fontSize}]}>{lastText}</Text>
    </>
  );
}

export const getWeekBounds = (today: Date) => {
  const { sunday, saturday } = getWeekBoundsDate(today);
  const format = (date: Date) => date.toISOString().slice(0, 10);

  return {
    sunday: format(sunday),
    saturday: format(saturday),
  }
} 

export const getWeekBoundsDate = (today: Date) => {
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + (6 - dayOfWeek));
  return { sunday, saturday };
} 

export const getCurrentWeekBounds = () => {
  return getWeekBounds(new Date())
}

export const getCurrentPreviousWeekBounds = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return getWeekBounds(date);
}

export const storeTaskProgress = async (supabase: SupabaseClient<any, "public", any>, taskId: string | string[], interval: number) => {
  let now = new Date()
  let date = now.toISOString().slice(0, 10)
  let time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`

  console.log(`Storing task progress: interval: ${interval}, taskId: ${taskId}`)
  console.log(`End time: ${time}`)

  const { error } = await supabase
    .from('TaskProgress')
    .insert({
      date,
      interval,
      taskId,
      endTime: time
    });

  if (error) {
    console.log("Error storing task progress!")
    console.log(error)
    throw error;
  }
}
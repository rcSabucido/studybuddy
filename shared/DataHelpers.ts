import { SupabaseClient } from '@supabase/supabase-js';

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
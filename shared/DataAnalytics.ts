import { createClient } from "@supabase/supabase-js";
import { getCurrentPreviousWeekBounds } from "./DataHelpers";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

function toSeconds(hhmmss: string) {
  const [h, m, s] = hhmmss.split(":").map(Number);
  return (h * 3600) + (m * 60) + s;
}

function toHHMMSS(seconds: number) {
  const h = seconds / 3600;
  const m = (h % 1) * 60;
  const s = (m % 1) * 60;
  return `${Math.floor(h).toString().padStart(2, '0')}:${Math.floor(m).toString().padStart(2, '0')}:${Math.floor(s).toString().padStart(2, '0')}`;
}

function getHour(seconds: number) {
  return Math.floor(seconds / 3600);
}

function getCommonHours(dataset: any[], gapAllowanceMinutes = 10) {
  let progressPerDay: Record<string, any[]> = {};
  for (let i = 0; i < dataset.length; i++) {
    let data = dataset[i];
    let end = toSeconds(data.endTime);
    let start = Math.max(0, end - data.interval);
    if (progressPerDay[data.date] == null) {
      progressPerDay[data.date] = [];
    }
    progressPerDay[data.date].push({ end: getHour(end), start: getHour(start) })
  }
  let hours: {hour: number, hits: number}[] = [];
  for (let i = 0; i < 24; i++) { hours[i] = { hour: i, hits: 0 }; }
  for (let date in progressPerDay) {
    progressPerDay[date].forEach((hour) => {
      hours[hour.start].hits++;
      for (let i = hour.start; i < hour.end; i++) {
        hours[i].hits++;
      }
    })
  }
  let filteredHours = hours.filter(element => element.hits > 0);
  filteredHours.sort((a, b) => b.hits - a.hits)
  return filteredHours
}

export async function fetchCommonHour() {
  let weekBounds = getCurrentPreviousWeekBounds();

  {
    let { data, error } = await supabase
      .from('ActivityPeaks')
      .select('*')
      .eq('startDate', weekBounds.sunday)
      .eq('endDate', weekBounds.saturday);

    
    if (data == null) {
      console.error("Activity peaks data is null")
      return
    }
    if (error) {
      console.error("Error fetching activity peaks data: ", error)
      return
    }
    if (data.length > 0) {
      return data[0].topHour;
    }
  }

  let { data, error } = await supabase
    .from('TaskProgress')
    .select('*')
    .gte('date', weekBounds.sunday)
    .lte('date', weekBounds.saturday);
  
  if (data == null) {
    console.error("Task progress data is null")
    return
  }
  if (error) {
    console.error("Error fetching progress data: ", error)
  }

  console.log("Task progress fetched");
  let commonHours = getCommonHours(data);

  if (commonHours.length == 0) return -1;

  let params = await supabase
    .from('ActivityPeaks')
    .insert({
      startDate: weekBounds.sunday,
      endDate: weekBounds.saturday,
      topHour: commonHours[0].hour
    });

  if (params.error) {
    console.error("Error inserting activity peaks: ", params.error)
  }
  return commonHours[0].hour
}

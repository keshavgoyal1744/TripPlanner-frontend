export interface TikTokVideoObject {
  url: string;
  id: string;
}

export enum ActivityTag {
  Sightseeing = "Sightseeing",
  Beach = "Beach",
  Hiking = "Hiking",
  Shopping = "Shopping",
  Dining = "Dining",
  Museum = "Museum",
  Adventure = "Adventure",
  Relaxation = "Relaxation",
  Nightlife = "Nightlife",
  Wildlife = "Wildlife",
  CulturalExperience = "Cultural Experience",
  Sports = "Sports",
  Festival = "Festival",
  RoadTrip = "Road Trip",
  Camping = "Camping",
  Cruise = "Cruise",
  Spa = "Spa",
  Photography = "Photography",
  Entertainment = "Entertainment",
  History = "History",
  FamilyFun = "Family Fun",
  ThemePark = "Theme Park",
  WaterSports = "Water Sports",
  WinterSports = "Winter Sports"
}

export interface TripInfo {
  location: string;
  startTime: string;
  endTime: string;
  activityTags: ActivityTag[];
  comments: string;
}

interface Inspiration {
  explanation: string;
  video_url: string;
}
export interface Activity {
  id?: number
  startTime: string;
  endTime: string;
  activity: string;
  location: string;
  inspiredBy: Inspiration | null;
}

export interface Itinerary{
  activities: Activity[]
}
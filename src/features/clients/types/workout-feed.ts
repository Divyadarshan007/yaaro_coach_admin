export type FeedMedia = {
  url: string;
  type: "image" | "video";
};

export type FeedActivityDataPoint = {
  activity: string;
  data: unknown;
};

export type FeedExerciseSummary = {
  id: string;
  title: string;
  thumbnailUrl: string;
  totalSet: number;
};

export type FeedItem = {
  id: string;
  title: string;
  description: string;
  media: FeedMedia[];
  activityType: string;
  type: string;
  activityData: FeedActivityDataPoint[];
  exercises: FeedExerciseSummary[];
  likeCount: number;
  commentCount: number;
  likeImages: string[];
  startTime: string;
  endTime: string;
};

export interface DiscoverItem {
  id: string;
  title: string;
  sourceName: string;
  sourceFaviconUrl?: string; // Optional favicon
  timestamp: string; // e.g., "2h"
  imageUrl: string;
  articleUrl: string; // Link for the card itself
}

export const mockDiscoverData: DiscoverItem[] = [
  {
    id: "1",
    title: "India's Space Program Reaches New Milestone with Successful Launch",
    sourceName: "The Times of India",
    sourceFaviconUrl: "/assets/prod1.png", // Placeholder favicon
    timestamp: "3h",
    imageUrl: "/assets/prod1.png",
    articleUrl: "#",
  },
  {
    id: "2",
    title: "Upcoming Cricket Match Preview: India vs Australia Showdown",
    sourceName: "ESPN Cricinfo",
    sourceFaviconUrl: "/assets/prod1.png",
    timestamp: "5h",
    imageUrl: "/assets/prod1.png",
    articleUrl: "#",
  },
  {
    id: "3",
    title: "New Metro Line Opens in Bangalore, Easing Commute Times",
    sourceName: "Deccan Herald",
    sourceFaviconUrl: "/assets/prod1.png",
    timestamp: "1 day ago",
    imageUrl: "/assets/prod1.png",
    articleUrl: "#",
  },
  // Add more mock items
];

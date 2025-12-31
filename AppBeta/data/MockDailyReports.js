// mockDailyReports.js
// Mock data for daily reports - centralized for easy design updates

export const mockDailyReports = [
  {
    childId: "child-001",
    name: "Charlie Brown",
    age: 5,
    mood: "Happy",
    date: "December 24, 2025",
    
    // Format 1: Structured report lines (for parents who prefer bullet points)
    reportLines: [
      { 
        emoji: "😊", 
        text: "Today, your child was joyful, with a normal energy level",
        category: "mood"
      },
      { 
        emoji: "🟢", 
        text: "He didn't take his afternoon snack", 
        category: "meal" 
      },
      { 
        emoji: "🍎", 
        text: "It would be good to prepare a small ritual for the meal", 
        category: "suggestion" 
      },
      { 
        emoji: "😴", 
        text: "He actively participated in activities and concentration time", 
        category: "activity" 
      },
      { 
        emoji: "🎨", 
        text: "He was in solidarity with other children", 
        category: "social" 
      },
      { 
        emoji: "✅", 
        text: "His pronunciation went well, he was autonomous in most activities", 
        category: "achievement" 
      },
      { 
        emoji: "👍", 
        text: "He respected hygiene rules correctly", 
        category: "hygiene" 
      },
    ],
    
    // Format 2: Paragraph format (for parents who prefer narrative)
    reportParagraph: "Today, Charlie was joyful with a normal energy level 😊. He didn't take his afternoon snack 🟢, so it would be good to prepare a small ritual for the meal 🍎. He actively participated in activities and concentration time 😴, and was in solidarity with other children 🎨. His pronunciation went well ✅, he was autonomous in most activities 👍, and respected hygiene rules correctly.",
    
    // Educator's additional note
    educatorNote: "In addition, the teacher added: He did his exercises correctly and showed great improvement in focus today.",
    
    // Additional metadata
    attendance: "Present",
    arrivalTime: "08:30 AM",
    departureTime: "04:00 PM",
  },
  
  {
    childId: "child-002",
    name: "Emma Watson",
    age: 6,
    mood: "Neutral",
    date: "December 24, 2025",
    
    reportLines: [
      { 
        emoji: "😐", 
        text: "Today, your child had a calm day with moderate energy", 
        category: "mood" 
      },
      { 
        emoji: "🟡", 
        text: "She ate her lunch but skipped breakfast", 
        category: "meal" 
      },
      { 
        emoji: "📚", 
        text: "Participated well in reading activities", 
        category: "activity" 
      },
      { 
        emoji: "🤝", 
        text: "Needs encouragement in group activities", 
        category: "suggestion" 
      },
      { 
        emoji: "💪", 
        text: "Showed great improvement in motor skills during playground time", 
        category: "achievement" 
      },
      { 
        emoji: "🎵", 
        text: "Enjoyed music class and learned a new song", 
        category: "activity" 
      },
    ],
    
    reportParagraph: "Emma had a calm day with moderate energy 😐. She ate her lunch but skipped breakfast 🟡, so please ensure she has a good breakfast tomorrow. She participated well in reading activities 📚 and enjoyed music class, learning a new song 🎵. She needs some encouragement in group activities 🤝, but showed great improvement in motor skills during playground time 💪.",
    
    educatorNote: "Emma was a bit tired today but still engaged well. She might benefit from earlier bedtime to ensure she's well-rested.",
    
    attendance: "Present",
    arrivalTime: "08:15 AM",
    departureTime: "03:45 PM",
  },
  
  {
    childId: "child-003",
    name: "Sophia Johnson",
    age: 4,
    mood: "Sad",
    date: "December 24, 2025",
    
    reportLines: [
      { 
        emoji: "😢", 
        text: "Today, your child seemed a bit down and had low energy", 
        category: "mood" 
      },
      { 
        emoji: "🔴", 
        text: "She missed snack time and only ate half of her lunch", 
        category: "meal" 
      },
      { 
        emoji: "🤗", 
        text: "She needed extra comfort and reassurance today", 
        category: "suggestion" 
      },
      { 
        emoji: "🎨", 
        text: "She enjoyed art activities and created a beautiful drawing", 
        category: "activity" 
      },
      { 
        emoji: "😴", 
        text: "She took a longer nap than usual, which helped her mood", 
        category: "rest" 
      },
      { 
        emoji: "🌟", 
        text: "Despite the rough start, she ended the day with a smile", 
        category: "achievement" 
      },
    ],
    
    reportParagraph: "Sophia seemed a bit down today and had low energy 😢. She missed snack time and only ate half of her lunch 🔴, so we gave her extra comfort and reassurance 🤗. She enjoyed art activities and created a beautiful drawing 🎨, which brightened her mood. She took a longer nap than usual 😴, which really helped. Despite the rough start, she ended the day with a smile 🌟.",
    
    educatorNote: "Sophia mentioned she missed you today. A quick check-in call during lunch might help her feel more secure tomorrow.",
    
    attendance: "Present",
    arrivalTime: "09:00 AM",
    departureTime: "04:15 PM",
  },
  
  {
    childId: "child-004",
    name: "Liam Miller",
    age: 7,
    mood: "Happy",
    date: "December 24, 2025",
    
    reportLines: [
      { 
        emoji: "😄", 
        text: "Liam had an excellent day full of enthusiasm and high energy!", 
        category: "mood" 
      },
      { 
        emoji: "🍽️", 
        text: "He finished all his meals and asked for seconds at lunch", 
        category: "meal" 
      },
      { 
        emoji: "⚽", 
        text: "He excelled in physical activities and scored two goals in soccer", 
        category: "activity" 
      },
      { 
        emoji: "🧮", 
        text: "Completed his math homework ahead of schedule", 
        category: "achievement" 
      },
      { 
        emoji: "👨‍👩‍👧‍👦", 
        text: "He was helpful to younger children and showed leadership", 
        category: "social" 
      },
      { 
        emoji: "🌟", 
        text: "Teacher chose him as 'Star Student of the Day'", 
        category: "achievement" 
      },
    ],
    
    reportParagraph: "Liam had an excellent day full of enthusiasm and high energy! 😄 He finished all his meals and even asked for seconds at lunch 🍽️. He excelled in physical activities, scoring two goals in soccer ⚽, and completed his math homework ahead of schedule 🧮. He was very helpful to younger children and showed great leadership qualities 👨‍👩‍👧‍👦. The teacher chose him as 'Star Student of the Day' 🌟!",
    
    educatorNote: "Liam is doing wonderfully! Keep encouraging his leadership skills - he's a natural role model for other children.",
    
    attendance: "Present",
    arrivalTime: "08:20 AM",
    departureTime: "04:30 PM",
  },
];

// Helper function to get reports for a specific child
export const getReportByChildId = (childId) => {
  return mockDailyReports.find(report => report.childId === childId);
};

// Helper function to get reports for a specific date
export const getReportsByDate = (date) => {
  return mockDailyReports.filter(report => report.date === date);
};

// Helper function to get all reports for a parent (multiple children)
export const getReportsForParent = (childIds) => {
  return mockDailyReports.filter(report => childIds.includes(report.childId));
};

// Category color mapping (for consistent styling)
export const categoryColors = {
  mood: "#10b981",      // Green
  meal: "#f59e0b",      // Orange
  suggestion: "#6366f1", // Blue
  activity: "#8b5cf6",   // Purple
  social: "#ec4899",     // Pink
  achievement: "#10b981", // Green
  hygiene: "#06b6d4",    // Cyan
  rest: "#a855f7",       // Purple
};

// Mood to emoji mapping
export const moodEmojis = {
  Happy: "😊",
  Sad: "😢",
  Neutral: "😐",
  Excited: "😄",
  Tired: "😴",
  Angry: "😠",
};

export default mockDailyReports;
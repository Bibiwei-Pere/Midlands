import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

export const formatText = (text: any) => {
  // Split the text by `\n` for line breaks
  const formattedText = text.split("\n").map((line: any, index: number) => {
    // Use regex to find text between asterisks and wrap in <strong> tags
    const regex = /\*(.*?)\*/g;
    const lineWithBold = line.split(regex).map((segment: string, i: number) => {
      // Alternate segments between normal and bold text based on regex match
      return i % 2 === 1 ? (
        <strong className='text-yellow-500' key={`${index}-${i}`}>
          {segment}
        </strong>
      ) : (
        segment
      );
    });

    return (
      <span key={index}>
        {lineWithBold}
        <br />
      </span>
    );
  });

  return formattedText;
};

export const filterEventsByDate = (events: any, range: string, isPast = true) => {
  const now = new Date();
  let startDate: Date, endDate: Date;

  console.log("Initial events:", events); // Debugging log
  console.log("Initial events:", range); // Debugging log

  // Determine the date range based on the given range
  switch (range) {
    case "Today":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      endDate = new Date(now.setHours(23, 59, 59, 999));
      break;
    case "Tomorrow":
      startDate = addDays(now, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = addDays(now, 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "This Week": // New case for filtering events within this week
      startDate = startOfWeek(now, { weekStartsOn: 1 }); // Assuming week starts on Monday, change if needed
      endDate = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case "Next Week":
      startDate = startOfWeek(addDays(now, 7), { weekStartsOn: 1 });
      endDate = endOfWeek(addDays(now, 7), { weekStartsOn: 1 });
      break;
    case "This Month": // New case for filtering events within this month
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
    case "Next Month":
      startDate = startOfMonth(addDays(now, 30));
      endDate = endOfMonth(addDays(now, 30));
      break;
    case "Next Year":
      startDate = startOfYear(addDays(now, 365));
      endDate = endOfYear(addDays(now, 365));
      break;
    case "Yesterday":
      startDate = subDays(now, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = subDays(now, 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "Last Week":
      startDate = startOfWeek(subDays(now, 7), { weekStartsOn: 1 });
      endDate = endOfWeek(subDays(now, 7), { weekStartsOn: 1 });
      break;
    case "Last Month":
      startDate = startOfMonth(subDays(now, 30));
      endDate = endOfMonth(subDays(now, 30));
      break;
    case "Last Year":
      startDate = startOfYear(subDays(now, 365));
      endDate = endOfYear(subDays(now, 365));
      break;
    default:
      // If no range is provided, return all events
      return events;
  }

  console.log("Filtering events from:", startDate, "to:", endDate); // Debugging log

  // Filter events based on the date range
  const filteredEvents = events.filter((event: any) => {
    const eventDate = new Date(event.createdAt);
    console.log("Event date:", eventDate); // Debugging log
    return isPast ? eventDate <= endDate && eventDate >= startDate : eventDate >= startDate && eventDate <= endDate;
  });

  console.log("Filtered events:", filteredEvents); // Debugging log
  return filteredEvents;
};

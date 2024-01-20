export default function getChatDay(date1, date2) {
  let dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const RecentChat = new Date(date1);
  const RecentChatDay = RecentChat.getDate();
  const RecentChatMonth = RecentChat.getMonth();
  const RecentChatYear = RecentChat.getYear();

  //previous Chat

  const PreviousDate = new Date(date2);
  const PreviousChatDay = PreviousDate.getDate();
  const PreviousChatMonth = PreviousDate.getMonth();
  const PreviousChatYear = PreviousDate.getYear();

  //Today
  const Today = new Date();
  const todaysDay = Today.getDate();
  const todaysMonth = Today.getMonth();
  const todaysYear = Today.getYear();

  const IsTheSameDay =
    RecentChatDay === PreviousChatDay &&
    RecentChatMonth === PreviousChatMonth &&
    RecentChatYear === PreviousChatYear;

  const IsToday =
    RecentChatDay === todaysDay &&
    RecentChatMonth === todaysMonth &&
    RecentChatYear === todaysYear;

  const IsYesterday =
    RecentChatDay === todaysDay - 1 &&
    RecentChatMonth === todaysMonth &&
    RecentChatYear === todaysYear;

  const IsWithinTheWeek = PreviousChatDay > RecentChatDay - 8 && !IsToday;

  const IsFirstMessage = date1 === date2;

  if (IsFirstMessage) {
    if (IsToday) {
      return "Today";
    }
    if (IsYesterday) {
      return "Yesterday";
    }
    if (IsWithinTheWeek) {
      const dayOfWeek = dayNames[RecentChat.getDay()];
      return dayOfWeek;
    }
    return formatDate(RecentChat);
  }
  if (IsTheSameDay) {
    return null;
  }
  if (IsToday) {
    return "today";
  }
  if (IsYesterday) {
    return "Yesterday";
  }
  if (IsWithinTheWeek && !IsTheSameDay) {
    const dayOfWeek = dayNames[RecentChat.getDay()];
    return dayOfWeek;
  } else {
    return formatDate(RecentChat);
  }
}

function formatDate(inputDate) {
  // Array of month names
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  // Extract the day, month, and year components from the input date
  var day = inputDate.getDate();
  var month = monthNames[inputDate.getMonth()];
  var year = inputDate.getFullYear();

  // Add the suffix to the day
  var suffix = getDaySuffix(day);
  var formattedDate = day + suffix + " " + month + ", " + year;

  return formattedDate;
}

// Helper function to get the day suffix (st, nd, rd, or th)
function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }

  var lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

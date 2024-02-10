export default function getChatDay(date1, date2) {
  let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
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
    (RecentChatDay === todaysDay - 1 &&
      RecentChatMonth === todaysMonth &&
      RecentChatYear === todaysYear) ||
    todaysDay === 1;

  const IsWithinTheWeek =
    PreviousChatDay < RecentChatDay - 7 && !IsToday && todaysMonth;

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
  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ];

  var day = inputDate.getDate();
  var month = monthNames[inputDate.getMonth()];
  var year = inputDate.getFullYear();

  var formattedDate = day + " " + month + " " + year;

  return formattedDate;
}

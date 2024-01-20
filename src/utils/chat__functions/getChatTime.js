export default function getChatTime(date) {
  let dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const text = new Date(date);
  const textDay = text.getDate();
  const textMonth = text.getMonth();
  const textYear = text.getYear();

  //Today
  const Today = new Date();
  const todaysDay = Today.getDate();
  const todaysMonth = Today.getMonth();
  const todaysYear = Today.getYear();

  const IsToday =
    textDay === todaysDay &&
    textMonth === todaysMonth &&
    textYear === todaysYear;

  const IsYesterday =
    textDay === todaysDay - 1 &&
    textMonth == todaysMonth &&
    textYear === todaysYear;

  const IsWithinTheWeek = textDay > todaysDay - 8 && !IsToday;

  if (IsToday) {
    const chatTime = new Date(date);
    const time = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: false
    }).format(chatTime);

    return time;
  }
  if (IsYesterday) {
    return "Yesterday";
  }
  if (IsWithinTheWeek) {
    const dayOfWeek = dayNames[text.getDay()];
    return dayOfWeek;
  } else {
    return text.toLocaleDateString("en-GB");
  }
}

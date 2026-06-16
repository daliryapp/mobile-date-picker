// src/MobileDatePicker.tsx
import { useEffect, useMemo, useRef, useState } from "react";

// node_modules/date-fns/constants.js
var daysInYear = 365.2425;
var maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1e3;
var minTime = -maxTime;
var millisecondsInWeek = 6048e5;
var millisecondsInDay = 864e5;
var secondsInHour = 3600;
var secondsInDay = secondsInHour * 24;
var secondsInWeek = secondsInDay * 7;
var secondsInYear = secondsInDay * daysInYear;
var secondsInMonth = secondsInYear / 12;
var secondsInQuarter = secondsInMonth * 3;
var constructFromSymbol = Symbol.for("constructDateFrom");

// node_modules/date-fns/constructFrom.js
function constructFrom(date, value) {
  if (typeof date === "function") return date(value);
  if (date && typeof date === "object" && constructFromSymbol in date)
    return date[constructFromSymbol](value);
  if (date instanceof Date) return new date.constructor(value);
  return new Date(value);
}

// node_modules/date-fns/toDate.js
function toDate(argument, context) {
  return constructFrom(context || argument, argument);
}

// node_modules/date-fns/_lib/defaultOptions.js
var defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}

// node_modules/date-fns/startOfWeek.js
function startOfWeek(date, options) {
  const defaultOptions3 = getDefaultOptions();
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions3.weekStartsOn ?? defaultOptions3.locale?.options?.weekStartsOn ?? 0;
  const _date = toDate(date, options?.in);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  _date.setDate(_date.getDate() - diff);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// node_modules/date-fns/startOfISOWeek.js
function startOfISOWeek(date, options) {
  return startOfWeek(date, { ...options, weekStartsOn: 1 });
}

// node_modules/date-fns/getISOWeekYear.js
function getISOWeekYear(date, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();
  const fourthOfJanuaryOfNextYear = constructFrom(_date, 0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
  const fourthOfJanuaryOfThisYear = constructFrom(_date, 0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds()
    )
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}

// node_modules/date-fns/_lib/normalizeDates.js
function normalizeDates(context, ...dates) {
  const normalize = constructFrom.bind(
    null,
    context || dates.find((date) => typeof date === "object")
  );
  return dates.map(normalize);
}

// node_modules/date-fns/startOfDay.js
function startOfDay(date, options) {
  const _date = toDate(date, options?.in);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// node_modules/date-fns/differenceInCalendarDays.js
function differenceInCalendarDays(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  const laterStartOfDay = startOfDay(laterDate_);
  const earlierStartOfDay = startOfDay(earlierDate_);
  const laterTimestamp = +laterStartOfDay - getTimezoneOffsetInMilliseconds(laterStartOfDay);
  const earlierTimestamp = +earlierStartOfDay - getTimezoneOffsetInMilliseconds(earlierStartOfDay);
  return Math.round((laterTimestamp - earlierTimestamp) / millisecondsInDay);
}

// node_modules/date-fns/startOfISOWeekYear.js
function startOfISOWeekYear(date, options) {
  const year = getISOWeekYear(date, options);
  const fourthOfJanuary = constructFrom(options?.in || date, 0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  return startOfISOWeek(fourthOfJanuary);
}

// node_modules/date-fns/isDate.js
function isDate(value) {
  return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
}

// node_modules/date-fns/isValid.js
function isValid(date) {
  return !(!isDate(date) && typeof date !== "number" || isNaN(+toDate(date)));
}

// node_modules/date-fns/startOfYear.js
function startOfYear(date, options) {
  const date_ = toDate(date, options?.in);
  date_.setFullYear(date_.getFullYear(), 0, 1);
  date_.setHours(0, 0, 0, 0);
  return date_;
}

// node_modules/date-fns/locale/en-US/_lib/formatDistance.js
var formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};
var formatDistance = (token, count, options) => {
  let result;
  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options?.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};

// node_modules/date-fns/locale/_lib/buildFormatLongFn.js
function buildFormatLongFn(args) {
  return (options = {}) => {
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format3 = args.formats[width] || args.formats[args.defaultWidth];
    return format3;
  };
}

// node_modules/date-fns/locale/en-US/_lib/formatLong.js
var dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};

// node_modules/date-fns/locale/en-US/_lib/formatRelative.js
var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
};
var formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];

// node_modules/date-fns/locale/_lib/buildLocalizeFn.js
function buildLocalizeFn(args) {
  return (value, options) => {
    const context = options?.context ? String(options.context) : "standalone";
    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = options?.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = options?.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index];
  };
}

// node_modules/date-fns/locale/en-US/_lib/localize.js
var eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
};
var quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
};
var monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
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
  ]
};
var dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
};
var dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
};
var ordinalNumber = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
var localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns/locale/_lib/buildMatchFn.js
function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;
    const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];
    const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : (
      // [TODO] -- I challenge you to fix the type
      findKey(parsePatterns, (pattern) => pattern.test(matchedString))
    );
    let value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      options.valueCallback(value)
    ) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
function findKey(object, predicate) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}

// node_modules/date-fns/locale/_lib/buildMatchPatternFn.js
function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];
    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}

// node_modules/date-fns/locale/en-US/_lib/match.js
var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns/locale/en-US.js
var enUS = {
  code: "en-US",
  formatDistance,
  formatLong,
  formatRelative,
  localize,
  match,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};

// node_modules/date-fns/getDayOfYear.js
function getDayOfYear(date, options) {
  const _date = toDate(date, options?.in);
  const diff = differenceInCalendarDays(_date, startOfYear(_date));
  const dayOfYear = diff + 1;
  return dayOfYear;
}

// node_modules/date-fns/getISOWeek.js
function getISOWeek(date, options) {
  const _date = toDate(date, options?.in);
  const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);
  return Math.round(diff / millisecondsInWeek) + 1;
}

// node_modules/date-fns/getWeekYear.js
function getWeekYear(date, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();
  const defaultOptions3 = getDefaultOptions();
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions3.firstWeekContainsDate ?? defaultOptions3.locale?.options?.firstWeekContainsDate ?? 1;
  const firstWeekOfNextYear = constructFrom(options?.in || date, 0);
  firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);
  const firstWeekOfThisYear = constructFrom(options?.in || date, 0);
  firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);
  if (+_date >= +startOfNextYear) {
    return year + 1;
  } else if (+_date >= +startOfThisYear) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns/startOfWeekYear.js
function startOfWeekYear(date, options) {
  const defaultOptions3 = getDefaultOptions();
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions3.firstWeekContainsDate ?? defaultOptions3.locale?.options?.firstWeekContainsDate ?? 1;
  const year = getWeekYear(date, options);
  const firstWeek = constructFrom(options?.in || date, 0);
  firstWeek.setFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  const _date = startOfWeek(firstWeek, options);
  return _date;
}

// node_modules/date-fns/getWeek.js
function getWeek(date, options) {
  const _date = toDate(date, options?.in);
  const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);
  return Math.round(diff / millisecondsInWeek) + 1;
}

// node_modules/date-fns/_lib/addLeadingZeros.js
function addLeadingZeros(number, targetLength) {
  const sign = number < 0 ? "-" : "";
  const output = Math.abs(number).toString().padStart(targetLength, "0");
  return sign + output;
}

// node_modules/date-fns/_lib/format/lightFormatters.js
var lightFormatters = {
  // Year
  y(date, token) {
    const signedYear = date.getFullYear();
    const year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
  },
  // Month
  M(date, token) {
    const month = date.getMonth();
    return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },
  // Day of the month
  d(date, token) {
    return addLeadingZeros(date.getDate(), token.length);
  },
  // AM or PM
  a(date, token) {
    const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return dayPeriodEnumValue.toUpperCase();
      case "aaa":
        return dayPeriodEnumValue;
      case "aaaaa":
        return dayPeriodEnumValue[0];
      case "aaaa":
      default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(date, token) {
    return addLeadingZeros(date.getHours() % 12 || 12, token.length);
  },
  // Hour [0-23]
  H(date, token) {
    return addLeadingZeros(date.getHours(), token.length);
  },
  // Minute
  m(date, token) {
    return addLeadingZeros(date.getMinutes(), token.length);
  },
  // Second
  s(date, token) {
    return addLeadingZeros(date.getSeconds(), token.length);
  },
  // Fraction of second
  S(date, token) {
    const numberOfDigits = token.length;
    const milliseconds = date.getMilliseconds();
    const fractionalSeconds = Math.trunc(
      milliseconds * Math.pow(10, numberOfDigits - 3)
    );
    return addLeadingZeros(fractionalSeconds, token.length);
  }
};

// node_modules/date-fns/_lib/format/formatters.js
var dayPeriodEnum = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
};
var formatters = {
  // Era
  G: function(date, token, localize3) {
    const era = date.getFullYear() > 0 ? 1 : 0;
    switch (token) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return localize3.era(era, { width: "abbreviated" });
      // A, B
      case "GGGGG":
        return localize3.era(era, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return localize3.era(era, { width: "wide" });
    }
  },
  // Year
  y: function(date, token, localize3) {
    if (token === "yo") {
      const signedYear = date.getFullYear();
      const year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize3.ordinalNumber(year, { unit: "year" });
    }
    return lightFormatters.y(date, token);
  },
  // Local week-numbering year
  Y: function(date, token, localize3, options) {
    const signedWeekYear = getWeekYear(date, options);
    const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
    if (token === "YY") {
      const twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    }
    if (token === "Yo") {
      return localize3.ordinalNumber(weekYear, { unit: "year" });
    }
    return addLeadingZeros(weekYear, token.length);
  },
  // ISO week-numbering year
  R: function(date, token) {
    const isoWeekYear = getISOWeekYear(date);
    return addLeadingZeros(isoWeekYear, token.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(date, token) {
    const year = date.getFullYear();
    return addLeadingZeros(year, token.length);
  },
  // Quarter
  Q: function(date, token, localize3) {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "Q":
        return String(quarter);
      // 01, 02, 03, 04
      case "QQ":
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return localize3.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return localize3.quarter(quarter, {
          width: "abbreviated",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return localize3.quarter(quarter, {
          width: "narrow",
          context: "formatting"
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return localize3.quarter(quarter, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(date, token, localize3) {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "q":
        return String(quarter);
      // 01, 02, 03, 04
      case "qq":
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return localize3.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return localize3.quarter(quarter, {
          width: "abbreviated",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return localize3.quarter(quarter, {
          width: "narrow",
          context: "standalone"
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return localize3.quarter(quarter, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(date, token, localize3) {
    const month = date.getMonth();
    switch (token) {
      case "M":
      case "MM":
        return lightFormatters.M(date, token);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return localize3.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "MMM":
        return localize3.month(month, {
          width: "abbreviated",
          context: "formatting"
        });
      // J, F, ..., D
      case "MMMMM":
        return localize3.month(month, {
          width: "narrow",
          context: "formatting"
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return localize3.month(month, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(date, token, localize3) {
    const month = date.getMonth();
    switch (token) {
      // 1, 2, ..., 12
      case "L":
        return String(month + 1);
      // 01, 02, ..., 12
      case "LL":
        return addLeadingZeros(month + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return localize3.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "LLL":
        return localize3.month(month, {
          width: "abbreviated",
          context: "standalone"
        });
      // J, F, ..., D
      case "LLLLL":
        return localize3.month(month, {
          width: "narrow",
          context: "standalone"
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return localize3.month(month, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(date, token, localize3, options) {
    const week = getWeek(date, options);
    if (token === "wo") {
      return localize3.ordinalNumber(week, { unit: "week" });
    }
    return addLeadingZeros(week, token.length);
  },
  // ISO week of year
  I: function(date, token, localize3) {
    const isoWeek = getISOWeek(date);
    if (token === "Io") {
      return localize3.ordinalNumber(isoWeek, { unit: "week" });
    }
    return addLeadingZeros(isoWeek, token.length);
  },
  // Day of the month
  d: function(date, token, localize3) {
    if (token === "do") {
      return localize3.ordinalNumber(date.getDate(), { unit: "date" });
    }
    return lightFormatters.d(date, token);
  },
  // Day of year
  D: function(date, token, localize3) {
    const dayOfYear = getDayOfYear(date);
    if (token === "Do") {
      return localize3.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
    }
    return addLeadingZeros(dayOfYear, token.length);
  },
  // Day of week
  E: function(date, token, localize3) {
    const dayOfWeek = date.getDay();
    switch (token) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return localize3.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "EEEEE":
        return localize3.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return localize3.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "EEEE":
      default:
        return localize3.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(date, token, localize3, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(localDayOfWeek);
      // Padded numerical value
      case "ee":
        return addLeadingZeros(localDayOfWeek, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return localize3.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "eee":
        return localize3.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "eeeee":
        return localize3.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return localize3.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "eeee":
      default:
        return localize3.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(date, token, localize3, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (same as in `e`)
      case "c":
        return String(localDayOfWeek);
      // Padded numerical value
      case "cc":
        return addLeadingZeros(localDayOfWeek, token.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return localize3.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "ccc":
        return localize3.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone"
        });
      // T
      case "ccccc":
        return localize3.day(dayOfWeek, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return localize3.day(dayOfWeek, {
          width: "short",
          context: "standalone"
        });
      // Tuesday
      case "cccc":
      default:
        return localize3.day(dayOfWeek, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(date, token, localize3) {
    const dayOfWeek = date.getDay();
    const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      // 2
      case "i":
        return String(isoDayOfWeek);
      // 02
      case "ii":
        return addLeadingZeros(isoDayOfWeek, token.length);
      // 2nd
      case "io":
        return localize3.ordinalNumber(isoDayOfWeek, { unit: "day" });
      // Tue
      case "iii":
        return localize3.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "iiiii":
        return localize3.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "iiiiii":
        return localize3.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "iiii":
      default:
        return localize3.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(date, token, localize3) {
    const hours = date.getHours();
    const dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(date, token, localize3) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    }
    switch (token) {
      case "b":
      case "bb":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(date, token, localize3) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }
    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(date, token, localize3) {
    if (token === "ho") {
      let hours = date.getHours() % 12;
      if (hours === 0) hours = 12;
      return localize3.ordinalNumber(hours, { unit: "hour" });
    }
    return lightFormatters.h(date, token);
  },
  // Hour [0-23]
  H: function(date, token, localize3) {
    if (token === "Ho") {
      return localize3.ordinalNumber(date.getHours(), { unit: "hour" });
    }
    return lightFormatters.H(date, token);
  },
  // Hour [0-11]
  K: function(date, token, localize3) {
    const hours = date.getHours() % 12;
    if (token === "Ko") {
      return localize3.ordinalNumber(hours, { unit: "hour" });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Hour [1-24]
  k: function(date, token, localize3) {
    let hours = date.getHours();
    if (hours === 0) hours = 24;
    if (token === "ko") {
      return localize3.ordinalNumber(hours, { unit: "hour" });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Minute
  m: function(date, token, localize3) {
    if (token === "mo") {
      return localize3.ordinalNumber(date.getMinutes(), { unit: "minute" });
    }
    return lightFormatters.m(date, token);
  },
  // Second
  s: function(date, token, localize3) {
    if (token === "so") {
      return localize3.ordinalNumber(date.getSeconds(), { unit: "second" });
    }
    return lightFormatters.s(date, token);
  },
  // Fraction of second
  S: function(date, token) {
    return lightFormatters.S(date, token);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    if (timezoneOffset === 0) {
      return "Z";
    }
    switch (token) {
      // Hours and optional minutes
      case "X":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return formatTimezone(timezoneOffset);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case "XXXXX":
      case "XXX":
      // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Hours and optional minutes
      case "x":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return formatTimezone(timezoneOffset);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case "xxxxx":
      case "xxx":
      // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (GMT)
  O: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "OOOO":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "zzzz":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Seconds timestamp
  t: function(date, token, _localize) {
    const timestamp = Math.trunc(+date / 1e3);
    return addLeadingZeros(timestamp, token.length);
  },
  // Milliseconds timestamp
  T: function(date, token, _localize) {
    return addLeadingZeros(+date, token.length);
  }
};
function formatTimezoneShort(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = Math.trunc(absOffset / 60);
  const minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset, delimiter) {
  if (offset % 60 === 0) {
    const sign = offset > 0 ? "-" : "+";
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
  }
  return formatTimezone(offset, delimiter);
}
function formatTimezone(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = addLeadingZeros(Math.trunc(absOffset / 60), 2);
  const minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}

// node_modules/date-fns/_lib/format/longFormatters.js
var dateLongFormatter = (pattern, formatLong3) => {
  switch (pattern) {
    case "P":
      return formatLong3.date({ width: "short" });
    case "PP":
      return formatLong3.date({ width: "medium" });
    case "PPP":
      return formatLong3.date({ width: "long" });
    case "PPPP":
    default:
      return formatLong3.date({ width: "full" });
  }
};
var timeLongFormatter = (pattern, formatLong3) => {
  switch (pattern) {
    case "p":
      return formatLong3.time({ width: "short" });
    case "pp":
      return formatLong3.time({ width: "medium" });
    case "ppp":
      return formatLong3.time({ width: "long" });
    case "pppp":
    default:
      return formatLong3.time({ width: "full" });
  }
};
var dateTimeLongFormatter = (pattern, formatLong3) => {
  const matchResult = pattern.match(/(P+)(p+)?/) || [];
  const datePattern = matchResult[1];
  const timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong3);
  }
  let dateTimeFormat;
  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong3.dateTime({ width: "short" });
      break;
    case "PP":
      dateTimeFormat = formatLong3.dateTime({ width: "medium" });
      break;
    case "PPP":
      dateTimeFormat = formatLong3.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong3.dateTime({ width: "full" });
      break;
  }
  return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong3)).replace("{{time}}", timeLongFormatter(timePattern, formatLong3));
};
var longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};

// node_modules/date-fns/_lib/protectedTokens.js
var dayOfYearTokenRE = /^D+$/;
var weekYearTokenRE = /^Y+$/;
var throwTokens = ["D", "DD", "YY", "YYYY"];
function isProtectedDayOfYearToken(token) {
  return dayOfYearTokenRE.test(token);
}
function isProtectedWeekYearToken(token) {
  return weekYearTokenRE.test(token);
}
function warnOrThrowProtectedError(token, format3, input) {
  const _message = message(token, format3, input);
  console.warn(_message);
  if (throwTokens.includes(token)) throw new RangeError(_message);
}
function message(token, format3, input) {
  const subject = token[0] === "Y" ? "years" : "days of the month";
  return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format3}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}

// node_modules/date-fns/format.js
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function format(date, formatStr, options) {
  const defaultOptions3 = getDefaultOptions();
  const locale = options?.locale ?? defaultOptions3.locale ?? enUS;
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions3.firstWeekContainsDate ?? defaultOptions3.locale?.options?.firstWeekContainsDate ?? 1;
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions3.weekStartsOn ?? defaultOptions3.locale?.options?.weekStartsOn ?? 0;
  const originalDate = toDate(date, options?.in);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  let parts = formatStr.match(longFormattingTokensRegExp).map((substring) => {
    const firstCharacter = substring[0];
    if (firstCharacter === "p" || firstCharacter === "P") {
      const longFormatter = longFormatters[firstCharacter];
      return longFormatter(substring, locale.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp).map((substring) => {
    if (substring === "''") {
      return { isToken: false, value: "'" };
    }
    const firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return { isToken: false, value: cleanEscapedString(substring) };
    }
    if (formatters[firstCharacter]) {
      return { isToken: true, value: substring };
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + firstCharacter + "`"
      );
    }
    return { isToken: false, value: substring };
  });
  if (locale.localize.preprocessor) {
    parts = locale.localize.preprocessor(originalDate, parts);
  }
  const formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale
  };
  return parts.map((part) => {
    if (!part.isToken) return part.value;
    const token = part.value;
    if (!options?.useAdditionalWeekYearTokens && isProtectedWeekYearToken(token) || !options?.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(token)) {
      warnOrThrowProtectedError(token, formatStr, String(date));
    }
    const formatter = formatters[token[0]];
    return formatter(originalDate, token, locale.localize, formatterOptions);
  }).join("");
}
function cleanEscapedString(input) {
  const matched = input.match(escapedStringRegExp);
  if (!matched) {
    return input;
  }
  return matched[1].replace(doubleQuoteRegExp, "'");
}

// node_modules/date-fns/getDate.js
function getDate(date, options) {
  return toDate(date, options?.in).getDate();
}

// node_modules/date-fns/getDaysInMonth.js
function getDaysInMonth(date, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();
  const monthIndex = _date.getMonth();
  const lastDayOfMonth = constructFrom(_date, 0);
  lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
  lastDayOfMonth.setHours(0, 0, 0, 0);
  return lastDayOfMonth.getDate();
}

// node_modules/date-fns/getMonth.js
function getMonth(date, options) {
  return toDate(date, options?.in).getMonth();
}

// node_modules/date-fns/getYear.js
function getYear(date, options) {
  return toDate(date, options?.in).getFullYear();
}

// node_modules/date-fns-jalali/constants.js
var daysInYear2 = 365.2425;
var maxTime2 = Math.pow(10, 8) * 24 * 60 * 60 * 1e3;
var minTime2 = -maxTime2;
var millisecondsInWeek2 = 6048e5;
var millisecondsInDay2 = 864e5;
var secondsInHour2 = 3600;
var secondsInDay2 = secondsInHour2 * 24;
var secondsInWeek2 = secondsInDay2 * 7;
var secondsInYear2 = secondsInDay2 * daysInYear2;
var secondsInMonth2 = secondsInYear2 / 12;
var secondsInQuarter2 = secondsInMonth2 * 3;
var constructFromSymbol2 = Symbol.for("constructDateFrom");

// node_modules/date-fns-jalali/_lib/jalali.js
var PERSIAN_EPOCH = 1948320;
var PERSIAN_NUM_DAYS = [
  0,
  31,
  62,
  93,
  124,
  155,
  186,
  216,
  246,
  276,
  306,
  336
];
function toJalali(gy, gm, gd) {
  return d2j(g2d(gy, gm, gd));
}
function toGregorian(jy, jm, jd) {
  return d2g(j2d(jy, jm, jd));
}
function j2d(jy, jm, jd) {
  const [ny, nm] = normalizeMonth(jy, jm);
  jy = ny;
  jm = nm;
  const month = jm - 1;
  const year = jy;
  const day = jd;
  let julianDay = PERSIAN_EPOCH - 1 + 365 * (year - 1) + div(8 * year + 21, 33);
  if (month != 0) {
    julianDay += PERSIAN_NUM_DAYS[month];
  }
  return julianDay + day;
}
function d2j(julianDay) {
  if (isNaN(julianDay)) {
    return { jy: NaN, jm: NaN, jd: NaN };
  }
  let month, dayOfYear;
  const daysSinceEpoch = julianDay - PERSIAN_EPOCH;
  let year = 1 + div(33 * daysSinceEpoch + 3, 12053);
  dayOfYear = daysSinceEpoch - (365 * (year - 1) + div(8 * year + 21, 33));
  if (dayOfYear < 0) {
    year--;
    dayOfYear = daysSinceEpoch - (365 * (year - 1) + div(8 * year + 21, 33));
  }
  if (dayOfYear < 216) {
    month = div(dayOfYear, 31);
  } else {
    month = div(dayOfYear - 6, 30);
  }
  const dayOfMonth = dayOfYear - PERSIAN_NUM_DAYS[month] + 1;
  dayOfYear++;
  const jy = year;
  const jm = month + 1;
  const jd = dayOfMonth;
  return { jy, jm, jd };
}
function g2d(gy, gm, gd) {
  const [ny, nm] = normalizeMonth(gy, gm);
  gy = ny;
  gm = nm;
  return div(1461 * (gy + 4800 + div(gm - 14, 12)), 4) + div(367 * (gm - 2 - 12 * div(gm - 14, 12)), 12) - div(3 * div(gy + 4900 + div(gm - 14, 12), 100), 4) + gd - 32075;
}
function d2g(jdn) {
  if (isNaN(jdn)) {
    return { gy: NaN, gm: NaN, gd: NaN };
  }
  let L = jdn + 68569;
  const n = div(4 * L, 146097);
  L = L - div(146097 * n + 3, 4);
  const i = div(4e3 * (L + 1), 1461001);
  L = L - div(1461 * i, 4) + 31;
  const j = div(80 * L, 2447);
  const gd = L - div(2447 * j, 80);
  L = div(j, 11);
  const gm = j + 2 - 12 * L;
  const gy = 100 * (n - 49) + i + L;
  return { gy, gm, gd };
}
function normalizeMonth(year, month) {
  month = month - 1;
  if (month < 0) {
    const old_month = month;
    month = pmod(month, 12);
    year -= div(month - old_month, 12);
  }
  if (month > 11) {
    year += div(month, 12);
    month = mod(month, 12);
  }
  return [year, month + 1];
}
function div(a, b) {
  return ~~(a / b);
}
function mod(a, b) {
  return a - ~~(a / b) * b;
}
function pmod(a, b) {
  return mod(mod(a, b) + b, b);
}

// node_modules/date-fns-jalali/_core/newDate.js
function newDate(...args) {
  if (args.length > 1) {
    const [year, month, day = 1, ...rest] = args;
    const g = toGregorian(year, month + 1, day);
    return new Date(...[g.gy, g.gm - 1, g.gd, ...rest]);
  }
  return new Date(...args);
}

// node_modules/date-fns-jalali/constructFrom.js
function constructFrom2(date, value) {
  if (typeof date === "function") return date(value);
  if (date && typeof date === "object" && constructFromSymbol2 in date)
    return date[constructFromSymbol2](value);
  if (date instanceof Date) return new date.constructor(value);
  return newDate(value);
}

// node_modules/date-fns-jalali/toDate.js
function toDate2(argument, context) {
  return constructFrom2(context || argument, argument);
}

// node_modules/date-fns-jalali/_core/getDate.js
function getDate2(cleanDate) {
  const gd = cleanDate.getDate();
  const gm = cleanDate.getMonth() + 1;
  const gy = cleanDate.getFullYear();
  return toJalali(gy, gm, gd).jd;
}

// node_modules/date-fns-jalali/_core/setDate.js
function setDate(cleanDate, ...args) {
  const gd = cleanDate.getDate();
  const gm = cleanDate.getMonth() + 1;
  const gy = cleanDate.getFullYear();
  const j = toJalali(gy, gm, gd);
  const [date] = args;
  const g = toGregorian(j.jy, j.jm, date);
  return cleanDate.setFullYear(g.gy, g.gm - 1, g.gd);
}

// node_modules/date-fns-jalali/_core/getMonth.js
function getMonth2(cleanDate) {
  const gd = cleanDate.getDate();
  const gm = cleanDate.getMonth() + 1;
  const gy = cleanDate.getFullYear();
  return toJalali(gy, gm, gd).jm - 1;
}

// node_modules/date-fns-jalali/_core/getFullYear.js
function getFullYear(cleanDate) {
  const gd = cleanDate.getDate();
  const gm = cleanDate.getMonth() + 1;
  const gy = cleanDate.getFullYear();
  return toJalali(gy, gm, gd).jy;
}

// node_modules/date-fns-jalali/_core/setFullYear.js
function setFullYear(cleanDate, ...args) {
  const gd = cleanDate.getDate();
  const gm = cleanDate.getMonth() + 1;
  const gy = cleanDate.getFullYear();
  const j = toJalali(gy, gm, gd);
  const [year, month = j.jm - 1, date = j.jd] = args;
  const g = toGregorian(year, month + 1, date);
  return cleanDate.setFullYear(g.gy, g.gm - 1, g.gd);
}

// node_modules/date-fns-jalali/_lib/defaultOptions.js
var defaultOptions2 = {};
function getDefaultOptions2() {
  return defaultOptions2;
}

// node_modules/date-fns-jalali/startOfWeek.js
function startOfWeek2(date, options) {
  const defaultOptions3 = getDefaultOptions2();
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions3.weekStartsOn ?? defaultOptions3.locale?.options?.weekStartsOn ?? 6;
  const _date = toDate2(date, options?.in);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  setDate(_date, getDate2(_date) - diff);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// node_modules/date-fns-jalali/startOfISOWeek.js
function startOfISOWeek2(date, options) {
  return startOfWeek2(date, { ...options, weekStartsOn: 1 });
}

// node_modules/date-fns-jalali/getISOWeekYear.js
function getISOWeekYear2(date, options) {
  const _date = toDate2(date, options?.in);
  const year = _date.getFullYear();
  const fourthOfJanuaryOfNextYear = constructFrom2(_date, 0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfISOWeek2(fourthOfJanuaryOfNextYear);
  const fourthOfJanuaryOfThisYear = constructFrom2(_date, 0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfISOWeek2(fourthOfJanuaryOfThisYear);
  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns-jalali/_lib/getTimezoneOffsetInMilliseconds.js
function getTimezoneOffsetInMilliseconds2(date) {
  const _date = toDate2(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds()
    )
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}

// node_modules/date-fns-jalali/_lib/normalizeDates.js
function normalizeDates2(context, ...dates) {
  const normalize = constructFrom2.bind(
    null,
    context || dates.find((date) => typeof date === "object")
  );
  return dates.map(normalize);
}

// node_modules/date-fns-jalali/startOfDay.js
function startOfDay2(date, options) {
  const _date = toDate2(date, options?.in);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// node_modules/date-fns-jalali/differenceInCalendarDays.js
function differenceInCalendarDays2(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates2(
    options?.in,
    laterDate,
    earlierDate
  );
  const laterStartOfDay = startOfDay2(laterDate_);
  const earlierStartOfDay = startOfDay2(earlierDate_);
  const laterTimestamp = +laterStartOfDay - getTimezoneOffsetInMilliseconds2(laterStartOfDay);
  const earlierTimestamp = +earlierStartOfDay - getTimezoneOffsetInMilliseconds2(earlierStartOfDay);
  return Math.round((laterTimestamp - earlierTimestamp) / millisecondsInDay2);
}

// node_modules/date-fns-jalali/startOfISOWeekYear.js
function startOfISOWeekYear2(date, options) {
  const year = getISOWeekYear2(date, options);
  const fourthOfJanuary = constructFrom2(options?.in || date, 0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  return startOfISOWeek2(fourthOfJanuary);
}

// node_modules/date-fns-jalali/isDate.js
function isDate2(value) {
  return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
}

// node_modules/date-fns-jalali/isValid.js
function isValid2(date) {
  return !(!isDate2(date) && typeof date !== "number" || isNaN(+toDate2(date)));
}

// node_modules/date-fns-jalali/startOfYear.js
function startOfYear2(date, options) {
  const date_ = toDate2(date, options?.in);
  setFullYear(date_, getFullYear(date_), 0, 1);
  date_.setHours(0, 0, 0, 0);
  return date_;
}

// node_modules/date-fns-jalali/locale/fa-IR/_lib/formatDistance.js
var formatDistanceLocale2 = {
  lessThanXSeconds: {
    one: "\u06A9\u0645\u062A\u0631 \u0627\u0632 \u06CC\u06A9 \u062B\u0627\u0646\u06CC\u0647",
    other: "\u06A9\u0645\u062A\u0631 \u0627\u0632 {{count}} \u062B\u0627\u0646\u06CC\u0647"
  },
  xSeconds: {
    one: "1 \u062B\u0627\u0646\u06CC\u0647",
    other: "{{count}} \u062B\u0627\u0646\u06CC\u0647"
  },
  halfAMinute: "\u0646\u06CC\u0645 \u062F\u0642\u06CC\u0642\u0647",
  lessThanXMinutes: {
    one: "\u06A9\u0645\u062A\u0631 \u0627\u0632 \u06CC\u06A9 \u062F\u0642\u06CC\u0642\u0647",
    other: "\u06A9\u0645\u062A\u0631 \u0627\u0632 {{count}} \u062F\u0642\u06CC\u0642\u0647"
  },
  xMinutes: {
    one: "1 \u062F\u0642\u06CC\u0642\u0647",
    other: "{{count}} \u062F\u0642\u06CC\u0642\u0647"
  },
  aboutXHours: {
    one: "\u062D\u062F\u0648\u062F 1 \u0633\u0627\u0639\u062A",
    other: "\u062D\u062F\u0648\u062F {{count}} \u0633\u0627\u0639\u062A"
  },
  xHours: {
    one: "1 \u0633\u0627\u0639\u062A",
    other: "{{count}} \u0633\u0627\u0639\u062A"
  },
  xDays: {
    one: "1 \u0631\u0648\u0632",
    other: "{{count}} \u0631\u0648\u0632"
  },
  aboutXWeeks: {
    one: "\u062D\u062F\u0648\u062F 1 \u0647\u0641\u062A\u0647",
    other: "\u062D\u062F\u0648\u062F {{count}} \u0647\u0641\u062A\u0647"
  },
  xWeeks: {
    one: "1 \u0647\u0641\u062A\u0647",
    other: "{{count}} \u0647\u0641\u062A\u0647"
  },
  aboutXMonths: {
    one: "\u062D\u062F\u0648\u062F 1 \u0645\u0627\u0647",
    other: "\u062D\u062F\u0648\u062F {{count}} \u0645\u0627\u0647"
  },
  xMonths: {
    one: "1 \u0645\u0627\u0647",
    other: "{{count}} \u0645\u0627\u0647"
  },
  aboutXYears: {
    one: "\u062D\u062F\u0648\u062F 1 \u0633\u0627\u0644",
    other: "\u062D\u062F\u0648\u062F {{count}} \u0633\u0627\u0644"
  },
  xYears: {
    one: "1 \u0633\u0627\u0644",
    other: "{{count}} \u0633\u0627\u0644"
  },
  overXYears: {
    one: "\u0628\u06CC\u0634\u062A\u0631 \u0627\u0632 1 \u0633\u0627\u0644",
    other: "\u0628\u06CC\u0634\u062A\u0631 \u0627\u0632 {{count}} \u0633\u0627\u0644"
  },
  almostXYears: {
    one: "\u0646\u0632\u062F\u06CC\u06A9 1 \u0633\u0627\u0644",
    other: "\u0646\u0632\u062F\u06CC\u06A9 {{count}} \u0633\u0627\u0644"
  }
};
var formatDistance2 = (token, count, options) => {
  let result;
  const tokenValue = formatDistanceLocale2[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options?.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "\u062F\u0631 " + result;
    } else {
      return result + " \u0642\u0628\u0644";
    }
  }
  return result;
};

// node_modules/date-fns-jalali/locale/_lib/buildFormatLongFn.js
function buildFormatLongFn2(args) {
  return (options = {}) => {
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format3 = args.formats[width] || args.formats[args.defaultWidth];
    return format3;
  };
}

// node_modules/date-fns-jalali/locale/fa-IR/_lib/formatLong.js
var dateFormats2 = {
  full: "EEEE do MMMM y",
  long: "do MMMM y",
  medium: "d MMM y",
  short: "yyyy/MM/dd"
};
var timeFormats2 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats2 = {
  full: "{{date}} '\u062F\u0631' {{time}}",
  long: "{{date}} '\u062F\u0631' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong2 = {
  date: buildFormatLongFn2({
    formats: dateFormats2,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn2({
    formats: timeFormats2,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn2({
    formats: dateTimeFormats2,
    defaultWidth: "full"
  })
};

// node_modules/date-fns-jalali/locale/fa-IR/_lib/formatRelative.js
var formatRelativeLocale2 = {
  lastWeek: "eeee '\u06AF\u0630\u0634\u062A\u0647 \u062F\u0631' p",
  yesterday: "'\u062F\u06CC\u0631\u0648\u0632 \u062F\u0631' p",
  today: "'\u0627\u0645\u0631\u0648\u0632 \u062F\u0631' p",
  tomorrow: "'\u0641\u0631\u062F\u0627 \u062F\u0631' p",
  nextWeek: "eeee '\u062F\u0631' p",
  other: "P"
};
var formatRelative2 = (token, _date, _baseDate, _options) => formatRelativeLocale2[token];

// node_modules/date-fns-jalali/locale/_lib/buildLocalizeFn.js
function buildLocalizeFn2(args) {
  return (value, options) => {
    const context = options?.context ? String(options.context) : "standalone";
    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = options?.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = options?.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index];
  };
}

// node_modules/date-fns-jalali/locale/fa-IR/_lib/localize.js
var eraValues2 = {
  narrow: ["\u0642", "\u0628"],
  abbreviated: ["\u0642.\u0647.", "\u0628.\u0647."],
  wide: ["\u0642\u0628\u0644 \u0627\u0632 \u0647\u062C\u0631\u062A", "\u0628\u0639\u062F \u0627\u0632 \u0647\u062C\u0631\u062A"]
};
var quarterValues2 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["\u0633\u200C\u06451", "\u0633\u200C\u06452", "\u0633\u200C\u06453", "\u0633\u200C\u06454"],
  wide: ["\u0633\u0647\u200C\u0645\u0627\u0647\u0647 1", "\u0633\u0647\u200C\u0645\u0627\u0647\u0647 2", "\u0633\u0647\u200C\u0645\u0627\u0647\u0647 3", "\u0633\u0647\u200C\u0645\u0627\u0647\u0647 4"]
};
var monthValues2 = {
  narrow: [
    "\u0641\u0631",
    "\u0627\u0631",
    "\u062E\u0631",
    "\u062A\u06CC",
    "\u0645\u0631",
    "\u0634\u0647",
    "\u0645\u0647",
    "\u0622\u0628",
    "\u0622\u0630",
    "\u062F\u06CC",
    "\u0628\u0647",
    "\u0627\u0633"
  ],
  abbreviated: [
    "\u0641\u0631\u0648",
    "\u0627\u0631\u062F",
    "\u062E\u0631\u062F",
    "\u062A\u06CC\u0631",
    "\u0645\u0631\u062F",
    "\u0634\u0647\u0631",
    "\u0645\u0647\u0631",
    "\u0622\u0628\u0627",
    "\u0622\u0630\u0631",
    "\u062F\u06CC",
    "\u0628\u0647\u0645",
    "\u0627\u0633\u0641"
  ],
  wide: [
    "\u0641\u0631\u0648\u0631\u062F\u06CC\u0646",
    "\u0627\u0631\u062F\u06CC\u0628\u0647\u0634\u062A",
    "\u062E\u0631\u062F\u0627\u062F",
    "\u062A\u06CC\u0631",
    "\u0645\u0631\u062F\u0627\u062F",
    "\u0634\u0647\u0631\u06CC\u0648\u0631",
    "\u0645\u0647\u0631",
    "\u0622\u0628\u0627\u0646",
    "\u0622\u0630\u0631",
    "\u062F\u06CC",
    "\u0628\u0647\u0645\u0646",
    "\u0627\u0633\u0641\u0646\u062F"
  ]
};
var dayValues2 = {
  narrow: ["\u06CC", "\u062F", "\u0633", "\u0686", "\u067E", "\u062C", "\u0634"],
  short: ["1\u0634", "2\u0634", "3\u0634", "4\u0634", "5\u0634", "\u062C", "\u0634"],
  abbreviated: [
    "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647",
    "\u062F\u0648\u0634\u0646\u0628\u0647",
    "\u0633\u0647\u200C\u0634\u0646\u0628\u0647",
    "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647",
    "\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647",
    "\u062C\u0645\u0639\u0647",
    "\u0634\u0646\u0628\u0647"
  ],
  wide: [
    "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647",
    "\u062F\u0648\u0634\u0646\u0628\u0647",
    "\u0633\u0647\u200C\u0634\u0646\u0628\u0647",
    "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647",
    "\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647",
    "\u062C\u0645\u0639\u0647",
    "\u0634\u0646\u0628\u0647"
  ]
};
var dayPeriodValues2 = {
  narrow: {
    am: "\u0642",
    pm: "\u0628",
    midnight: "\u0646",
    noon: "\u0638",
    morning: "\u0635",
    afternoon: "\u0628.\u0638.",
    evening: "\u0639",
    night: "\u0634"
  },
  abbreviated: {
    am: "\u0642.\u0638.",
    pm: "\u0628.\u0638.",
    midnight: "\u0646\u06CC\u0645\u0647\u200C\u0634\u0628",
    noon: "\u0638\u0647\u0631",
    morning: "\u0635\u0628\u062D",
    afternoon: "\u0628\u0639\u062F\u0627\u0632\u0638\u0647\u0631",
    evening: "\u0639\u0635\u0631",
    night: "\u0634\u0628"
  },
  wide: {
    am: "\u0642\u0628\u0644\u200C\u0627\u0632\u0638\u0647\u0631",
    pm: "\u0628\u0639\u062F\u0627\u0632\u0638\u0647\u0631",
    midnight: "\u0646\u06CC\u0645\u0647\u200C\u0634\u0628",
    noon: "\u0638\u0647\u0631",
    morning: "\u0635\u0628\u062D",
    afternoon: "\u0628\u0639\u062F\u0627\u0632\u0638\u0647\u0631",
    evening: "\u0639\u0635\u0631",
    night: "\u0634\u0628"
  }
};
var formattingDayPeriodValues2 = {
  narrow: {
    am: "\u0642",
    pm: "\u0628",
    midnight: "\u0646",
    noon: "\u0638",
    morning: "\u0635",
    afternoon: "\u0628.\u0638.",
    evening: "\u0639",
    night: "\u0634"
  },
  abbreviated: {
    am: "\u0642.\u0638.",
    pm: "\u0628.\u0638.",
    midnight: "\u0646\u06CC\u0645\u0647\u200C\u0634\u0628",
    noon: "\u0638\u0647\u0631",
    morning: "\u0635\u0628\u062D",
    afternoon: "\u0628\u0639\u062F\u0627\u0632\u0638\u0647\u0631",
    evening: "\u0639\u0635\u0631",
    night: "\u0634\u0628"
  },
  wide: {
    am: "\u0642\u0628\u0644\u200C\u0627\u0632\u0638\u0647\u0631",
    pm: "\u0628\u0639\u062F\u0627\u0632\u0638\u0647\u0631",
    midnight: "\u0646\u06CC\u0645\u0647\u200C\u0634\u0628",
    noon: "\u0638\u0647\u0631",
    morning: "\u0635\u0628\u062D",
    afternoon: "\u0628\u0639\u062F\u0627\u0632\u0638\u0647\u0631",
    evening: "\u0639\u0635\u0631",
    night: "\u0634\u0628"
  }
};
var ordinalNumber2 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + "-\u0627\u0645";
};
var localize2 = {
  ordinalNumber: ordinalNumber2,
  era: buildLocalizeFn2({
    values: eraValues2,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn2({
    values: quarterValues2,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn2({
    values: monthValues2,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn2({
    values: dayValues2,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn2({
    values: dayPeriodValues2,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues2,
    defaultFormattingWidth: "wide"
  })
};

// node_modules/date-fns-jalali/locale/_lib/buildMatchFn.js
function buildMatchFn2(args) {
  return (string, options = {}) => {
    const width = options.width;
    const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];
    const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    const key = Array.isArray(parsePatterns) ? findIndex2(parsePatterns, (pattern) => pattern.test(matchedString)) : (
      // [TODO] -- I challenge you to fix the type
      findKey2(parsePatterns, (pattern) => pattern.test(matchedString))
    );
    let value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      options.valueCallback(value)
    ) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
function findKey2(object, predicate) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex2(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}

// node_modules/date-fns-jalali/locale/_lib/buildMatchPatternFn.js
function buildMatchPatternFn2(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];
    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}

// node_modules/date-fns-jalali/locale/fa-IR/_lib/match.js
var matchOrdinalNumberPattern2 = /^(\d+)(-?ام)?/i;
var parseOrdinalNumberPattern2 = /\d+/i;
var matchEraPatterns2 = {
  narrow: /^(ق|ب)/i,
  abbreviated: /^(ق\.?\s?ه\.?|ب\.?\s?ه\.?|ه\.?)/i,
  wide: /^(قبل از هجرت|هجری شمسی|بعد از هجرت)/i
};
var parseEraPatterns2 = {
  any: [/^قبل/i, /^بعد/i]
};
var matchQuarterPatterns2 = {
  narrow: /^[1234]/i,
  abbreviated: /^(ف|Q|س‌م)[1234]/i,
  wide: /^(فصل|quarter|سه‌ماهه) [1234](-ام|ام)?/i
};
var parseQuarterPatterns2 = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns2 = {
  narrow: /^(فر|ار|خر|تی|مر|شه|مه|آب|آذ|دی|به|اس)/i,
  abbreviated: /^(فرو|ارد|خرد|تیر|مرد|شهر|مهر|آبا|آذر|دی|بهم|اسف)/i,
  wide: /^(فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند)/i
};
var parseMonthPatterns2 = {
  narrow: [
    /^فر/i,
    /^ار/i,
    /^خر/i,
    /^تی/i,
    /^مر/i,
    /^شه/i,
    /^مه/i,
    /^آب/i,
    /^آذ/i,
    /^دی/i,
    /^به/i,
    /^اس/i
  ],
  any: [
    /^فر/i,
    /^ار/i,
    /^خر/i,
    /^تی/i,
    /^مر/i,
    /^شه/i,
    /^مه/i,
    /^آب/i,
    /^آذ/i,
    /^دی/i,
    /^به/i,
    /^اس/i
  ]
};
var matchDayPatterns2 = {
  narrow: /^[شیدسچپج]/i,
  short: /^(ش|ج|1ش|2ش|3ش|4ش|5ش)/i,
  abbreviated: /^(یکشنبه|دوشنبه|سه‌شنبه|چهارشنبه|پنج‌شنبه|جمعه|شنبه)/i,
  wide: /^(یکشنبه|دوشنبه|سه‌شنبه|چهارشنبه|پنج‌شنبه|جمعه|شنبه)/i
};
var parseDayPatterns2 = {
  narrow: [/^ی/i, /^دو/i, /^س/i, /^چ/i, /^پ/i, /^ج/i, /^ش/i],
  any: [
    /^(ی|1ش|یکشنبه)/i,
    /^(د|2ش|دوشنبه)/i,
    /^(س|3ش|سه‌شنبه)/i,
    /^(چ|4ش|چهارشنبه)/i,
    /^(پ|5ش|پنجشنبه)/i,
    /^(ج|جمعه)/i,
    /^(ش|شنبه)/i
  ]
};
var matchDayPeriodPatterns2 = {
  narrow: /^(ب|ق|ن|ظ|ص|ب.ظ.|ع|ش)/i,
  any: /^(ق.ظ.|ب.ظ.|قبل‌ازظهر|نیمه‌شب|ظهر|صبح|بعدازظهر|عصر|شب)/i
};
var parseDayPeriodPatterns2 = {
  any: {
    am: /^(ق|ق.ظ.|قبل‌ازظهر)/i,
    pm: /^(ب|ب.ظ.|بعدازظهر)/i,
    midnight: /^(‌نیمه‌شب|ن)/i,
    noon: /^(ظ|ظهر)/i,
    morning: /^(ص|صبح)/i,
    afternoon: /^(ب|ب.ظ.|بعدازظهر)/i,
    evening: /^(ع|عصر)/i,
    night: /^(ش|شب)/i
  }
};
var match2 = {
  ordinalNumber: buildMatchPatternFn2({
    matchPattern: matchOrdinalNumberPattern2,
    parsePattern: parseOrdinalNumberPattern2,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn2({
    matchPatterns: matchEraPatterns2,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns2,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn2({
    matchPatterns: matchQuarterPatterns2,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns2,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn2({
    matchPatterns: matchMonthPatterns2,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns2,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn2({
    matchPatterns: matchDayPatterns2,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns2,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn2({
    matchPatterns: matchDayPeriodPatterns2,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns2,
    defaultParseWidth: "any"
  })
};

// node_modules/date-fns-jalali/locale/fa-IR.js
var faIR = {
  code: "fa-IR",
  formatDistance: formatDistance2,
  formatLong: formatLong2,
  formatRelative: formatRelative2,
  localize: localize2,
  match: match2,
  options: {
    weekStartsOn: 6,
    firstWeekContainsDate: 1
  }
};

// node_modules/date-fns-jalali/getDayOfYear.js
function getDayOfYear2(date, options) {
  const _date = toDate2(date, options?.in);
  const diff = differenceInCalendarDays2(_date, startOfYear2(_date));
  const dayOfYear = diff + 1;
  return dayOfYear;
}

// node_modules/date-fns-jalali/getISOWeek.js
function getISOWeek2(date, options) {
  const _date = toDate2(date, options?.in);
  const diff = +startOfISOWeek2(_date) - +startOfISOWeekYear2(_date);
  return Math.round(diff / millisecondsInWeek2) + 1;
}

// node_modules/date-fns-jalali/getWeekYear.js
function getWeekYear2(date, options) {
  const _date = toDate2(date, options?.in);
  const year = getFullYear(_date);
  const defaultOptions3 = getDefaultOptions2();
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions3.firstWeekContainsDate ?? defaultOptions3.locale?.options?.firstWeekContainsDate ?? 1;
  const firstWeekOfNextYear = constructFrom2(options?.in || date, 0);
  setFullYear(firstWeekOfNextYear, year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfWeek2(firstWeekOfNextYear, options);
  const firstWeekOfThisYear = constructFrom2(options?.in || date, 0);
  setFullYear(firstWeekOfThisYear, year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfWeek2(firstWeekOfThisYear, options);
  if (+_date >= +startOfNextYear) {
    return year + 1;
  } else if (+_date >= +startOfThisYear) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns-jalali/startOfWeekYear.js
function startOfWeekYear2(date, options) {
  const defaultOptions3 = getDefaultOptions2();
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions3.firstWeekContainsDate ?? defaultOptions3.locale?.options?.firstWeekContainsDate ?? 1;
  const year = getWeekYear2(date, options);
  const firstWeek = constructFrom2(options?.in || date, 0);
  setFullYear(firstWeek, year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  const _date = startOfWeek2(firstWeek, options);
  return _date;
}

// node_modules/date-fns-jalali/getWeek.js
function getWeek2(date, options) {
  const _date = toDate2(date, options?.in);
  const diff = +startOfWeek2(_date, options) - +startOfWeekYear2(_date, options);
  return Math.round(diff / millisecondsInWeek2) + 1;
}

// node_modules/date-fns-jalali/_lib/addLeadingZeros.js
function addLeadingZeros2(number, targetLength) {
  const sign = number < 0 ? "-" : "";
  const output = Math.abs(number).toString().padStart(targetLength, "0");
  return sign + output;
}

// node_modules/date-fns-jalali/_lib/format/lightFormatters.js
var lightFormatters2 = {
  // Year
  y(date, token) {
    const signedYear = getFullYear(date);
    const year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros2(token === "yy" ? year % 100 : year, token.length);
  },
  // Month
  M(date, token) {
    const month = getMonth2(date);
    return token === "M" ? String(month + 1) : addLeadingZeros2(month + 1, 2);
  },
  // Day of the month
  d(date, token) {
    return addLeadingZeros2(getDate2(date), token.length);
  },
  // AM or PM
  a(date, token) {
    const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return dayPeriodEnumValue.toUpperCase();
      case "aaa":
        return dayPeriodEnumValue;
      case "aaaaa":
        return dayPeriodEnumValue[0];
      case "aaaa":
      default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(date, token) {
    return addLeadingZeros2(date.getHours() % 12 || 12, token.length);
  },
  // Hour [0-23]
  H(date, token) {
    return addLeadingZeros2(date.getHours(), token.length);
  },
  // Minute
  m(date, token) {
    return addLeadingZeros2(date.getMinutes(), token.length);
  },
  // Second
  s(date, token) {
    return addLeadingZeros2(date.getSeconds(), token.length);
  },
  // Fraction of second
  S(date, token) {
    const numberOfDigits = token.length;
    const milliseconds = date.getMilliseconds();
    const fractionalSeconds = Math.trunc(
      milliseconds * Math.pow(10, numberOfDigits - 3)
    );
    return addLeadingZeros2(fractionalSeconds, token.length);
  }
};

// node_modules/date-fns-jalali/_lib/format/formatters.js
var dayPeriodEnum2 = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
};
var formatters2 = {
  // Era
  G: function(date, token, localize3) {
    const era = getFullYear(date) > 0 ? 1 : 0;
    switch (token) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return localize3.era(era, { width: "abbreviated" });
      // A, B
      case "GGGGG":
        return localize3.era(era, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return localize3.era(era, { width: "wide" });
    }
  },
  // Year
  y: function(date, token, localize3) {
    if (token === "yo") {
      const signedYear = getFullYear(date);
      const year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize3.ordinalNumber(year, { unit: "year" });
    }
    return lightFormatters2.y(date, token);
  },
  // Local week-numbering year
  Y: function(date, token, localize3, options) {
    const signedWeekYear = getWeekYear2(date, options);
    const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
    if (token === "YY") {
      const twoDigitYear = weekYear % 100;
      return addLeadingZeros2(twoDigitYear, 2);
    }
    if (token === "Yo") {
      return localize3.ordinalNumber(weekYear, { unit: "year" });
    }
    return addLeadingZeros2(weekYear, token.length);
  },
  // ISO week-numbering year
  R: function(date, token) {
    const isoWeekYear = getISOWeekYear2(date);
    return addLeadingZeros2(isoWeekYear, token.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(date, token) {
    const year = getFullYear(date);
    return addLeadingZeros2(year, token.length);
  },
  // Quarter
  Q: function(date, token, localize3) {
    const quarter = Math.ceil((getMonth2(date) + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "Q":
        return String(quarter);
      // 01, 02, 03, 04
      case "QQ":
        return addLeadingZeros2(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return localize3.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return localize3.quarter(quarter, {
          width: "abbreviated",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return localize3.quarter(quarter, {
          width: "narrow",
          context: "formatting"
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return localize3.quarter(quarter, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(date, token, localize3) {
    const quarter = Math.ceil((getMonth2(date) + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "q":
        return String(quarter);
      // 01, 02, 03, 04
      case "qq":
        return addLeadingZeros2(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return localize3.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return localize3.quarter(quarter, {
          width: "abbreviated",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return localize3.quarter(quarter, {
          width: "narrow",
          context: "standalone"
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return localize3.quarter(quarter, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(date, token, localize3) {
    const month = getMonth2(date);
    switch (token) {
      case "M":
      case "MM":
        return lightFormatters2.M(date, token);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return localize3.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "MMM":
        return localize3.month(month, {
          width: "abbreviated",
          context: "formatting"
        });
      // J, F, ..., D
      case "MMMMM":
        return localize3.month(month, {
          width: "narrow",
          context: "formatting"
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return localize3.month(month, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(date, token, localize3) {
    const month = getMonth2(date);
    switch (token) {
      // 1, 2, ..., 12
      case "L":
        return String(month + 1);
      // 01, 02, ..., 12
      case "LL":
        return addLeadingZeros2(month + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return localize3.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "LLL":
        return localize3.month(month, {
          width: "abbreviated",
          context: "standalone"
        });
      // J, F, ..., D
      case "LLLLL":
        return localize3.month(month, {
          width: "narrow",
          context: "standalone"
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return localize3.month(month, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(date, token, localize3, options) {
    const week = getWeek2(date, options);
    if (token === "wo") {
      return localize3.ordinalNumber(week, { unit: "week" });
    }
    return addLeadingZeros2(week, token.length);
  },
  // ISO week of year
  I: function(date, token, localize3) {
    const isoWeek = getISOWeek2(date);
    if (token === "Io") {
      return localize3.ordinalNumber(isoWeek, { unit: "week" });
    }
    return addLeadingZeros2(isoWeek, token.length);
  },
  // Day of the month
  d: function(date, token, localize3) {
    if (token === "do") {
      return localize3.ordinalNumber(getDate2(date), { unit: "date" });
    }
    return lightFormatters2.d(date, token);
  },
  // Day of year
  D: function(date, token, localize3) {
    const dayOfYear = getDayOfYear2(date);
    if (token === "Do") {
      return localize3.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
    }
    return addLeadingZeros2(dayOfYear, token.length);
  },
  // Day of week
  E: function(date, token, localize3) {
    const dayOfWeek = date.getDay();
    switch (token) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return localize3.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "EEEEE":
        return localize3.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return localize3.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "EEEE":
      default:
        return localize3.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(date, token, localize3, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(localDayOfWeek);
      // Padded numerical value
      case "ee":
        return addLeadingZeros2(localDayOfWeek, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return localize3.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "eee":
        return localize3.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "eeeee":
        return localize3.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return localize3.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "eeee":
      default:
        return localize3.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(date, token, localize3, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (same as in `e`)
      case "c":
        return String(localDayOfWeek);
      // Padded numerical value
      case "cc":
        return addLeadingZeros2(localDayOfWeek, token.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return localize3.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "ccc":
        return localize3.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone"
        });
      // T
      case "ccccc":
        return localize3.day(dayOfWeek, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return localize3.day(dayOfWeek, {
          width: "short",
          context: "standalone"
        });
      // Tuesday
      case "cccc":
      default:
        return localize3.day(dayOfWeek, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(date, token, localize3) {
    const dayOfWeek = date.getDay();
    const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      // 2
      case "i":
        return String(isoDayOfWeek);
      // 02
      case "ii":
        return addLeadingZeros2(isoDayOfWeek, token.length);
      // 2nd
      case "io":
        return localize3.ordinalNumber(isoDayOfWeek, { unit: "day" });
      // Tue
      case "iii":
        return localize3.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "iiiii":
        return localize3.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "iiiiii":
        return localize3.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "iiii":
      default:
        return localize3.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(date, token, localize3) {
    const hours = date.getHours();
    const dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(date, token, localize3) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum2.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum2.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    }
    switch (token) {
      case "b":
      case "bb":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(date, token, localize3) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum2.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum2.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum2.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum2.night;
    }
    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return localize3.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(date, token, localize3) {
    if (token === "ho") {
      let hours = date.getHours() % 12;
      if (hours === 0) hours = 12;
      return localize3.ordinalNumber(hours, { unit: "hour" });
    }
    return lightFormatters2.h(date, token);
  },
  // Hour [0-23]
  H: function(date, token, localize3) {
    if (token === "Ho") {
      return localize3.ordinalNumber(date.getHours(), { unit: "hour" });
    }
    return lightFormatters2.H(date, token);
  },
  // Hour [0-11]
  K: function(date, token, localize3) {
    const hours = date.getHours() % 12;
    if (token === "Ko") {
      return localize3.ordinalNumber(hours, { unit: "hour" });
    }
    return addLeadingZeros2(hours, token.length);
  },
  // Hour [1-24]
  k: function(date, token, localize3) {
    let hours = date.getHours();
    if (hours === 0) hours = 24;
    if (token === "ko") {
      return localize3.ordinalNumber(hours, { unit: "hour" });
    }
    return addLeadingZeros2(hours, token.length);
  },
  // Minute
  m: function(date, token, localize3) {
    if (token === "mo") {
      return localize3.ordinalNumber(date.getMinutes(), { unit: "minute" });
    }
    return lightFormatters2.m(date, token);
  },
  // Second
  s: function(date, token, localize3) {
    if (token === "so") {
      return localize3.ordinalNumber(date.getSeconds(), { unit: "second" });
    }
    return lightFormatters2.s(date, token);
  },
  // Fraction of second
  S: function(date, token) {
    return lightFormatters2.S(date, token);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    if (timezoneOffset === 0) {
      return "Z";
    }
    switch (token) {
      // Hours and optional minutes
      case "X":
        return formatTimezoneWithOptionalMinutes2(timezoneOffset);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return formatTimezone2(timezoneOffset);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case "XXXXX":
      case "XXX":
      // Hours and minutes with `:` delimiter
      default:
        return formatTimezone2(timezoneOffset, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Hours and optional minutes
      case "x":
        return formatTimezoneWithOptionalMinutes2(timezoneOffset);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return formatTimezone2(timezoneOffset);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case "xxxxx":
      case "xxx":
      // Hours and minutes with `:` delimiter
      default:
        return formatTimezone2(timezoneOffset, ":");
    }
  },
  // Timezone (GMT)
  O: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + formatTimezoneShort2(timezoneOffset, ":");
      // Long
      case "OOOO":
      default:
        return "GMT" + formatTimezone2(timezoneOffset, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + formatTimezoneShort2(timezoneOffset, ":");
      // Long
      case "zzzz":
      default:
        return "GMT" + formatTimezone2(timezoneOffset, ":");
    }
  },
  // Seconds timestamp
  t: function(date, token, _localize) {
    const timestamp = Math.trunc(+date / 1e3);
    return addLeadingZeros2(timestamp, token.length);
  },
  // Milliseconds timestamp
  T: function(date, token, _localize) {
    return addLeadingZeros2(+date, token.length);
  }
};
function formatTimezoneShort2(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = Math.trunc(absOffset / 60);
  const minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  return sign + String(hours) + delimiter + addLeadingZeros2(minutes, 2);
}
function formatTimezoneWithOptionalMinutes2(offset, delimiter) {
  if (offset % 60 === 0) {
    const sign = offset > 0 ? "-" : "+";
    return sign + addLeadingZeros2(Math.abs(offset) / 60, 2);
  }
  return formatTimezone2(offset, delimiter);
}
function formatTimezone2(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = addLeadingZeros2(Math.trunc(absOffset / 60), 2);
  const minutes = addLeadingZeros2(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}

// node_modules/date-fns-jalali/_lib/format/longFormatters.js
var dateLongFormatter2 = (pattern, formatLong3) => {
  switch (pattern) {
    case "P":
      return formatLong3.date({ width: "short" });
    case "PP":
      return formatLong3.date({ width: "medium" });
    case "PPP":
      return formatLong3.date({ width: "long" });
    case "PPPP":
    default:
      return formatLong3.date({ width: "full" });
  }
};
var timeLongFormatter2 = (pattern, formatLong3) => {
  switch (pattern) {
    case "p":
      return formatLong3.time({ width: "short" });
    case "pp":
      return formatLong3.time({ width: "medium" });
    case "ppp":
      return formatLong3.time({ width: "long" });
    case "pppp":
    default:
      return formatLong3.time({ width: "full" });
  }
};
var dateTimeLongFormatter2 = (pattern, formatLong3) => {
  const matchResult = pattern.match(/(P+)(p+)?/) || [];
  const datePattern = matchResult[1];
  const timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter2(pattern, formatLong3);
  }
  let dateTimeFormat;
  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong3.dateTime({ width: "short" });
      break;
    case "PP":
      dateTimeFormat = formatLong3.dateTime({ width: "medium" });
      break;
    case "PPP":
      dateTimeFormat = formatLong3.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong3.dateTime({ width: "full" });
      break;
  }
  return dateTimeFormat.replace("{{date}}", dateLongFormatter2(datePattern, formatLong3)).replace("{{time}}", timeLongFormatter2(timePattern, formatLong3));
};
var longFormatters2 = {
  p: timeLongFormatter2,
  P: dateTimeLongFormatter2
};

// node_modules/date-fns-jalali/_lib/protectedTokens.js
var dayOfYearTokenRE2 = /^D+$/;
var weekYearTokenRE2 = /^Y+$/;
var throwTokens2 = ["D", "DD", "YY", "YYYY"];
function isProtectedDayOfYearToken2(token) {
  return dayOfYearTokenRE2.test(token);
}
function isProtectedWeekYearToken2(token) {
  return weekYearTokenRE2.test(token);
}
function warnOrThrowProtectedError2(token, format3, input) {
  const _message = message2(token, format3, input);
  console.warn(_message);
  if (throwTokens2.includes(token)) throw new RangeError(_message);
}
function message2(token, format3, input) {
  const subject = token[0] === "Y" ? "years" : "days of the month";
  return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format3}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}

// node_modules/date-fns-jalali/format.js
var formattingTokensRegExp2 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp2 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp2 = /^'([^]*?)'?$/;
var doubleQuoteRegExp2 = /''/g;
var unescapedLatinCharacterRegExp2 = /[a-zA-Z]/;
function format2(date, formatStr, options) {
  const defaultOptions3 = getDefaultOptions2();
  const locale = options?.locale ?? defaultOptions3.locale ?? faIR;
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions3.firstWeekContainsDate ?? defaultOptions3.locale?.options?.firstWeekContainsDate ?? 1;
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions3.weekStartsOn ?? defaultOptions3.locale?.options?.weekStartsOn ?? 6;
  const originalDate = toDate2(date, options?.in);
  if (!isValid2(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  let parts = formatStr.match(longFormattingTokensRegExp2).map((substring) => {
    const firstCharacter = substring[0];
    if (firstCharacter === "p" || firstCharacter === "P") {
      const longFormatter = longFormatters2[firstCharacter];
      return longFormatter(substring, locale.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp2).map((substring) => {
    if (substring === "''") {
      return { isToken: false, value: "'" };
    }
    const firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return { isToken: false, value: cleanEscapedString2(substring) };
    }
    if (formatters2[firstCharacter]) {
      return { isToken: true, value: substring };
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp2)) {
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + firstCharacter + "`"
      );
    }
    return { isToken: false, value: substring };
  });
  if (locale.localize.preprocessor) {
    parts = locale.localize.preprocessor(originalDate, parts);
  }
  const formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale
  };
  return parts.map((part) => {
    if (!part.isToken) return part.value;
    const token = part.value;
    if (!options?.useAdditionalWeekYearTokens && isProtectedWeekYearToken2(token) || !options?.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken2(token)) {
      warnOrThrowProtectedError2(token, formatStr, String(date));
    }
    const formatter = formatters2[token[0]];
    return formatter(originalDate, token, locale.localize, formatterOptions);
  }).join("");
}
function cleanEscapedString2(input) {
  const matched = input.match(escapedStringRegExp2);
  if (!matched) {
    return input;
  }
  return matched[1].replace(doubleQuoteRegExp2, "'");
}

// node_modules/date-fns-jalali/getDate.js
function getDate3(date, options) {
  return getDate2(toDate2(date, options?.in));
}

// node_modules/date-fns-jalali/getDaysInMonth.js
function getDaysInMonth2(date, options) {
  const _date = toDate2(date, options?.in);
  const year = getFullYear(_date);
  const monthIndex = getMonth2(_date);
  const lastDayOfMonth = constructFrom2(_date, 0);
  setFullYear(lastDayOfMonth, year, monthIndex + 1, 0);
  lastDayOfMonth.setHours(0, 0, 0, 0);
  return getDate2(lastDayOfMonth);
}

// node_modules/date-fns-jalali/getMonth.js
function getMonth3(date, options) {
  return getMonth2(toDate2(date, options?.in));
}

// node_modules/date-fns-jalali/getYear.js
function getYear2(date, options) {
  return getFullYear(toDate2(date, options?.in));
}

// node_modules/date-fns-jalali/newDate.js
function newDate2(year, monthIndex, date, hours = 0, minutes = 0, seconds = 0, ms = 0) {
  return newDate(year, monthIndex, date, hours, minutes, seconds, ms);
}

// src/MobileDatePicker.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var JALALI_MONTHS = ["\u0641\u0631\u0648\u0631\u062F\u06CC\u0646", "\u0627\u0631\u062F\u06CC\u0628\u0647\u0634\u062A", "\u062E\u0631\u062F\u0627\u062F", "\u062A\u06CC\u0631", "\u0645\u0631\u062F\u0627\u062F", "\u0634\u0647\u0631\u06CC\u0648\u0631", "\u0645\u0647\u0631", "\u0622\u0628\u0627\u0646", "\u0622\u0630\u0631", "\u062F\u06CC", "\u0628\u0647\u0645\u0646", "\u0627\u0633\u0641\u0646\u062F"];
var GREGORIAN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var ITEM_HEIGHT = 45;
var DaliryMobileDatePicker = ({
  onDateChange,
  isBirthdate = false,
  isGregorian = false,
  backgroundColor = "#f5f5f5",
  textColor = "#bbb",
  selectedColor = "#333",
  value
}) => {
  const now = useMemo(() => /* @__PURE__ */ new Date(), []);
  const parseValue = (input) => {
    if (!input) return null;
    if (input instanceof Date) {
      return isNaN(input.getTime()) ? null : input;
    }
    if (isGregorian) {
      const gDate = new Date(input);
      return isNaN(gDate.getTime()) ? null : gDate;
    }
    const normalized = input.replaceAll("-", "/");
    const parts = normalized.split("/").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    const [year, month, day] = parts;
    const jDate = newDate2(year, month - 1, day);
    return isNaN(jDate.getTime()) ? null : jDate;
  };
  const parsedValue = useMemo(() => parseValue(value), [value, isGregorian]);
  const baseDate = useMemo(() => {
    if (parsedValue) return parsedValue;
    if (isBirthdate) {
      if (isGregorian) {
        const birthDate = new Date(now);
        birthDate.setFullYear(birthDate.getFullYear() - 18);
        return birthDate;
      }
      return newDate2(
        getYear2(now) - 18,
        getMonth3(now),
        getDate3(now)
      );
    }
    return now;
  }, [parsedValue, isBirthdate, isGregorian, now]);
  const initialYear = useMemo(() => {
    return isGregorian ? getYear(baseDate) : getYear2(baseDate);
  }, [isGregorian, baseDate]);
  const initialMonth = useMemo(() => {
    return isGregorian ? getMonth(baseDate) + 1 : getMonth3(baseDate) + 1;
  }, [isGregorian, baseDate]);
  const initialDay = useMemo(() => {
    return isGregorian ? getDate(baseDate) : getDate3(baseDate);
  }, [isGregorian, baseDate]);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = useRef(null);
  const months = isGregorian ? GREGORIAN_MONTHS : JALALI_MONTHS;
  const years = useMemo(() => {
    const start = isGregorian ? 1930 : 1300;
    const end = (isGregorian ? getYear(now) : getYear2(now)) + 20;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [isGregorian, now]);
  const daysInMonth = useMemo(() => {
    if (isGregorian) {
      return getDaysInMonth(new Date(selectedYear, selectedMonth - 1, 1));
    }
    return getDaysInMonth2(newDate2(selectedYear, selectedMonth - 1, 1));
  }, [isGregorian, selectedYear, selectedMonth]);
  const days = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);
  useEffect(() => {
    setSelectedYear(initialYear);
    setSelectedMonth(initialMonth);
    setSelectedDay(initialDay);
  }, [initialYear, initialMonth, initialDay]);
  useEffect(() => {
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedDay, daysInMonth]);
  const buildDateObject = (year, month, day) => {
    const m = isGregorian ? new Date(year, month - 1, day) : newDate2(year, month - 1, day);
    return {
      year,
      month,
      day,
      formatted: isGregorian ? format(m, "yyyy/MM/dd") : format2(m, "yyyy/MM/dd"),
      date: format(m, "yyyy-MM-dd"),
      gDate: format(m, "yyyy-MM-dd"),
      dateObj: m
    };
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      onDateChange(buildDateObject(selectedYear, selectedMonth, selectedDay));
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedYear, selectedMonth, selectedDay, isGregorian]);
  const scrollToIndex = (ref, index) => {
    if (ref.current) {
      ref.current.scrollTop = index * ITEM_HEIGHT;
    }
  };
  useEffect(() => {
    const monthIndex = Math.max(0, selectedMonth - 1);
    const dayIndex = Math.max(0, selectedDay - 1);
    const yearIndex = Math.max(0, years.indexOf(selectedYear));
    const timer = window.setTimeout(() => {
      scrollToIndex(dayRef, dayIndex);
      scrollToIndex(monthRef, monthIndex);
      scrollToIndex(yearRef, yearIndex);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [years, selectedYear, selectedMonth, selectedDay]);
  const handleScroll = (e, type) => {
    const index = Math.round(e.currentTarget.scrollTop / ITEM_HEIGHT);
    if (type === "day") {
      const nextDay = days[index];
      if (nextDay && nextDay !== selectedDay) setSelectedDay(nextDay);
    } else if (type === "month") {
      const nextMonth = index + 1;
      if (nextMonth >= 1 && nextMonth <= 12 && nextMonth !== selectedMonth) setSelectedMonth(nextMonth);
    } else {
      const nextYear = years[index];
      if (nextYear && nextYear !== selectedYear) setSelectedYear(nextYear);
    }
  };
  const renderList = (items, selectedValue, ref, type) => {
    return /* @__PURE__ */ jsxs("div", { className: "scroll-list", onScroll: (e) => handleScroll(e, type), ref, children: [
      /* @__PURE__ */ jsx("div", { style: { height: ITEM_HEIGHT } }),
      items.map((item, index) => {
        const isSelected = type === "month" ? index + 1 === selectedMonth : item === selectedValue;
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: `scroll-item ${isSelected ? "selected" : ""}`,
            style: { color: isSelected ? selectedColor : textColor },
            children: item
          },
          `${type}-${item}`
        );
      }),
      /* @__PURE__ */ jsx("div", { style: { height: ITEM_HEIGHT } })
    ] });
  };
  return /* @__PURE__ */ jsx("div", { className: "datepicker-container", children: /* @__PURE__ */ jsxs("div", { className: "scroll-lists", style: { backgroundColor }, children: [
    renderList(days, selectedDay, dayRef, "day"),
    renderList(months, months[selectedMonth - 1], monthRef, "month"),
    renderList(years, selectedYear, yearRef, "year"),
    /* @__PURE__ */ jsx("div", { className: "selection-highlight", style: { top: ITEM_HEIGHT, height: ITEM_HEIGHT } })
  ] }) });
};
var MobileDatePicker_default = DaliryMobileDatePicker;
export {
  MobileDatePicker_default as default
};

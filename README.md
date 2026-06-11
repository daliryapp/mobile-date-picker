# 📅 Daliry Mobile Date Picker – React 19 Mobile Date Picker with Jalali & Gregorian Support

**Daliry Mobile Date Picker** is a mobile-friendly and fully customizable date picker component for **React 19** that supports both **Jalali (Shamsi)** and **Gregorian** calendars.  
Perfect for **mobile apps**, **birthdate pickers**, and any React project that needs a clean, touch-optimized date selection experience.

![Daliry Mobile Date Picker Screenshot](https://github.com/daliryapp/mobile-date-picker/blob/master/src/assets/images/daliry-mobile-date-picker102.PNG?raw=true)

---

## 💖 Support

If you were thinking about donating, the best way to support me for now is to **follow me on GitHub** and **star this project**.  
It really helps me keep building and improving open-source components.

👉 [Follow me on GitHub](https://github.com/daliryapp)

---
## 🧠 Why Daliry?

If you're searching for a **mobile date picker for React** with **Jalali (Shamsi)** support, **Daliry Mobile Date Picker** is built exactly for that:

- Supports **React 19**
- Dual calendar: **Jalali (Persian)** and **Gregorian**
- Ideal for **mobile UX**
- Easy to plug into any **React project**
- Returns both formatted and raw date values
- Compatible with **Moment.js** for easy integration
- Uses **debounced** `onDateChange` calls for smoother performance
- No need for an extra **Apply** button

---

## ✨ Key Features

- 📆 Dual calendar support: Jalali (Shamsi) and Gregorian
- ⚛️ Built for **React 19**
- 📱 Touch-optimized for mobile and tablet
- ♻️ Reusable, lightweight React component
- 🔧 Minimal setup, easy customization
- ⚡ Debounced date change callback after user stops scrolling
- 🎂 Smart birthdate mode with default value set to **18 years ago**
- 📤 Output includes full date breakdown in multiple formats

---

## 📦 Installation

Install the date picker via npm or yarn:
```bash
npm install daliry-mobile-date-picker

or

bash
yarn add daliry-mobile-date-picker

---

## ✨ Usage

tsx
import MobileDatePicker from "daliry-mobile-date-picker";
import "daliry-mobile-date-picker/dist/index.css";

<MobileDatePicker
  onDateChange={(value) => {
console.log(value);
  }}
  isBirthdate={true}
  isGregorian={false}
/>

---

## 🛠 Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onDateChange` | `(date: IDate) => void` | Yes | - | Called after the user finishes changing the date |
| `isBirthdate` | `boolean` | No | `false` | If true, default date is set to 18 years ago |
| `isGregorian` | `boolean` | No | `false` | Switches calendar mode to Gregorian |
| `backgroundColor` | `string` | No | `#f5f5f5` | Background color of picker |
| `textColor` | `string` | No | `#bbb` | Color of non-selected items |
| `selectedColor` | `string` | No | `#333` | Color of selected item |

---

## ⚡ Debounced Date Change

This component no longer needs an "Apply" button.

When the user scrolls and changes the date, `onDateChange` is called automatically with a small **debounce delay** after scrolling stops. This helps prevent multiple unnecessary callback executions during fast scrolling and improves mobile performance.

---

## 📤 Output Format

ts
{
  year: 1403,
  month: 3,
  day: 21,
  formatted: "1403/03/21",
  date: "2024-06-10",
  gDate: "2024-06-10",
  moment: Moment
}

---

## 📘 Output Fields

- `year`: selected year
- `month`: selected month
- `day`: selected day
- `formatted`: formatted date based on selected calendar
- `date`: Gregorian date in `YYYY-MM-DD`
- `gDate`: Gregorian date in `YYYY-MM-DD`
- `moment`: Moment object for advanced usage

---

## ✅ Notes

- Supports both **Jalali** and **Gregorian** calendars
- CSS file should also be included:
  
tsx
import "daliry-mobile-date-picker/dist/index.css";

- Designed for a smooth mobile scrolling experience
- Optimized selected-item animation behavior for better visual stability

---

## 📜 License

MIT

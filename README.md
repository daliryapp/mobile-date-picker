# 📅 Daliry Mobile Date Picker – React Mobile Date Picker with Jalali & Gregorian Support

**Daliry Mobile Date Picker** is a mobile-friendly and fully customizable date picker component for **React** that supports both **Jalali (Shamsi)** and **Gregorian** calendars.  
Perfect for **mobile apps**, **birthdate pickers**, and any React project that needs a clean, touch-optimized date selection experience.

![Daliry Mobile Date Picker Screenshot](https://raw.githubusercontent.com/daliryapp/mobile-date-picker/refs/heads/master/src/assets/images/daliry-mobile-date-picker.PNG)

---

## 🧠 Why Daliry?

If you're searching for a **mobile date picker for React** with **Jalali (Shamsi)** support, **Daliry Mobile Date Picker** is built exactly for that:

- Dual calendar: **Jalali (Persian)** and **Gregorian**
- Ideal for **mobile UX**
- Easy to plug into any **React project**
- Returns both **Persian** and **Gregorian** formatted dates
- Compatible with **Moment.js** format for integration ease

---

## ✨ Key Features

- 📆 Dual calendar support: Jalali (Shamsi) and Gregorian
- 📱 Touch-optimized for mobile and tablet
- ♻️ Reusable, lightweight React component
- 🔧 Minimal setup, easy customization
- 📤 Output includes full date breakdown in multiple formats

---

## 📦 Installation

Install the date picker via npm or yarn:

```bash
npm install daliry-mobile-date-picker
```
or
```bash
yarn add daliry-mobile-date-picker
```
## ✨ Usage
```
import MobileDatePicker from "daliry-mobile-date-picker";
import "daliry-mobile-date-picker/dist/index.css";
```
```
<MobileDatePicker
  onDateChange={(value) => {
    console.log(value);
  }}
  isBirthdate={true}
/>
```
## 📤 Output Format
```
{
  "jYear": 1389,
  "jMonth": 9,
  "jDay": 3,
  "jDate": "1389-9-3",         // Jalali formatted string
  "date": "2010-11-24",        // Gregorian formatted string (for display)
  "gDate": "2010-11-24",       // Gregorian string (redundant, for convenience)
  "moment": "2010-11-23T20:30:00.000Z" // ISO Moment.js format
}
```

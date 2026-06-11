import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment-jalaali";
import "./mobileDatePicker.css";
const JALALI_MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const GREGORIAN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ITEM_HEIGHT = 45;
const DaliryMobileDatePicker = ({ onDateChange, isBirthdate = false, isGregorian = false, backgroundColor = "#f5f5f5", textColor = "#bbb", selectedColor = "#333", }) => {
    const now = moment();
    const initialYear = useMemo(() => {
        const currentYear = isGregorian ? now.year() : now.jYear();
        return isBirthdate ? currentYear - 18 : currentYear;
    }, [isGregorian, isBirthdate]);
    const initialMonth = isGregorian ? now.month() + 1 : now.jMonth() + 1;
    const initialDay = isGregorian ? now.date() : now.jDate();
    const [selectedYear, setSelectedYear] = useState(initialYear);
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const [selectedDay, setSelectedDay] = useState(initialDay);
    const yearRef = useRef(null);
    const monthRef = useRef(null);
    const dayRef = useRef(null);
    const months = isGregorian ? GREGORIAN_MONTHS : JALALI_MONTHS;
    const years = useMemo(() => {
        const start = isGregorian ? 1930 : 1300;
        const end = (isGregorian ? now.year() : now.jYear()) + 20;
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [isGregorian, now]);
    const daysInMonth = useMemo(() => {
        if (isGregorian) {
            return moment(`${selectedYear}-${selectedMonth}-01`, "YYYY-M-DD").daysInMonth();
        }
        return moment.jDaysInMonth(selectedYear, selectedMonth - 1);
    }, [isGregorian, selectedYear, selectedMonth]);
    const days = useMemo(() => {
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }, [daysInMonth]);
    useEffect(() => {
        if (selectedDay > daysInMonth) {
            setSelectedDay(daysInMonth);
        }
    }, [selectedDay, daysInMonth]);
    const buildDateObject = (year, month, day) => {
        const m = isGregorian
            ? moment(`${year}-${month}-${day}`, "YYYY-M-D")
            : moment(`${year}-${month}-${day}`, "jYYYY-jM-jD");
        return {
            year,
            month,
            day,
            formatted: isGregorian ? m.format("YYYY/MM/DD") : m.format("jYYYY/jMM/jDD"),
            date: m.format("YYYY-MM-DD"),
            gDate: m.format("YYYY-MM-DD"),
            moment: m,
        };
    };
    // پیاده‌سازی Debounce برای ارسال تاریخ
    useEffect(() => {
        const timer = setTimeout(() => {
            onDateChange(buildDateObject(selectedYear, selectedMonth, selectedDay));
        }, 500); // ۵۰۰ میلی‌ثانیه صبر بعد از آخرین تغییر
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
    }, [years]); // فقط وقتی لیست سال‌ها (تقویم) عوض شد ری‌اسکرول کن
    const handleScroll = (e, type) => {
        const index = Math.round(e.currentTarget.scrollTop / ITEM_HEIGHT);
        if (type === "day") {
            const nextDay = days[index];
            if (nextDay && nextDay !== selectedDay)
                setSelectedDay(nextDay);
        }
        else if (type === "month") {
            const nextMonth = index + 1;
            if (nextMonth >= 1 && nextMonth <= 12 && nextMonth !== selectedMonth)
                setSelectedMonth(nextMonth);
        }
        else {
            const nextYear = years[index];
            if (nextYear && nextYear !== selectedYear)
                setSelectedYear(nextYear);
        }
    };
    const renderList = (items, selectedValue, ref, type) => {
        return (_jsxs("div", { className: "scroll-list", onScroll: (e) => handleScroll(e, type), ref: ref, children: [_jsx("div", { style: { height: ITEM_HEIGHT } }), items.map((item, index) => {
                    const isSelected = type === "month" ? (index + 1) === selectedMonth : item === selectedValue;
                    return (_jsx("div", { className: `scroll-item ${isSelected ? "selected" : ""}`, style: { color: isSelected ? selectedColor : textColor }, children: item }, `${type}-${item}`));
                }), _jsx("div", { style: { height: ITEM_HEIGHT } })] }));
    };
    return (_jsx("div", { className: "datepicker-container", children: _jsxs("div", { className: "scroll-lists", style: { backgroundColor }, children: [renderList(days, selectedDay, dayRef, "day"), renderList(months, months[selectedMonth - 1], monthRef, "month"), renderList(years, selectedYear, yearRef, "year"), _jsx("div", { className: "selection-highlight", style: { top: ITEM_HEIGHT, height: ITEM_HEIGHT } })] }) }));
};
export default DaliryMobileDatePicker;

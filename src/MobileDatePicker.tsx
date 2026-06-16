import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject, UIEvent } from "react";
import {
    getYear,
    getMonth,
    getDate,
    getDaysInMonth,
    format as formatGregorian
} from 'date-fns';

import {
    getYear as getJalaliYear,
    getMonth as getJalaliMonth,
    getDate as getJalaliDate,
    getDaysInMonth as getJalaliDaysInMonth,
    newDate,
    format as formatJalali,
} from 'date-fns-jalali';
import "./mobileDatePicker.css";

export interface IDate {
    year: number;
    month: number;
    day: number;
    formatted: string;
    date: string;
    gDate: string;
    dateObj: Date;
}

interface IMobileDatePicker {
    onDateChange: (date: IDate) => void;
    isBirthdate?: boolean;
    isGregorian?: boolean;
    backgroundColor?: string;
    textColor?: string;
    selectedColor?: string;
    value?: Date | string;
}

const JALALI_MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const GREGORIAN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const ITEM_HEIGHT = 45;

const DaliryMobileDatePicker = ({
                                    onDateChange,
                                    isBirthdate = false,
                                    isGregorian = false,
                                    backgroundColor = "#f5f5f5",
                                    textColor = "#bbb",
                                    selectedColor = "#333",
                                    value,
                                }: IMobileDatePicker) => {
    const now = useMemo(() => new Date(), []);

    const parseValue = (input?: Date | string): Date | null => {
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
        const jDate = newDate(year, month - 1, day);

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

            return newDate(
                getJalaliYear(now) - 18,
                getJalaliMonth(now),
                getJalaliDate(now)
            );
        }

        return now;
    }, [parsedValue, isBirthdate, isGregorian, now]);

    const initialYear = useMemo(() => {
        return isGregorian ? getYear(baseDate) : getJalaliYear(baseDate);
    }, [isGregorian, baseDate]);

    const initialMonth = useMemo(() => {
        return isGregorian ? getMonth(baseDate) + 1 : getJalaliMonth(baseDate) + 1;
    }, [isGregorian, baseDate]);

    const initialDay = useMemo(() => {
        return isGregorian ? getDate(baseDate) : getJalaliDate(baseDate);
    }, [isGregorian, baseDate]);

    const [selectedYear, setSelectedYear] = useState<number>(initialYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth);
    const [selectedDay, setSelectedDay] = useState<number>(initialDay);

    const yearRef = useRef<HTMLDivElement | null>(null);
    const monthRef = useRef<HTMLDivElement | null>(null);
    const dayRef = useRef<HTMLDivElement | null>(null);

    const months = isGregorian ? GREGORIAN_MONTHS : JALALI_MONTHS;

    const years = useMemo(() => {
        const start = isGregorian ? 1930 : 1300;
        const end = (isGregorian ? getYear(now) : getJalaliYear(now)) + 20;
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [isGregorian, now]);

    const daysInMonth = useMemo(() => {
        if (isGregorian) {
            return getDaysInMonth(new Date(selectedYear, selectedMonth - 1, 1));
        }
        return getJalaliDaysInMonth(newDate(selectedYear, selectedMonth - 1, 1));
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

    const buildDateObject = (year: number, month: number, day: number): IDate => {
        const m = isGregorian
            ? new Date(year, month - 1, day)
            : newDate(year, month - 1, day);

        return {
            year,
            month,
            day,
            formatted: isGregorian
                ? formatGregorian(m, 'yyyy/MM/dd')
                : formatJalali(m, 'yyyy/MM/dd'),
            date: formatGregorian(m, 'yyyy-MM-dd'),
            gDate: formatGregorian(m, 'yyyy-MM-dd'),
            dateObj: m,
        };
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            onDateChange(buildDateObject(selectedYear, selectedMonth, selectedDay));
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedYear, selectedMonth, selectedDay, isGregorian]);

    const scrollToIndex = (ref: RefObject<HTMLDivElement | null>, index: number) => {
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

    const handleScroll = (e: UIEvent<HTMLDivElement>, type: "day" | "month" | "year") => {
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

    const renderList = (
        items: Array<string | number>,
        selectedValue: string | number,
        ref: RefObject<HTMLDivElement | null>,
        type: "day" | "month" | "year"
    ) => {
        return (
            <div className="scroll-list" onScroll={(e) => handleScroll(e, type)} ref={ref}>
                <div style={{ height: ITEM_HEIGHT }} />
                {items.map((item, index) => {
                    const isSelected = type === "month" ? (index + 1) === selectedMonth : item === selectedValue;
                    return (
                        <div
                            key={`${type}-${item}`}
                            className={`scroll-item ${isSelected ? "selected" : ""}`}
                            style={{ color: isSelected ? selectedColor : textColor }}
                        >
                            {item}
                        </div>
                    );
                })}
                <div style={{ height: ITEM_HEIGHT }} />
            </div>
        );
    };

    return (
        <div className="datepicker-container">
            <div className="scroll-lists" style={{ backgroundColor }}>
                {renderList(days, selectedDay, dayRef, "day")}
                {renderList(months, months[selectedMonth - 1], monthRef, "month")}
                {renderList(years, selectedYear, yearRef, "year")}
                <div className="selection-highlight" style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT }} />
            </div>
        </div>
    );
};

export default DaliryMobileDatePicker;

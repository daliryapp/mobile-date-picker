import { useState, useRef, useEffect } from "react";
import moment, { Moment } from "moment-jalaali";
import "./mobileDatePicker.css";
// export * from '.';

export interface IDate {
    jYear: number;
    jMonth: number;
    jDay: number;
    jDate: string;
    date: string;
    gDate: string;
    moment: Moment;
}

interface IMobileDatePicker {
    onDateChange: (date: IDate) => void;
    isBirthdate?: boolean;
}

const jalaliMonths = [
    "", "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند", ""
];

const years = Array.from({ length: 1308 }, (_, i) => 1308 + i);
const days = Array.from({ length: 33 }, (_, i) => i);

const MobileDatePicker = ({ onDateChange, isBirthdate = false }: IMobileDatePicker) => {
    const today = moment();
    const [selectedYear, setSelectedYear] = useState(isBirthdate ? 1388 : today.jYear() - 1);
    const [selectedMonth, setSelectedMonth] = useState(isBirthdate ? 6 : today.jMonth());
    const [selectedDay, setSelectedDay] = useState(isBirthdate ? 2 : today.jDate() - 1);

    const listRef = useRef<HTMLDivElement>(null);
    const listRefMonths = useRef<HTMLDivElement>(null);
    const listRefDays = useRef<HTMLDivElement>(null);

    const selectDateFunction = () => {
        const gDate = moment(`${selectedYear}-${selectedMonth}-${selectedDay}`, "jYYYY-jMM-jDD").format("YYYY-MM-DD");
        onDateChange({
            jYear: selectedYear,
            jMonth: selectedMonth,
            jDay: selectedDay,
            jDate: `${selectedYear}-${selectedMonth}-${selectedDay}`,
            date: gDate,
            gDate,
            moment: moment(`${selectedYear}-${selectedMonth}-${selectedDay}`, "jYYYY-jMM-jDD"),
        });
    };

    useEffect(() => {
        if (isBirthdate) selectDateFunction();
    }, [selectedYear, selectedMonth, selectedDay]);

    useEffect(() => {
        listRef.current?.scrollTo({ top: years.indexOf(selectedYear) * 45, behavior: "smooth" });
        listRefMonths.current?.scrollTo({ top: selectedMonth * 45, behavior: "smooth" });
        listRefDays.current?.scrollTo({ top: selectedDay * 45, behavior: "smooth" });
    }, []);

    const handleScroll = () => {
        const index = Math.round((listRef.current?.scrollTop || 0) / 45);
        setSelectedYear(years[index + 1]);
    };

    const handleScrollMonths = () => {
        const index = Math.round((listRefMonths.current?.scrollTop || 0) / 45);
        setSelectedMonth(index + 1);
    };

    const handleScrollDays = () => {
        const index = Math.round((listRefDays.current?.scrollTop || 0) / 45);
        setSelectedDay(index + 1);
    };

    return (
        <div className="datepicker-container">
            <div className="scroll-lists">
                <div className="scroll-list" onScroll={handleScrollDays} ref={listRefDays}>
                    {days.map((day, i) => (
                        <div
                            key={i}
                            className={`scroll-item ${day === selectedDay ? "selected" : ""}`}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="scroll-list" onScroll={handleScrollMonths} ref={listRefMonths}>
                    {jalaliMonths.map((month, i) => (
                        <div
                            key={i}
                            className={`scroll-item ${i === selectedMonth ? "selected" : ""}`}
                        >
                            {month}
                        </div>
                    ))}
                </div>

                <div className="scroll-list" onScroll={handleScroll} ref={listRef}>
                    {years.map((year) => (
                        <div
                            key={year}
                            className={`scroll-item ${year === selectedYear ? "selected" : ""}`}
                        >
                            {year}
                        </div>
                    ))}
                </div>
            </div>

            {!isBirthdate && (
                <button className="apply-button" onClick={selectDateFunction}>
                    اعمال تاریخ
                </button>
            )}
        </div>
    );
};

export default MobileDatePicker;

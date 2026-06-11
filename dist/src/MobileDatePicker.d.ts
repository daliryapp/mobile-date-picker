import type { Moment } from "moment";
import "./mobileDatePicker.css";
export interface IDate {
    year: number;
    month: number;
    day: number;
    formatted: string;
    date: string;
    gDate: string;
    moment: Moment;
}
interface IMobileDatePicker {
    onDateChange: (date: IDate) => void;
    isBirthdate?: boolean;
    isGregorian?: boolean;
    backgroundColor?: string;
    textColor?: string;
    selectedColor?: string;
}
declare const DaliryMobileDatePicker: ({ onDateChange, isBirthdate, isGregorian, backgroundColor, textColor, selectedColor, }: IMobileDatePicker) => import("react/jsx-runtime").JSX.Element;
export default DaliryMobileDatePicker;

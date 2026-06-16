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
declare const DaliryMobileDatePicker: ({ onDateChange, isBirthdate, isGregorian, backgroundColor, textColor, selectedColor, value, }: IMobileDatePicker) => import("react/jsx-runtime").JSX.Element;
export default DaliryMobileDatePicker;

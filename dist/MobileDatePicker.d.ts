import { Moment } from "moment-jalaali";
import "./mobileDatePicker.css";
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
declare const MobileDatePicker: ({ onDateChange, isBirthdate }: IMobileDatePicker) => import("react/jsx-runtime").JSX.Element;
export default MobileDatePicker;

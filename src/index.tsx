import * as React from "react";
import {useEffect} from "react";


const NegarAuth: React.FC = () => {
    useEffect(() => {
        console.log('test')
    }, []);
    return <div>Negar Auth Component</div>;
};
export default NegarAuth;


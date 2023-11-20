
import Calendar from './calendar';
import {useState, useEffect, setState,state} from 'react'
import { useParams } from 'react-router-dom';


export const Coaches = () => {
    const { id } = useParams();
    return (
    <div className="Coaches">
        <div className='Calendar'>{<Calendar  props={{coach_id:id}}/>}</div>

    </div>
    );
    }

    export default Coaches;

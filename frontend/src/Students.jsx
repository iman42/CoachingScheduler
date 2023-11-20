
import Calendar from './calendar';
import {useState, useEffect, setState,state} from 'react'
import { useParams } from 'react-router-dom';


export const Students = () => {
    const { id } = useParams();
    return (
    <div className="Students">
        <div className='Calendar'>{<Calendar  props={{student_id:id}}/>}</div>

    </div>
    );
    }

    export default Students;

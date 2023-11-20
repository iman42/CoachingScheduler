import React, { useState, useRef, useEffect } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import "./CalendarStyles.css";

const styles = {
  wrap: {
    display: "flex"
  },
  left: {
    marginRight: "10px"
  },
  main: {
    flexGrow: "1"
  }
};

const Calendar = (props) => {
  const [events, setEvents] = useState(null);
  const calendarRef = useRef()
    try {
        calendarRef.current.control.update({events});
    }
    catch{
    }
    const fetchData = async () => {
      try {
        let json_result
        if (props.props.coach_id){
          const response = await fetch('http://127.0.0.1:5000/timeslots/'+props.props.coach_id);
          json_result = await response.json();
        }else{
          const response = await fetch('http://127.0.0.1:5000/timeslots');
          json_result = await response.json();
        }
        json_result["backColor"] = "#FF44FF"
          setEvents(json_result)

      } catch (error) {
          console.error('Error fetching data:', error);
      }
    };
    useEffect(()=>{
      fetchData()
  }, []) 
  const bookEvent = async (e) => {
    const response = await fetch('http://127.0.0.1:5000/timeslots/'+String(props.props.student_id), {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
          },
          
          body: JSON.stringify(e),
        });
        fetchData()
  };
  const updateNotes = async (e) => {
    const dp = calendarRef.current.control;
    const timeSlot = dp.events.find(e.value()).data
    const scoreModal = await DayPilot.Modal.prompt("Give Student a Score:", timeSlot.score);
    const notesModal = await DayPilot.Modal.prompt("Add additional Notes:", timeSlot.notes);
    if (!scoreModal.result || !notesModal.result) { return; }
    timeSlot.score = scoreModal.result
    timeSlot.notes = notesModal.result
    const response = await fetch('http://127.0.0.1:5000/timeslots', {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
          },
          
          body: JSON.stringify(timeSlot),
        });
        fetchData()
    
  };
  const [calendarConfig, setCalendarConfig] = useState({
    allowEventOverlap: false,
    viewType: "Week",
    durationBarVisible: false,
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    timeRangeSelectedHandling: props.props.student_id ? "Disabled": "Enabled",
    onTimeRangeSelected: async args => {
      const dp = calendarRef.current.control;
      dp.clearSelection();
      const timeslot_data = {
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        coach: props.props.coach_id,
      }
      if (props.props.coach_id){
        try {
          const response = await fetch('http://127.0.0.1:5000/timeslots', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(timeslot_data),
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } catch (error) {
          console.error('Error making POST request:', error);
        }
        fetchData()
      }
    },
    onEventClick: async args => {
      if (props.props.student_id){
        await bookEvent(args.e);
      }else if (props.props.coach_id){
        await updateNotes(args.e)
      }
    },
    onBeforeEventRender: args => {
      args.data.text = args.data.coach
      if (props.props.coach_id){
        args.data.areas = [
          {
            top: 3,
            right: 40,
            width: 20,
            height: 20,
            symbol: "icons/daypilot.svg#x-circle",
            fontColor: "#993355",
            action: "None",
            text: "delete",
            toolTip: "Delete event",
            onClick: async args => {
              const dp = calendarRef.current.control;
              dp.events.remove(args.source);
              const response = await fetch('http://127.0.0.1:5000/timeslots', {
              method: 'DELETE',
              headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(args.source),
          });
            }
          },
          {
            top: 50,
            right: 30,
            width: 20,
            height: 20,
            symbol: "icons/daypilot.svg#x-circle",
            fontColor: "#993355",
            action: "None",
            text: args.data.score ? "score " + String(args.data.score): "",
            toolTip: "Delete event",
            onClick: async args => {
              const dp = calendarRef.current.control;
              dp.events.remove(args.source);
              const response = await fetch('http://127.0.0.1:5000/timeslots', {
              method: 'DELETE',
              headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(args.source),
          });
            }
          }
        ];
      }
      const student = args.data.student;
      if (student !== "" && props.props.coach_id) {
        args.data.backColor = "#3322ff"
      }else if (String(student) === props.props.student_id){
        args.data.backColor = "#3322ff"
      }else if (String(student) > 0 && props.props.student_id){
        args.data.backColor = "#ff2233"
      }
      else{
        args.data.backColor = "#229933"
      }
    }
  });
  
  return (
    <div style={styles.wrap}>
      <div style={styles.left}>
        <DayPilotNavigator
          selectMode={"Week"}
          showMonths={2}
          skipMonths={2}
          startDate={"2023-11-02"}
          selectionDay={"2023-11-20"}
          onTimeRangeSelected={ args => {
            calendarRef.current.control.update({
              startDate: args.day
            });
          }}
        />
      </div>
      <div style={styles.main}>
        <DayPilotCalendar
          {...calendarConfig}
          ref={calendarRef}
        />
      </div>
    </div>
  );
}

export default Calendar;
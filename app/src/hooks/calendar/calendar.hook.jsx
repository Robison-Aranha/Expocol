import { useEffect, useState, useMemo } from "react";
import { useCalendarApi } from "../../api/api";
import "./calendar.style.css";
import { months } from "../../api/consts/months";
import { weekDays } from "../../api/consts/weekDays";
import { Indexes } from "../hooks";
import { useGlobalIndexModal, useGlobalLoading } from "../../globalState/globalState";

export const Calendar = () => {
  const dataAtual = new Date();
  const [calendar, setCalendar] = useState({
    year: dataAtual.getFullYear(),
    month: "janeiro",
    days: {}
  });

  const [selectedDay, setSelectedDay] = useState()
  const { returnMonth, createCalendar } = useCalendarApi();
  const [, setIndexGlobalModal] = useGlobalIndexModal()
  const [, setLoading] = useGlobalLoading()

  useEffect(() => {
    returnMonthService();
  }, [useMemo(() => (calendar.year)), useMemo(() => (calendar.month))]);

  const returnMonthService = async () => {
    try {

      setLoading(true)

      const response = await returnMonth(calendar.year, calendar.month);

      setLoading(false)

      setCalendar({ ...calendar, days: {...response.days } });
    } catch (response) {
      if (response.response.status == 404) {
        createCalendarService();
      } else {
        console.log(response);
      }
    }
  };

  const createCalendarService = async () => {
    try {
      
      await createCalendar(calendar.year);


      returnMonthService();
    } catch (response) {
      console.log(response);
    }
  };


  const handlerValue = (event) => {
    const { value, name } = event.target;
    setCalendar({ ...calendar, [name]: value });
  }

  const handleIndexGlobalState = (diaValue) => {

    if (diaValue) {
      setIndexGlobalModal(true)
    }

  }

  return (
    <>
      <div className="Calendar-section">
        <div className="Calendar-choice">
          <select defaultValue={"JANIERO"} name="month" onChange={handlerValue}>
            {months.map((month, key) => (
              <option value={month} key={key}>{month}</option>
            ))}
          </select>
          <input type="number" name="year" value={calendar.year} onChange={handlerValue}/>
        </div>
        <div className="Calendar-table">
          {weekDays.map((day, key) => (
            <div className="Calendar-table-column" key={key}>
              <div className="Calendar-table-title">
                <p>{day}</p>
              </div>
              <div className="Calendar-table-content">
                {calendar.days[day]?.map((dia, key) => (
                  <div onClick={() => {
                    setSelectedDay(dia.diaValue) 
                    handleIndexGlobalState(dia.diaValue)
                    }} className="Calendar-table-day" style={{ cursor: (dia.diaValue ? "pointer" : "")}} key={key}>
                    {dia.diaValue ? dia.diaValue : ""}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Indexes year={calendar.year} month={calendar.month} day={selectedDay}/>
    </>
  );
};

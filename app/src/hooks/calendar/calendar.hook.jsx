import { useEffect, useState, useMemo } from "react";
import { useCalendarApi } from "../../api/api";
import "./calendar.style.css";
import { months } from "../../consts/months";
import { weekDays } from "../../consts/weekDays";
import {
  useGlobalLoading,
  useGlobalCalendar
} from "../../globalState/globalState";
import { LocalDate } from "@js-joda/core";

export const Calendar = () => {
  const dataAtual = new Date();
  const [calendar, setCalendar] = useState({
    year: dataAtual.getFullYear(),
    month: "janeiro",
    days: {},
  });

  const { returnMonth, createCalendar } = useCalendarApi();
  const [globalCalendar, setGlobalCalendar] = useGlobalCalendar();
  const [, setLoading] = useGlobalLoading();

  useEffect(() => {
    returnMonthService();
  }, [useMemo(() => calendar.year), useMemo(() => calendar.month)]);

  const returnMonthService = async () => {
    try {
      setLoading(true);

      const response = await returnMonth(calendar.year, calendar.month);

      setLoading(false);
      console.log(response)

      setCalendar({ ...calendar, days: { ...response.days } });
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
  };

  const handleIndexGlobalState = (diaValue) => {
    if (diaValue) {
      setGlobalCalendar({...globalCalendar, dia: diaValue, mes: calendar.month, ano: calendar.year})
    }
  };

  return (
    <>
      <div className="Calendar-section">
        <div className="Calendar-choice">
          <select defaultValue={"JANEIRO"} name="month" onChange={handlerValue}>
            {months.map((month, key) => (
              <option value={month} key={key}>
                {month}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="year"
            min={LocalDate.now().year().toString()}
            value={calendar.year}
            onChange={handlerValue}
          />
        </div>
        <div className="Calendar-table">
          {weekDays.map((day, key) => (
            <div className="Calendar-table-column" key={key}>
              <div className="Calendar-table-title">
                <p>{day}</p>
              </div>
              <div className="Calendar-table-content">
                {calendar.days[day]?.map((dia, key) => (
                  <div
                    onClick={() => {
                      if (!globalCalendar) {
                        handleIndexGlobalState(dia.diaValor);
                      }
                    }}
                    className="Calendar-table-day"
                    style={{ cursor: dia.diaValor ? "pointer" : "" }}
                    key={key}
                  >
                    {dia.diaValor ? dia.diaValor : ""}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

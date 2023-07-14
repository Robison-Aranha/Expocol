import { useEffect, useState, useMemo } from "react";
import { useCalendarApi, useClassroomApi } from "../../api/api";
import "./calendar.style.css";
import { months } from "../../consts/months";
import { weekDays } from "../../consts/weekDays";
import {
  useGlobalLoading,
  useGlobalCalendar,
  useLoadCalendar,
  useClassroomToken
} from "../../globalState/globalState";
import ClassroomIcon from "../../assets/tools/classroom.png";


export const Calendar = () => {
  const dataAtual = new Date();
  const [calendar, setCalendar] = useState({
    year: dataAtual.getFullYear(),
    month: "JANEIRO",
    days: {},
  });

  const { returnMonth, createCalendar } = useCalendarApi();
  const { returnCourses, returnCourseWork } = useClassroomApi();
  const [globalCalendar, setGlobalCalendar] = useGlobalCalendar();
  const [classroomToken] = useClassroomToken();
  const [classroomWorks, setClassroomWorks] = useState()
  const [classroomCourses, setClassroomCourses] = useState()
  const [selectedCourse, setSelectedCourse] = useState()
  const [loadCalendar, setLoadCalendar] = useLoadCalendar();
  const [, setLoading] = useGlobalLoading();

  useEffect(() => {
    returnMonthService();
  }, [calendar.year, calendar.month]);

  useEffect(() => {
    if (loadCalendar) {
      returnMonthService();
      setLoadCalendar(false);
    }
  }, [loadCalendar]);

  useEffect(() => {

    if (classroomToken) {
      handleClasses()
    } else {
      setClassroomCourses(null)
      setClassroomWorks(null)
      setSelectedCourse(null)
    }

  }, [classroomToken])

  useEffect(() => {

    setClassroomWorks(null)

    if (selectedCourse) {
      handleClassroomWorks()
    }

    
  }, [selectedCourse, calendar])

  const returnMonthService = async () => {
    try {
      setLoading(true);

      const response = await returnMonth(calendar.year, calendar.month);

      setLoading(false);
      console.log(response);

      setCalendar({ ...calendar, days: { ...response.days } });
    } catch (response) {
      if (response.response.status == 404) {
        createCalendarService();
      } else {
        console.log(response);
      }
    }
  };

  const handleClasses = async () => {

    setLoading(true)

    try {

      const courses = await returnCourses()
      
      setClassroomCourses([...courses.courses])

    } catch(error) {}

    setLoading(false)

  }

  const handleClassroomWorks = async () => {

    setLoading(true)

    const actualMonth = months.findIndex((item) => item == calendar.month) + 1;

    try {
      
      const coursesWorks = await returnCourseWork(selectedCourse);
      const monthWorks = []

      if (coursesWorks.courseWork) {

        for (let i = 0; i < coursesWorks.courseWork.length; i++) {

          const work = coursesWorks.courseWork[i]

          if (work.dueDate) {

            if (work.dueDate.year == calendar.year && work.dueDate.month == actualMonth) {
              
                monthWorks[`${work.dueDate.day}`] = work
              }
          }

        }
      }

      setClassroomWorks(monthWorks)

      setLoading(false)
    } catch (response) {
      console.log(response);
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
      setGlobalCalendar({
        ...globalCalendar,
        dia: diaValue,
        mes: calendar.month,
        ano: calendar.year,
      });
    }
  };

  const returnClassesSelections = () => {
  
    if (classroomCourses) {

      return (

        <select
          onChange={(event) => setSelectedCourse(event.target.value)}
        >
          <option selected disabled> Selecione um dos cursos</option>
          { classroomCourses.map((course, key) => (
            <option key={key} value={course.id}>
              { course.name }
            </option>
          )) }

        </select>
      )
    }
  }

  const returnClassroomWorkDay = (diaValor) => {
  
    if (classroomWorks) {

      if (classroomWorks[`${diaValor}`]) {

        return (
          <img  src={ClassroomIcon} />
        )

      }
    }
  }

  return (
    <>
      <div className="Calendar-section">
        <div className="Calendar-user-choice-info">
          <div className="Calendar-inputs">
            <select
              defaultValue={"JANEIRO"}
              name="month"
              onChange={handlerValue}
            >
              {months.map((month, key) => (
                <option value={month} key={key}>
                  {month}
                </option>
              ))}
            </select>
            <input
              required={true}
              type="number"
              name="year"
              value={calendar.year}
              onChange={handlerValue}
            />
            { returnClassesSelections()}
          </div>
          <div className="Calendar-info">
            <div className="Calendar-info-index">
              <div></div>
              <p> Há arquivos indexados </p>
            </div>
            <div className="Calendar-info-event">
              <div></div>
              <p> Há eventos indexados </p>
            </div>
          </div>
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
                    className={
                      dia.diaValor
                        ? "Calendar-table-day"
                        : "Calendar-table-day-void"
                    }
                    style={{ cursor: dia.diaValor ? "pointer" : "" }}
                    key={key}
                  >
                    <div className="Calendar-table-day-content">
                      {dia.index ? (
                        <div className="Calendar-table-day-indexes"></div>
                      ) : null}
                      {dia.event ? (
                        <div className="Calendar-table-day-events"> </div>
                      ) : null}
                    </div>
                    {dia.diaValor ? dia.diaValor : ""}
                    {returnClassroomWorkDay(dia.diaValor)}
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

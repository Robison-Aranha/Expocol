import { useEffect, useState } from "react";
import { useCalendarApi, useClassroomApi } from "../../api/api";
import "./calendar.style.css";
import { months } from "../../consts/months";
import { weekDays } from "../../consts/weekDays";
import {
  useGlobalLoading,
  useGlobalCalendar,
  useLoadCalendar,
  useClassroomToken,
  useClassroomUtils,
} from "../../globalState/globalState";
import ClassroomIcon from "../../assets/tools/classroom.png";
import { useVerifySession } from "../../api/verifySessions";

export const Calendar = () => {
  const dataAtual = new Date();
  const [calendar, setCalendar] = useState({
    year: dataAtual.getFullYear(),
    month: "JANEIRO",
    days: {},
  });

  const { returnMonth, createCalendar } = useCalendarApi();
  const { returnCourses, returnCourseWork } = useClassroomApi();
  const { verifySessionUser, verifySessionClassroom } = useVerifySession();

  const [globalCalendar, setGlobalCalendar] = useGlobalCalendar();
  const [classroomToken] = useClassroomToken();
  const [classroomUtils, setClassroomUtils] = useClassroomUtils();
  const [selectedCourse, setSelectedCourse] = useState();
  const [loadCalendar, setLoadCalendar] = useLoadCalendar();
  const [loading, setLoading] = useGlobalLoading();

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
      handleClasses();
    } else {
      setClassroomUtils({ courses: null, monthWorks: null });
      setSelectedCourse(null);
    }
  }, [classroomToken]);

  useEffect(() => {
    if (selectedCourse) {
      handleClassroomWorks();
    }
  }, [selectedCourse]);

  const returnMonthService = async () => {
    try {
      setLoading(true);

      const response = await returnMonth(calendar.year, calendar.month);

      setLoading(false);
      console.log(response);

      setCalendar({ ...calendar, days: { ...response.days } });

      if (classroomToken && selectedCourse) {
        handleClassroomWorks();
      }
    } catch (error) {
      verifySessionUser(error);
      if (error.response.status == 404) {
        createCalendarService();
      }
    }
  };

  const handleClasses = async () => {
    setLoading(true);

    try {
      const courses = await returnCourses();

      setClassroomUtils({ ...classroomUtils, courses: [...courses.courses] });
    } catch (error) {
      verifySessionClassroom(error);
    }

    setLoading(false);
  };

  const handleClassroomWorks = async () => {
    setLoading(true);

    const actualMonth = months.findIndex((item) => item == calendar.month) + 1;

    try {
      const coursesWorks = await returnCourseWork(selectedCourse);
      const monthWorks = [];

      if (coursesWorks.courseWork) {
        for (let i = 0; i < coursesWorks.courseWork.length; i++) {
          const work = coursesWorks.courseWork[i];

          if (work.dueDate) {
            if (
              work.dueDate.year == calendar.year &&
              work.dueDate.month == actualMonth
            ) {
              if (monthWorks[`${work.dueDate.day}`]) {
                monthWorks[`${work.dueDate.day}`].push(work);
              } else {
                monthWorks[`${work.dueDate.day}`] = [work];
              }
            }
          }
        }
      }

      setClassroomUtils({ ...classroomUtils, monthWorks: { ...monthWorks } });

  
    } catch (error) {
      verifySessionClassroom(error);
    }

    setLoading(false)
  };

  const createCalendarService = async () => {
    try {
      await createCalendar(calendar.year);

      returnMonthService();
    } catch (error) {
      verifySessionUser(error);
    }
  };

  const handlerValue = (event) => {
    const { value, name } = event.target;
    setCalendar({ ...calendar, [name]: value });
  };

  const handlerYear = (event) => {
    try {
      const ano = parseInt(event.target.value);

      if (ano > 0 && event.target.value.length == 4) {
        event.target.value = ano;
        handlerValue(event);
      }
    } catch {}
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
    if (classroomUtils.courses) {
      return (
        <select onChange={(event) => setSelectedCourse(event.target.value)}>
          <option selected disabled>
            {" "}
            Selecione um dos cursos
          </option>
          {classroomUtils.courses.map((course, key) => (
            <option key={key} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      );
    }
  };

  const returnClassroomWorkDay = (diaValor) => {
    if (classroomUtils.monthWorks && !loading) {
      if (classroomUtils.monthWorks[`${diaValor}`]) {
        return <img src={ClassroomIcon} />;
      }
    }
  };

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
              onChange={handlerYear}
            />
            {returnClassesSelections()}
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
                <p>
                  {" "}
                  <strong> {day} </strong>{" "}
                </p>
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
                    {dia.diaValor ? <strong> {dia.diaValor} </strong> : ""}
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

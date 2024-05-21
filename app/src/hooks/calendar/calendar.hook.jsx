import { useEffect, useState } from "react";
import { useCalendarApi, useClassroomApi } from "../../api/api";
import "./calendar.style.css";
import { MONTHS } from "../../consts/months";
import { WEEKDAYS } from "../../consts/weekDays";
import {
  useGlobalLoading,
  useGlobalCalendar,
  useLoadCalendar,
  useClassroomToken,
  useClassroomUtils,
  useGlobalModal,
} from "../../globalState/globalState";
import ClassroomIcon from "../../assets/tools/classroom.png";
import { useVerifySession } from "../../api/verifySessions";

export const Calendar = () => {
  const dataAtual = new Date();
  const [calendar, setCalendar] = useState({
    year: dataAtual.getFullYear(),
    month: "JANEIRO",
    days: "",
  });

  const { returnMonth, returnMonthMobile, createCalendar } = useCalendarApi();
  const { returnCourses, returnCourseWork } = useClassroomApi();
  const { verifySessionUser, verifySessionClassroom } = useVerifySession();

  const [globalCalendar, setGlobalCalendar] = useGlobalCalendar();
  const [globalModal, setGlobalModal] = useGlobalModal();
  const [classroomToken, setClassroomToken] = useClassroomToken();
  const [classroomUtils, setClassroomUtils] = useClassroomUtils();
  const [selectedCourse, setSelectedCourse] = useState();
  const [loadCalendar, setLoadCalendar] = useLoadCalendar();
  const [, setLoading] = useGlobalLoading();
  const [isDaysLoaded, setIsDaysLoaded] = useState();
  const [calendarState, setCalendarState] = useState();

  useEffect(() => {
    setCalendar({ ...calendar, days: "" });

    if (window.screen.width <= 850) {
      if (calendarState == false) {
        returnMonthMobileService();
      } else {
        setCalendarState(false);
      }
    } else {
      if (calendarState) {
        returnMonthService();
      } else {
        setCalendarState(true);
      }
    }
  }, [calendar.year, calendar.month]);

  useEffect(() => {
    if (loadCalendar) {
      if (calendarState) {
        returnMonthService();
      } else {
        returnMonthMobileService();
      }
      setLoadCalendar(false);
    }
  }, [loadCalendar]);

  useEffect(() => {
    if (calendarState) {
      returnMonthService();
    } else if (calendarState == false) {
      returnMonthMobileService();
    }
  }, [calendarState]);

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
      setClassroomUtils({ ...classroomUtils, monthWorks: null });
      handleClassroomWorks();
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (classroomToken && selectedCourse && isDaysLoaded) {
      setClassroomUtils({ ...classroomUtils, monthWorks: null });
      handleClassroomWorks();
    }

    setIsDaysLoaded(false);
  }, [isDaysLoaded]);

  const returnMonthService = async () => {
    try {
      const response = await returnMonth(calendar.year, calendar.month);

      setCalendar({ ...calendar, days: { ...response.days } });

      setIsDaysLoaded(true);
    } catch (error) {
      verifySessionUser(error);
      if (error.response.status == 404) {
        createCalendarService();
      }
    }
  };

  const returnMonthMobileService = async () => {
    try {
      const response = await returnMonthMobile(calendar.year, calendar.month);

      setCalendar({ ...calendar, days: [...response.days] });

      setIsDaysLoaded(true);
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

      if (Object.keys(courses).length > 0) {
        setClassroomUtils({ ...classroomUtils, courses: [...courses.courses] });
      } else {
        setGlobalModal([
          ...globalModal,
          { message: "Não há cursos para este usuario!" },
        ]);
        setClassroomToken(null);
      }
    } catch (error) {
      verifySessionClassroom(error);
    }

    setLoading(false);
  };

  const handleClassroomWorks = async () => {
    setLoading(true);

    const actualMonth = MONTHS.findIndex((item) => item == calendar.month) + 1;

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

    setLoading(false);
  };

  const createCalendarService = async () => {
    setLoading(true);
    try {
      await createCalendar(calendar.year);

      if (calendarState) {
        returnMonthService();
      } else if (calendarState == false) {
        returnMonthMobileService();
      }
    } catch (error) {
      verifySessionUser(error);
    }
    setLoading(false);
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
    if (classroomUtils.monthWorks) {
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
              {MONTHS.map((month, key) => (
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
        {calendarState ? (
          <div className="Calendar-table">
            {WEEKDAYS.map((day, key) => (
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
        ) : (
          <div className="Calendar-table-mobile">
            {calendar.days.length > 0
              ? calendar.days.map((dia) => (
                  <>
                    <div
                      className="Calendar-table-day-mobile"
                      onClick={() => {
                        if (!globalCalendar) {
                          handleIndexGlobalState(dia.diaValor);
                        }
                      }}
                    >
                      <div className="Calendar-table-day-mobile-sticky-title">
                        {" "}
                        <p>
                          <strong> {dia.diaDaSemana} </strong>{" "}
                        </p>{" "}
                      </div>
                      <div className="Calendar-table-day-content">
                        {dia.index ? (
                          <div className="Calendar-table-day-indexes"></div>
                        ) : null}
                        {dia.event ? (
                          <div className="Calendar-table-day-events"> </div>
                        ) : null}
                      </div>
                      <p>
                        {" "}
                        {dia.diaValor ? (
                          <strong> {dia.diaValor} </strong>
                        ) : (
                          ""
                        )}{" "}
                      </p>
                      {returnClassroomWorkDay(dia.diaValor)}
                    </div>
                  </>
                ))
              : null}
          </div>
        )}
      </div>
    </>
  );
};

import { uuidv4 } from "@firebase/util";
import React, { useState, useEffect } from "react";
import TeacherNavBar from "./NavBar/TeacherNavBar";

export default function ExamTimeTable() {
  const [classList, setClassList] = useState([{}]);
  const [classId, setClassId] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [timeTableList, setTimeTableList] = useState([{}]);
  const [isTimeTable, setIsTimeTable] = useState(false);
  const [classId1, setClassId1] = useState(null);
  const [teaches, setTeaches] = useState(null);
  const [loading, setLoading] = useState(true);
  const [examType, setExamType] = useState([{}]);
  const [examTypeKey, setExamTypeKey] = useState();
  const [examTypeKey1, setExamTypeKey1] = useState();

  const getClassList = async () => {
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/teaches-in`,
        {
          method: "GET",
          headers: { token: localStorage.Token, tid: localStorage.id },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setClassList([...gotList.List]);
      } else {
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error.message);
      localStorage.removeItem("Token");
    }
  };
  const getSubject = async () => {
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/teaches-subject`,
        {
          method: "GET",
          headers: { token: localStorage.Token, tid: localStorage.id },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setTeaches(gotList.subjectName);
      } else {
        // localStorage.removeItem("Token");
        // localStorage.removeItem("User");
        // window.location.href = "/";
      }
    } catch (error) {
      console.log(error.message);
      localStorage.removeItem("Token");
    }
  };
  const getTimeTable = async () => {
    setFetching(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/exam-timetable`,
        {
          method: "GET",
          headers: {
            token: localStorage.Token,
            classId: classId,
            examType: examTypeKey,
          },
        }
      );
      const res = await response.json();
      if (res.Status) {
        setTimeTableList([...res.List]);
        setClassId1(classId);
        setExamTypeKey1(examTypeKey);
        setIsTimeTable(true);
        setFetching(false);
      } else {
        alert(`Cannot fetch the time table`);
        setFetching(false);
        setIsTimeTable(false);
      }
    } catch (error) {
      alert(`Cannot fetch the time table, ${error.message}`);
    }
  };
  const getExamType = async () => {
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/exam-type`,
        {
          method: "GET",
          headers: { token: localStorage.Token },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setExamType(gotList.List);
        setLoading(false);
      } else {
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error.message);
      localStorage.removeItem("Token");
    }
  };
  useEffect(() => {
    getSubject();
    getClassList();
    getExamType();
  }, []);
  if (loading) {
    return (
      <>
        <TeacherNavBar />
        <div>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-10  pt-3"></div>
          </div>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-10  pt-3">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <TeacherNavBar />
        <div className="row mt-5">
          <div className="col-2"></div>
          <div className="col-10"></div>
        </div>
        <div className="row mt-5 pt-5">
          <div className="col-2"></div>
          <div className="col-1"></div>

          <div className="col-7 ">
            <h4 className="text-info text-center mb-3">
              Please Select A Class To View The Time Table
            </h4>
            <div className="form-outline mb-3">
              <select
                className="form-select bg-light"
                aria-label="Default select example"
                autoComplete="off"
                required
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
              >
                <option selected>Please Click To Select A Class</option>
                {classList.map((classes) => (
                  <option key={classes.classId}> {classes.class}</option>
                ))}
              </select>
            </div>
            <div className="form-outline mb-3">
              <select
                className="form-select bg-light"
                aria-label="Default select example"
                autoComplete="off"
                required
                value={examTypeKey}
                onChange={(e) => setExamTypeKey(e.target.value)}
              >
                <option selected>Please Select The Exam Type</option>
                {examType.map((exam) => (
                  <option key={uuidv4()}> {exam.examName}</option>
                ))}
              </select>
            </div>
            {fetching ? (
              <p align="right">
                <button
                  class="btn btn-warning text-dark"
                  type="button"
                  disabled
                >
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </button>
              </p>
            ) : (
              <p align="right">
                <button onClick={getTimeTable} className=" btn btn-warning ">
                  View
                </button>
              </p>
            )}
          </div>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-10">
              {isTimeTable ? (
                <>
                  <h6 className="text-primary">
                    Viewing Exam Time Table Of{" "}
                    <span className="text-danger">
                      Class {classId1} for {examTypeKey1}
                    </span>{" "}
                    Examination
                  </h6>
                  <table className="text-dark table  table-bordered text-center mb-5 ">
                    <thead className="bg-dark text-light">
                      <tr>
                        <th>Day</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Subject</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timeTableList.map((timeTable) => {
                        const { day, dateOfExam, subjectName } = timeTable;
                        return (
                          <tr key={uuidv4()}>
                            <td className="bg-warning text-dark">{day}</td>
                            <td>{dateOfExam}</td>
                            <td>9:00Am-11:00Am</td>
                            {teaches === subjectName ? (
                              <td className="bg-success text-light">
                                {subjectName}
                              </td>
                            ) : (
                              <td>{subjectName}</td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              ) : (
                <>
                  {fetching ? (
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

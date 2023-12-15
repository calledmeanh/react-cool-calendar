import React from "react";
import ReactDOM from "react-dom/client";
import { TAppointmentForUser } from "./model";
import { ElementMocks } from "./mock";
import Calendar from "./app/Calendar";
import "./index.css";

const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <div style={{ width: "100vw", height: "100vh", padding: "24px" }}>
      {/* Calendar should take props from user pass in, this value below is just for temporary */}
      <Calendar
        duration={30}
        timeType={24}
        groupTime={60}
        nowIndicator={true}
        viewMode={"WEEK"}
        dateFormat="MM/DD/YYYY"
        datetimeFormat="MM DD YYYY hh:mm:ss"
        timeFormat="hh:mm:ss"
        locale="en"
        workingTime={{ start: 7, end: 20 }}
        dayTime={{ start: 0, end: 24 }}
        appointments={ElementMocks.getDataSource()}
        apptChange={(appts: TAppointmentForUser[]) => {
          console.log(appts);
        }}
        apptClick={(appt: TAppointmentForUser) => {
          console.log(appt);
        }}
      />
    </div>
  </React.StrictMode>,
);

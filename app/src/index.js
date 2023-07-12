import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import {
  Provider,
  ModalProvider,
  IndexModalProvider,
  IndexProvider,
  LoadinProvider,
  GoogleProvider,
  EventProvider,
  CalendarProvider,
  LoadCalendarProvider,
  ClassroomTokenProvider,
  ClassroomWorkProvider,
} from "./globalState/globalState";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleProvider>
    <ModalProvider>
      <Provider>
        <ClassroomTokenProvider>
          <CalendarProvider>
            <IndexModalProvider>
              <ClassroomWorkProvider>
                <IndexProvider>
                  <LoadinProvider>
                    <EventProvider>
                      <LoadCalendarProvider>
                        <BrowserRouter>
                          <App />
                        </BrowserRouter>
                      </LoadCalendarProvider>
                    </EventProvider>
                  </LoadinProvider>
                </IndexProvider>
              </ClassroomWorkProvider>
            </IndexModalProvider>
          </CalendarProvider>
        </ClassroomTokenProvider>
      </Provider>
    </ModalProvider>
  </GoogleProvider>
);

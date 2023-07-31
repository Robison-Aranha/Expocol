import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import {
  Provider,
  ModalProvider,
  IndexesModalProvider,
  IndexProvider,
  LoadingProvider,
  GoogleProvider,
  EventProvider,
  CalendarProvider,
  LoadCalendarProvider,
  ClassroomTokenProvider,
  ClassroomUtilsProvider,
  ClassroomSelectedWorkProvider,
  ChangeProfileProvider,
  AnexoProvider,
  ImageTextAnaliserProvider,
  GradeCorrectorProvider,
  DictionaryProvider
} from "./globalState/globalState";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleProvider>
    <ModalProvider>
      <Provider>
        <ClassroomTokenProvider>
          <ClassroomUtilsProvider>
            <ClassroomSelectedWorkProvider>
              <CalendarProvider>
                <IndexesModalProvider>
                  <ChangeProfileProvider>
                    <AnexoProvider>
                      <IndexProvider>
                        <LoadingProvider>
                          <EventProvider>
                            <LoadCalendarProvider>
                              <GradeCorrectorProvider>
                                <ImageTextAnaliserProvider>
                                  <DictionaryProvider>
                                    <BrowserRouter>
                                      <App />
                                    </BrowserRouter>
                                  </DictionaryProvider>
                                </ImageTextAnaliserProvider>
                              </GradeCorrectorProvider>
                            </LoadCalendarProvider>
                          </EventProvider>
                        </LoadingProvider>
                      </IndexProvider>
                    </AnexoProvider>
                  </ChangeProfileProvider>
                </IndexesModalProvider>
              </CalendarProvider>
            </ClassroomSelectedWorkProvider>
          </ClassroomUtilsProvider>
        </ClassroomTokenProvider>
      </Provider>
    </ModalProvider>
  </GoogleProvider>
);

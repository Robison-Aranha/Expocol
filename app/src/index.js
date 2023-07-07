import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import "./index.css"
import { Provider, ModalProvider, IndexModalProvider, IndexProvider, LoadinProvider, GoogleProvider, EventProvider, CalendarProvider } from './globalState/globalState';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleProvider>
        <ModalProvider>
            <Provider>
                <CalendarProvider>
                    <IndexModalProvider>
                        <IndexProvider>
                            <LoadinProvider>
                                <EventProvider>
                                    <BrowserRouter>
                                        <App />
                                    </BrowserRouter>
                                </EventProvider>
                            </LoadinProvider>
                        </IndexProvider>
                    </IndexModalProvider>
                </CalendarProvider>
            </Provider>
        </ModalProvider>
    </GoogleProvider>
  
);

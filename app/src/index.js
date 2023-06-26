import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import "./index.css"
import { Provider, ModalProvider, IndexModalProvider, IndexProvider, LoadinProvider, GoogleProvider } from './globalState/globalState';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleProvider>
        <ModalProvider>
            <Provider>
                <IndexModalProvider>
                    <IndexProvider>
                        <LoadinProvider>
                            <BrowserRouter>
                                <App />
                            </BrowserRouter>
                        </LoadinProvider>
                    </IndexProvider>
                </IndexModalProvider>
            </Provider>
        </ModalProvider>
    </GoogleProvider>
  
);

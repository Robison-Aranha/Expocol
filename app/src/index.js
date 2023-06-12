import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import "./index.css"
import { Provider } from './globalState/globalState';
import { ModalProvider } from './globalState/globalState';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ModalProvider>
        <Provider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </ModalProvider>
  
);

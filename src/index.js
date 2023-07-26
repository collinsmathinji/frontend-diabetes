import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { DiabeticStatsContext} from './context/DiabeticStats'; // Update the import to use DiabeticStatsContextProvider
import { AuthContext } from './context/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthContext.Provider>
      <DiabeticStatsContext.Provider> 
        <App />
      </DiabeticStatsContext.Provider>
    </AuthContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

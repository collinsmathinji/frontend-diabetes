import React, { useState, useEffect } from 'react';
import { useDiabeticContext } from '../hooks/DiabeticStatsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { format } from 'date-fns';
import { Doughnut } from 'react-chartjs-2';

const DiabeticStatsForm = () => {
  const { dispatch, diabeticStats } = useDiabeticContext();
  const { user } = useAuthContext();

  const [bloodSugarLevel, setBloodSugarLevel] = useState('');
  const [insulinIntake, setInsulinIntake] = useState('');
  const [medication, setMedication] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [averageBloodSugarLevel, setAverageBloodSugarLevel] = useState(0);

  useEffect(() => {
    // Calculate the average blood sugar level
    if (diabeticStats && diabeticStats.length > 0) {
      const totalBloodSugar = diabeticStats.reduce((sum, entry) => sum + entry.bloodSugarLevel, 0);
      const average = totalBloodSugar / diabeticStats.length;
      setAverageBloodSugarLevel(average);
    }
  }, [diabeticStats]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    // Check for empty fields
    if (!bloodSugarLevel || !insulinIntake || !medication) {
      setEmptyFields(['bloodSugarLevel', 'insulinIntake', 'medication']);
      setError('Please fill in all fields');
      return;
    }

    const diabeticStatsData = { bloodSugarLevel, insulinIntake, medication };

    try {
      const response = await fetch('https://diabetes-back.vercel.app/api/diabeticStats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(diabeticStatsData)
      });

      const data = await response.json();

      if (response.ok) {
        // Diabetic stats posted successfully
        dispatch({ type: 'ADD_DIABETIC_STAT', payload: data });
        setBloodSugarLevel('');
        setInsulinIntake('');
        setMedication('');
        setError(null);
        setEmptyFields([]);
      } else {
        // Handle error response from the server
        setError('Failed to add diabetic stats');
      }
    } catch (error) {
      // Handle network or other errors
      setError('An error occurred while adding diabetic stats');
    }
  };

  const data = {
    datasets: [
      {
        data: [averageBloodSugarLevel, 600 - averageBloodSugarLevel], // Assuming the max value is 600
        backgroundColor: ['#36A2EB', '#FF6384'], // Colors for the segments
      },
    ],
  };

  return (
    <div>
      <form className="diabetic-stats-form" onSubmit={handleSubmit}>
        <h1 className='note'>Note!!Input data within a time frame of 2 hours after meal</h1>
        <h3>Enter Diabetic Health Stats</h3>

        <div className="form-group">
          <label htmlFor="blood-sugar-level">Blood Sugar Level (mg/dL):</label>
          <input
            type="number"
            id="blood-sugar-level"
            onChange={(e) => setBloodSugarLevel(e.target.value)}
            value={bloodSugarLevel}
            className={emptyFields.includes('bloodSugarLevel') ? 'error' : ''}
          />
        </div>

        <div className="form-group">
          <label htmlFor="insulin-intake">Insulin Intake (units):</label>
          <input
            type="number"
            id="insulin-intake"
            onChange={(e) => setInsulinIntake(e.target.value)}
            value={insulinIntake}
            className={emptyFields.includes('insulinIntake') ? 'error' : ''}
          />
        </div>

        <div className="form-group">
          <label htmlFor="medication">Medication:</label>
          <input
            type="text"
            id="medication"
            onChange={(e) => setMedication(e.target.value)}
            value={medication}
            className={emptyFields.includes('medication') ? 'error' : ''}
          />
        </div>

        <button className="submit-btn">Add Diabetic Stats</button>
        {error && <div className="error">{error}</div>}
      </form>

      {/* Display Donut Graph */}
      {diabeticStats.length > 0 && (
        <div className="average-blood-sugar-graph">
          <h3>Average Blood Sugar Level</h3>
          <Doughnut
            data={data}
            options={{
              cutout: '70%',
              legend: {
                display: false,
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DiabeticStatsForm;

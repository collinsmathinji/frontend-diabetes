import React, { useState, useEffect } from 'react';
import { useDiabeticContext } from '../hooks/DiabeticStatsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { format } from 'date-fns';
import { Doughnut } from 'react-chartjs-2';

const DiabeticStatsDetails = ({ stats }) => {
  const { dispatch } = useDiabeticContext();
  const { user } = useAuthContext();

  const [diabeticStats, setDiabeticStats] = useState(null);
  const [averageBloodSugarLevel, setAverageBloodSugarLevel] = useState(0);

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://diabetes-back.vercel.app/api/diabeticStats/${stats._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        dispatch({ type: 'DELETE_DIABETIC_STAT', payload: stats._id });
      } else {
        // Handle error if needed
      }
    } catch (error) {
      // Handle error if needed
    }
  };

  useEffect(() => {
    const fetchDiabeticStats = async () => {
      try {
        const response = await fetch(`https://diabetes-back.vercel.app/api/diabeticStats/${stats._id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const json = await response.json();

        if (response.ok) {
          setDiabeticStats(json);
        } else {
          // Handle error if needed
        }
      } catch (error) {
        // Handle error if needed
      }
    };

    if (user) {
      fetchDiabeticStats();
    }
  }, [user, stats._id]);

  useEffect(() => {
    if (diabeticStats && diabeticStats.length > 0) {
      const totalBloodSugar = diabeticStats.reduce(
        (sum, entry) => sum + entry.bloodSugarLevel,
        0
      );
      const average = totalBloodSugar / diabeticStats.length;
      setAverageBloodSugarLevel(average);
    }
  }, [diabeticStats]);

  const data = {
    datasets: [
      {
        data: [averageBloodSugarLevel, 600 - averageBloodSugarLevel], // Assuming the max value is 600
        backgroundColor: ['#36A2EB', '#FF6384'], // Colors for the segments
      },
    ],
  };

  return (
    <div className="diabetic-stats-details">
      {diabeticStats ? (
        <>
          <h4>Diabetic Health Stats</h4>
          <p><strong>Blood Sugar Level (mg/dL): </strong>{diabeticStats.bloodSugarLevel}</p>
          <p className={diabeticStats.bloodSugarLevel > 200 ? 'high-sugar-level' : diabeticStats.bloodSugarLevel < 70 ? 'low-sugar-level' :diabeticStats.bloodSugarLevel > 600 ? "emergency-2" : 'normal-sugar-level'}><strong>Risk-Emerged:</strong>
            {diabeticStats.bloodSugarLevel > 200 ? "High Sugar level" : diabeticStats.bloodSugarLevel < 70 ? "Low Sugar level" : "Normal sugar level"}
          </p>
          <p className={diabeticStats.bloodSugarLevel > 200 ? 'Diabetes-melitus' : diabeticStats.bloodSugarLevel < 70 ? 'Hypoglycemia' : 'normal'}><strong>Diabetes Type: </strong>
            {diabeticStats.bloodSugarLevel > 200 ? "Diabetes mellitus(Type 1 or 2)(  Insulin shot recommended)" : diabeticStats.bloodSugarLevel < 70 ? "Hypoglycemia.(Give 3 jelly babies/150ml fruit juice...recommended)" : "None"}
          </p>
          <p><strong>Insulin Intake (units): </strong>{diabeticStats.insulinIntake}</p>
          <p><strong>Medication: </strong>{diabeticStats.medication}</p>
          <p><strong>Time: </strong>{format(new Date(diabeticStats.updatedAt), 'MMMM d, yyyy h:mm a')}</p>
          <button onClick={handleDelete}>Delete</button>
          <p><strong>Average Blood Sugar Level (mg/dL): </strong>{averageBloodSugarLevel}</p>
          <Doughnut
            data={data}
            options={{
              cutout: '70%', 
              legend: {
                display: false, 
              },
            }}
          />
          <button onClick={handleDelete}>Delete</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DiabeticStatsDetails;

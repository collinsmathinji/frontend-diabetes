import React, { useState, useEffect } from 'react';
import { useDiabeticContext } from '../hooks/DiabeticStatsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import low from "./low.jpg";
import { format } from 'date-fns';
import { Link } from 'react-router-dom';


const DiabeticStatsDetails = ({ stats }) => {
  const { dispatch } = useDiabeticContext();
  const { user } = useAuthContext();

  const [diabeticStats, setDiabeticStats] = useState(null);
 
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
            {diabeticStats.bloodSugarLevel > 200 ? "Diabetes mellitus(Type 1 or 2)(  Insulin shot recommended)" :  diabeticStats.bloodSugarLevel < 70
    ? (
        <>
          Hypoglycemia. (Give 3 jelly babies/150ml fruit juice...recommended) 
         </>
      ): "None"}
          </p>
          <p><strong>Insulin Intake (units): </strong>{diabeticStats.insulinIntake}</p>
          <p><strong>Medication: </strong>{diabeticStats.medication}</p>
          <p><strong>Time: </strong>{format(new Date(diabeticStats.updatedAt), 'MMMM d, yyyy h:mm a')}</p>
          <div className="buttons">
          <button onClick={handleDelete}>Delete</button>
          <button className={diabeticStats.bloodSugarLevel > 200 ? 'Diabetes-melitus' : diabeticStats.bloodSugarLevel < 70 ? 'Hypoglycemia' : 'normal'}><strong>Learn More: </strong>
            {diabeticStats.bloodSugarLevel > 200 ?  (
        <>
          <a href="https://www.healthdirect.gov.au/hyperglycaemia-high-blood-sugar#:~:text=you%20get%20sick-,Complications%20of%20hyperglycaemia,in%20your%20blood%20or%20urine" className="lowwer">
         More insight
          </a>
        </>
      ):  diabeticStats.bloodSugarLevel < 70
    ? (
        <>
          <a href="https://medlineplus.gov/ency/article/000386.htm#:~:text=Low%20blood%20sugar%20is%20a,low%20blood%20sugar%20is%20hypoglycemia." target="_blank" rel="noopener noreferrer" className="lowwer">
          More insight
          </a>
        </>
      ): (
        <>
          <a href="https://www.hsph.harvard.edu/nutritionsource/disease-prevention/diabetes-prevention/preventing-diabetes-full-story/" className="lowwer">
         Prevention
          </a>
        </>
      )}
        </button>
        </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
       
    </div>
  );
};

export default DiabeticStatsDetails;
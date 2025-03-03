import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoalsTracking = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    // Fetch goals data when the component mounts
    const fetchGoals = async () => {
      try {
        const response = await axios.get('/api/goals');
        setGoals(response.data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };

    fetchGoals();
  }, []);

  const addGoal = () => {
    // Add a new goal
    axios.post('/api/goals', { goal: newGoal })
      .then(() => {
        setGoals([...goals, { id: response.data.id, goal: newGoal }]);
        setNewGoal('');
      })
      .catch((error) => {
        console.error('Error adding goal:', error);
      });
  };

  const deleteGoal = (id) => {
    // Delete a goal
    axios.delete(`/api/goals/${id}`)
      .then(() => {
        setGoals(goals.filter((goal) => goal.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting goal:', error);
      });
  };

  return (
    <div className="goals-tracking-page">
      <h1>Goals Tracking</h1>
      <input
        type="text"
        placeholder="Add a new goal"
        value={newGoal}
        onChange={(e) => setNewGoal(e.target.value)}
      />
      <button onClick={addGoal}>Add Goal</button>
      <ul>
        {goals.map((goal) => (
          <li key={goal.id}>
            {goal.goal}
            <button onClick={() => deleteGoal(goal.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoalsTracking;

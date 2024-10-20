import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './evaluate.css';

const EvaluateRule = () => {
  const [rules, setRules] = useState([]);
  const [ruleName, setRuleName] = useState('');
  const [ruleString, setRuleString] = useState('');
  const [data, setData] = useState('');
  const [results, setResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all rules
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rules/getRules');
        setRules(response.data);
      } catch (error) {
        console.error('Error fetching rules:', error);
      }
    };
    fetchRules();
  }, []);

  // Fetch rule string by valid rule name
  const fetchRuleString = async (ruleName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/rules/byName/${encodeURIComponent(ruleName.trim())}`);
      setRuleString(response.data); // Set the fetched rule string
    } catch (error) {
      console.error('Error fetching rule string:', error);
      throw error;
    }
  };

  // Whenever ruleName changes, fetch the corresponding rule string
  useEffect(() => {
    if (ruleName) {
      fetchRuleString(ruleName);
    } else {
      setRuleString('');
    }
  }, [ruleName]);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setResults(null);
    setLoading(true);

    try {
      const parsedDataArray = JSON.parse(data);

      // Check if parsedDataArray is an array
      if (!Array.isArray(parsedDataArray)) {
        throw new Error('Data should be an array of objects.');
      }

      const response = await axios.post('http://localhost:5000/api/rules/evaluate', {
        ruleName,
        dataArray: parsedDataArray,
      });

      setResults(response.data.result);
    } catch (error) {
      console.error('Error evaluating rule:', error.response ? error.response.data : error.message);
      setErrorMessage(error.response ? error.response.data.message : 'An error occurred while evaluating the rule.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRuleName('');
    setRuleString('');
    setData('');
    setResults(null);
    setErrorMessage('');
  };

  return (
    <div className="evaluate-rule-container">
      <form className="evaluate-rule-form" onSubmit={handleEvaluate}>
        <h2>Evaluate Rule</h2>
        
        <select value={ruleName} onChange={(e) => setRuleName(e.target.value)} required>
          <option value="">Select Rule</option>
          {rules.map(rule => (
            <option key={rule._id} value={rule.name}>{rule.name}</option>
          ))}
        </select>
  
        {ruleString && (
          <div className="rule-string-container">
            <h3>Rule String:</h3>
            <pre>{JSON.stringify(ruleString, null, 2)}</pre>
          </div>
        )}
  
        <textarea
          placeholder='Data (JSON array format)'
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
          className="textarea-field"
        />
        
        {/* Button container for side-by-side buttons */}
        <div className="button-container">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Evaluating...' : 'Evaluate Rule'}
          </button>
          <button type="button" className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
  
      {errorMessage && <p className="error-message">{errorMessage}</p>}
  
      {results !== null && (
        <div className="results-container">
          <p className="overall-result-message">
            Overall Evaluation Result: {results ? 'True' : 'False'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EvaluateRule;

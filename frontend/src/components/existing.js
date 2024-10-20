

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './existing.css'; // Import the CSS file

// const CombineRules = () => {
//   const [rules, setRules] = useState([]);
//   const [selectedRuleNames, setSelectedRuleNames] = useState([]);
//   const [combinedAST, setCombinedAST] = useState(null);
//   const [combinedRules, setCombinedRules] = useState([]); // State to track combined rules

//   useEffect(() => {
//     const fetchRules = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/rules/getRules');
//         setRules(response.data);
//       } catch (error) {
//         console.error('Error fetching rules:', error);
//       }
//     };

//     fetchRules();
//   }, []);

//   const handleRuleSelection = (name) => {
//     setSelectedRuleNames((prevNames) =>
//       prevNames.includes(name) ? prevNames.filter((ruleName) => ruleName !== name) : [...prevNames, name]
//     );
//   };

//   // const handleCombineRules = async () => {
//   //   try {
//   //     const response = await axios.post('http://localhost:5000/api/rules/combine', {
//   //       ruleNames: selectedRuleNames,
//   //     });
      
//   //     const newCombinedAST = response.data.combinedAST; // Get the combined AST from the response

//   //     // Update the combined rules state
//   //     setCombinedRules((prev) => [...prev, { name: `Combined: ${selectedRuleNames.join(', ')}`, ast: newCombinedAST }]);
      
//   //     // Clear selected rules after combining
//   //     setSelectedRuleNames([]);
//   //   } catch (error) {
//   //     console.error('Error combining rules:', error);
//   //   }
//   // };



//   const handleCombineRules = async () => {
//     try {
//       const payload = { ruleNames: selectedRuleNames };
//       console.log('Payload:', payload); // Log the payload
  
//       const response = await axios.post('http://localhost:5000/api/rules/combine', payload);
//       const newCombinedAST = response.data.combinedAST;
//       setCombinedRules((prev) => [...prev, { name: `Combined: ${selectedRuleNames.join(', ')}`, ast: newCombinedAST }]);
//       setSelectedRuleNames([]);
//     } catch (error) {
//       console.error('Error combining rules:', error);
//     }
//   };
  

//   const handleReset = () => {
//     setSelectedRuleNames([]);
//     setCombinedAST(null);
//   };

//   // Function to render the AST in a tree-like structure with more details
//   const renderAST = (node) => {
//     if (!node) return null;

//     return (
//       <div className="ast-node" style={{ marginLeft: '20px' }}>
//         <div className="ast-node-type">{`Node Type: ${node.type}`}</div>
//         {node.value && <div>{`Value: ${node.value}`}</div>}
//         {node.children && node.children.length > 0 && (
//           <div className="ast-child">
//             <div style={{ fontStyle: 'italic', color: '#555' }}>Children:</div>
//             {node.children.map((child, index) => (
//               <div key={index}>{renderAST(child)}</div>
//             ))}
//           </div>
//         )}
//         {node.condition && <div>{`Condition: ${node.condition}`}</div>} {/* Example for conditional nodes */}
//         {node.operator && <div>{`Operator: ${node.operator}`}</div>} {/* Example for operator nodes */}
//       </div>
//     );
//   };

//   return (
//     <div className="container">
//       <h1>Combine Rules</h1>
//       <h2>Select Rules to Combine:</h2>
//       <ul>
//         {/* Render individual rules */}
//         {rules.map((rule) => (
//           <li key={rule.name}>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={selectedRuleNames.includes(rule.name)}
//                 onChange={() => handleRuleSelection(rule.name)}
//               />
//               {rule.name}
//             </label>
//           </li>
//         ))}

//         {/* Render combined rules */}
//         {combinedRules.map((combinedRule, index) => (
//           <li key={index}>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={selectedRuleNames.includes(combinedRule.name)}
//                 onChange={() => handleRuleSelection(combinedRule.name)}
//               />
//               {combinedRule.name}
//             </label>
//           </li>
//         ))}
//       </ul>

//       {/* Button container for side by side buttons */}
//       <div className="button-container">
//         <button onClick={handleCombineRules} disabled={selectedRuleNames.length < 2}>
//           Combine Selected Rules
//         </button>
//         <button onClick={handleReset}>
//           Reset
//         </button>
//       </div>

//       {combinedAST && (
//         <div className="combined-ast">
//           <h2>Combined AST:</h2>
//           <div>{renderAST(combinedAST)}</div> {/* Render the combined AST */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CombineRules;
















































import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './existing.css'; // Import the CSS file

const CombineRules = () => {
  const [rules, setRules] = useState([]);
  const [selectedRuleNames, setSelectedRuleNames] = useState([]);
  const [combinedAST, setCombinedAST] = useState(null);
  const [combinedRules, setCombinedRules] = useState([]); // State to track combined rules

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

  const handleRuleSelection = (name) => {
    setSelectedRuleNames((prevNames) =>
      prevNames.includes(name) ? prevNames.filter((ruleName) => ruleName !== name) : [...prevNames, name]
    );
  };

  const handleCombineRules = async () => {
    try {
      const payload = { ruleNames: selectedRuleNames };
      console.log('Payload:', payload); // Log the payload
  
      const response = await axios.post('http://localhost:5000/api/rules/combine', payload);
      const newCombinedAST = response.data.combinedAST;
      
      // Update the combined rules state
      setCombinedRules((prev) => [
        ...prev,
        {
          name: `Combined: ${selectedRuleNames.join(', ')}`,
          ast: newCombinedAST,
        },
      ]);
      
      // Clear selected rules after combining
      setSelectedRuleNames([]);
    } catch (error) {
      console.error('Error combining rules:', error);
    }
  };
  

  const handleReset = () => {
    setSelectedRuleNames([]);
    setCombinedAST(null);
  };

  // Function to render the AST in a tree-like structure with more details
  const renderAST = (node) => {
    if (!node) return null;

    return (
      <div className="ast-node" style={{ marginLeft: '20px' }}>
        <div className="ast-node-type">{`Node Type: ${node.type}`}</div>
        {node.value && <div>{`Value: ${node.value}`}</div>}
        {node.children && node.children.length > 0 && (
          <div className="ast-child">
            <div style={{ fontStyle: 'italic', color: '#555' }}>Children:</div>
            {node.children.map((child, index) => (
              <div key={index}>{renderAST(child)}</div>
            ))}
          </div>
        )}
        {node.condition && <div>{`Condition: ${node.condition}`}</div>} {/* Example for conditional nodes */}
        {node.operator && <div>{`Operator: ${node.operator}`}</div>} {/* Example for operator nodes */}
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Combine Rules</h1>
      <h2>Select Rules to Combine:</h2>
      <ul>
        {/* Render individual rules */}
        {rules.map((rule) => (
          <li key={rule.name}>
            <label>
              <input
                type="checkbox"
                checked={selectedRuleNames.includes(rule.name)}
                onChange={() => handleRuleSelection(rule.name)}
              />
              {rule.name}
            </label>
          </li>
        ))}

        {/* Render combined rules */}
        {combinedRules.map((combinedRule, index) => (
          <li key={index}>
            <label>
              <input
                type="checkbox"
                checked={selectedRuleNames.includes(combinedRule.name)}
                onChange={() => handleRuleSelection(combinedRule.name)}
              />
              {combinedRule.name}
            </label>
          </li>
        ))}
      </ul>

      {/* Button container for side by side buttons */}
      <div className="button-container">
        <button onClick={handleCombineRules} disabled={selectedRuleNames.length < 2}>
          Combine Selected Rules
        </button>
        <button onClick={handleReset}>
          Reset
        </button>
      </div>

      {combinedAST && (
        <div className="combined-ast">
          <h2>Combined AST:</h2>
          <div>{renderAST(combinedAST)}</div> {/* Render the combined AST */}
        </div>
      )}
    </div>
  );
};

export default CombineRules;

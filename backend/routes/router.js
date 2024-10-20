

const express = require('express');
const router = express.Router();
const { Rule } = require('../models/rule');
const { createRule, combineRules } = require('../controller/rulecontroller');
const mongoose = require('mongoose');



router.post('/', async (req, res) => {
  try {
    const { name, ruleString } = req.body;
    const ast = await createRule(ruleString); // Create the AST
    const rule = new Rule({ name, ast }); // Save rule with AST
    const savedRule = await rule.save();
    res.status(201).json(savedRule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Evaluate a rule
const evaluateRule = (ast, data) => {
  switch (ast.type) {
    case 'operand':
      return eval(ast.value.replace(/(\w+)/g, (match) => data[match]));
    case 'composite':
      if (ast.operator === 'AND') {
        return ast.children.every(child => evaluateRule(child, data));
      } else if (ast.operator === 'OR') {
        return ast.children.some(child => evaluateRule(child, data));
      }
      break;
    default:
      throw new Error('Unknown AST node type');
  }
};

// Evaluate rules based on their name
router.post('/evaluate', async (req, res) => {
  try {
    const { ruleName, dataArray } = req.body;

    // Fetch the rule from the database by name
    const rule = await Rule.findOne({ name: ruleName });
    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }

    // Check if dataArray is provided and is an array
    if (!Array.isArray(dataArray)) {
      return res.status(400).json({ message: 'Data array is required and should be an array.' });
    }

    // Check if all elements in dataArray are objects
    for (const data of dataArray) {
      if (typeof data !== 'object' || data === null) {
        return res.status(400).json({ message: 'Each data entry should be an object.' });
      }
    }

    // Log the entire fetched rule to check its structure
    console.log('Fetched rule:', rule);

    // Ensure that the AST is valid
    const ast = rule.ast;
    if (!ast) {
      return res.status(400).json({ message: 'Invalid rule format. Rule AST is required.' });
    }

    // Evaluate the rule for each data object
    const results = dataArray.map(data => {
      try {
        const result = evaluateRule(ast, data); // Ensure evaluateRule works with AST
        return {
          data,
          result: result !== undefined ? result : false,
        };
      } catch (error) {
        console.error('Error evaluating data:', error);
        return {
          data,
          result: false,
        };
      }
    });

    // Check if all results are true
    const allResults = results.every(r => r.result);

    // Respond with a single result indicating if all evaluations passed
    res.json({ result: allResults });

  } catch (error) {
    console.error('Error evaluating rule:', error);
    res.status(400).json({ result: false, message: 'Error during evaluation.' });
  }
});

// Get all rules
router.get('/getRules', async (req, res) => {
  try {
    const rules = await Rule.find(); // Fetch all rules from the database
    const ruleList = rules.map(rule => ({
      _id: rule._id, // Return _id and name
      name: rule.name,
    }));
    res.json(ruleList);
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch a specific rule by name
router.get('/byName/:name', async (req, res) => {
  const ruleName = req.params.name.trim(); // Remove leading/trailing whitespace

  console.log('Fetching rule with name:', ruleName);

  try {
    const rule = await Rule.findOne({ name: ruleName });

    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }

    res.json(rule);
  } catch (error) {
    console.error('Error fetching rule by name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Combine rules
router.post('/combine', async (req, res) => {
  const { ruleNames } = req.body;

  if (!Array.isArray(ruleNames) || ruleNames.length < 2) {
    return res.status(400).json({ message: 'At least two valid rule names are required.' });
  }

  try {
    // Fetch rules from the database
    const rules = await Rule.find({ name: { $in: ruleNames } });
    if (rules.length !== ruleNames.length) {
      return res.status(404).json({ message: 'One or more rules not found.' });
    }

    // Check if the selected rules are individual or combined
    const ruleStrings = rules.map(rule => rule.ast.value); // Get the AST values from the found rules

    // Combine the ASTs of the selected rules
    const combinedAST = await combineRules(ruleStrings);

    // Create a new combined rule entry
    const combinedRule = new Rule({
      ast: combinedAST,
      name: `Combined Rule: ${ruleNames.join(', ')}`,
      isCombined: true, // Indicate this rule is a combined rule
      combinedFrom: ruleNames // Save the names of the combined rules
    });

    const savedRule = await combinedRule.save();
    res.json({ combinedAST, combinedRuleId: savedRule._id }); // Return the combined AST and the new combined rule ID
  } catch (error) {
    console.error('Error combining rules:', error);
    res.status(500).json({ message: 'An error occurred while combining rules.' });
  }
});


module.exports = router;

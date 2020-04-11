/**
 * @fileoverview An ESLint plugin for those people, who forget to restore their spies after the test run.
 * @author Alperen Turkoz
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce to call the mockRestore function in jest spies.",
      category: "Fill me in",
      recommended: false,
      suggestion: false,
      url: "https://github.com/alperen/eslint-restore-spies"
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
    messages: {
      callMockRestoreFunction: '{{variableName}}.restoreMock() expression should call to restore mocks.'
    },
  },

  create: function (context) {
    const CONSTANTS = {
      PROGRAM: "Program",
      EXPRESSION_STATEMENT: "ExpressionStatement",
      CALL_STATEMENT: "CallExpression",
      JEST_OBJECT: "jest",
      SPYON_PROPERTY: "spyOn",
      MOCKRESTORE_PROPERTY: "mockRestore",
      AST_SELECTOR: "VariableDeclaration > VariableDeclarator > CallExpression",
    }

    function findNodeVariableDeclartionNode(sourceNode) {
      return sourceNode.parent.parent.parent;
    }

    function findProgramNode(sourceVariableDeclarationNode) {
      let currentNode = sourceVariableDeclarationNode;

      while (currentNode.type != CONSTANTS.PROGRAM) {
        currentNode = currentNode.parent;
      }

      return currentNode;
    }

    function filterExpressionStatementsFromProgramBody(bodyObject) {
      return bodyObject.filter(node => node.type == CONSTANTS.EXPRESSION_STATEMENT);
    }

    function filterCallExpressionsFromNodes(nodes) {
      return nodes.filter(node => node.expression.type == CONSTANTS.CALL_STATEMENT).map(node => node.expression);
    }

    function getCalleEntriesFromCallExpressions(callExpressionNodes) {
      return callExpressionNodes
        .map(node => {
          const { callee } = node;
          const { object = {}, property = {} } = callee;
          const { name: objectName = "" } = object;
          const { name: propertyName = "" } = property;

          return [objectName, propertyName];
        })
        .filter(candidateCallExpression => candidateCallExpression[0] && candidateCallExpression[1]);
    }

    return {
      [CONSTANTS.AST_SELECTOR]: function(node) {
        const { callee } = node;
        const { object, property } = callee;
        const objectName = object.name || undefined;
        const propertyName = property.name || undefined;
  
        if (objectName != CONSTANTS.JEST_OBJECT && propertyName != CONSTANTS.SPYON_PROPERTY) {
          return;
        }
  
        const variableDeclarationNode = node.parent;
        const variableName = variableDeclarationNode.id.name;

        const programNode = findProgramNode(variableDeclarationNode);
        const { body } = programNode;
        const expressionStatements = filterExpressionStatementsFromProgramBody(body);
        const callExpressions = filterCallExpressionsFromNodes(expressionStatements);
        const calleEntries = getCalleEntriesFromCallExpressions(callExpressions);
        const hasMockRestoreCalled = calleEntries.some(([object, property]) => object == variableName && property == CONSTANTS.MOCKRESTORE_PROPERTY);
  
        if (!hasMockRestoreCalled) {
          context.report({
            node: variableDeclarationNode, 
            messageId: 'callMockRestoreFunction',
            data: {
              variableName
            }
          });
        }
      }
    };
  }
};

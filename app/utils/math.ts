export const validateExpression = (expression: string): boolean => {
  if (!expression.trim()) return false

  try {
    // Check for balanced parentheses
    let parentheses = 0
    for (const char of expression) {
      if (char === "(") parentheses++
      if (char === ")") parentheses--
      if (parentheses < 0) return false
    }
    if (parentheses !== 0) return false

    // Check for invalid operator sequences
    if (/[+\-*/]{2,}/.test(expression)) return false

    // Check for valid characters
    const validChars = /^[0-9x+\-*/^().,\s]+$/
    if (!validChars.test(expression)) return false

    // Attempt to evaluate the expression (for basic syntax check)
    // Replace 'x' with a number to allow evaluation
    const testExpression = expression.replace(/x/g, "1")
    new Function(`return ${testExpression}`)()

    return true
  } catch (error) {
    console.error("Error in validateExpression:", error)
    return false
  }
}

export const formatExpression = (expression: string): string => {
  return expression
    .replace(/\b(pi|π)\b/g, "π")
    .replace(/\b(infinity|inf)\b/g, "∞")
    .replace(/\*\*/g, "^")
    .trim()
}

export const EXAMPLE_EXPRESSIONS = [
  { expression: "x^2 + 2x + 1", description: "Quadratic equation" },
  { expression: "sin(x)", description: "Sine wave" },
  { expression: "e^x", description: "Exponential growth" },
  { expression: "log(x)", description: "Natural logarithm" },
  { expression: "1/x", description: "Reciprocal function" },
]

export const MATHEMATICAL_CONSTANTS = [
  { symbol: "π", value: "pi", description: "Pi (3.14159...)" },
  { symbol: "e", value: "e", description: "Euler's number (2.71828...)" },
  { symbol: "φ", value: "(1 + sqrt(5))/2", description: "Golden ratio (1.61803...)" },
  { symbol: "∞", value: "infinity", description: "Infinity" },
]


"use client"

import { useEffect, useRef } from "react"

interface DesmosCalculatorProps {
  expression: string
  isDarkMode: boolean
}

declare global {
  interface Window {
    Desmos: any
  }
}

export function DesmosCalculator({ expression, isDarkMode }: DesmosCalculatorProps) {
  const calculatorRef = useRef<HTMLDivElement>(null)
  const calculatorInstance = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && calculatorRef.current) {
      const script = document.createElement("script")
      script.src = "https://www.desmos.com/api/v1.10/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
      script.async = true
      script.onload = () => {
        if (calculatorRef.current) {
          calculatorInstance.current = window.Desmos.GraphingCalculator(calculatorRef.current, {
            expressions: false,
            settingsMenu: false,
            zoomButtons: false,
            lockViewport: false,
            border: false,
            invertedColors: isDarkMode,
          })
        }
      }
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [isDarkMode])

  useEffect(() => {
    if (calculatorInstance.current && expression) {
      try {
        // Parse the expression to handle different types of mathematical operations
        let graphExpression = expression

        // Check if the expression is a basic arithmetic operation
        if (expression.includes(",")) {
          const [a, b] = expression.split(",").map((part) => part.trim())
          graphExpression = `y=${a}${b}`
        }
        // Check if the expression is a trigonometric function
        else if (expression.includes("sin") || expression.includes("cos") || expression.includes("tan")) {
          graphExpression = `y=${expression}`
        }
        // Check if the expression is an equation
        else if (!expression.includes("=") && !expression.includes("y")) {
          graphExpression = `y=${expression}`
        }

        calculatorInstance.current.setExpression({ id: "graph1", latex: graphExpression })
        calculatorInstance.current.setMathBounds({
          left: -10,
          right: 10,
          bottom: -10,
          top: 10,
        })
      } catch (error) {
        console.error("Error setting Desmos expression:", error)
      }
    }
  }, [expression])

  useEffect(() => {
    if (calculatorInstance.current) {
      calculatorInstance.current.updateSettings({ invertedColors: isDarkMode })
    }
  }, [isDarkMode])

  return <div ref={calculatorRef} className="w-full h-[400px]" />
}


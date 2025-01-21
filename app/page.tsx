"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, ChevronDown, ChevronUp, Moon, Sun, History, Download, Share, Keyboard } from "lucide-react"
import { WizardHatLogo } from "./components/WizardHatLogo"
import { DesmosCalculator } from "./components/DesmosCalculator"
import { LatexRenderer } from "./components/LatexRenderer"
import { TextToSpeech } from "./components/TextToSpeech"
import { MathKeypad } from "./components/MathKeypad"
import { MathInput } from "./components/MathInput"
import { ExamplesDrawer } from "./components/ExamplesDrawer"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatExpression } from "./utils/math"
import { validateExpression } from "./utils/math"

const operations = [
  { value: "simplify", label: "Simplify", description: "Simplify the expression" },
  { value: "factor", label: "Factor", description: "Factor the expression" },
  { value: "derive", label: "Derive", description: "Calculate the derivative of the expression" },
  { value: "integrate", label: "Integrate", description: "Calculate the integral of the expression" },
  { value: "zeroes", label: "Find Zeroes", description: "Find the zeroes of the expression" },
  { value: "tangent", label: "Find Tangent", description: "Find the tangent line to the expression at a point" },
  { value: "area", label: "Area Under Curve", description: "Calculate the area under the curve for the expression" },
  { value: "cos", label: "Cosine", description: "Calculate the cosine of the expression" },
  { value: "sin", label: "Sine", description: "Calculate the sine of the expression" },
  { value: "tan", label: "Tangent", description: "Calculate the tangent of the expression" },
  { value: "arccos", label: "Inverse Cosine", description: "Calculate the inverse cosine of the expression" },
  { value: "arcsin", label: "Inverse Sine", description: "Calculate the inverse sine of the expression" },
  { value: "arctan", label: "Inverse Tangent", description: "Calculate the inverse tangent of the expression" },
  { value: "abs", label: "Absolute Value", description: "Calculate the absolute value of the expression" },
  { value: "log", label: "Logarithm", description: "Calculate the logarithm of the expression" },
]

export default function Page() {
  const [expression, setExpression] = useState("")
  const [latexExpression, setLatexExpression] = useState("")
  const [operation, setOperation] = useState("simplify")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showGraph, setShowGraph] = useState(false)
  const [history, setHistory] = useState<Array<{ expression: string; operation: string; result: string }>>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showMathKeypad, setShowMathKeypad] = useState(false)

  useEffect(() => {
    const savedHistory = localStorage.getItem("mathWizardHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
    const savedDarkMode = localStorage.getItem("mathWizardDarkMode")
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode))
      if (JSON.parse(savedDarkMode)) {
        document.documentElement.classList.add("dark")
      }
    }
  }, [])

  const handleOperation = async () => {
    setIsLoading(true)
    setError("")
    setResult("")

    if (!validateExpression(expression)) {
      setError("Invalid expression. Please check your input.")
      setIsLoading(false)
      return
    }

    try {
      const encodedExpression = encodeURIComponent(expression)
      const response = await fetch(`https://newton.now.sh/api/v2/${operation}/${encodedExpression}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.result) {
        setResult(data.result)
        setLatexExpression(data.result)
        const newHistoryItem = { expression, operation, result: data.result }
        const updatedHistory = [newHistoryItem, ...history.slice(0, 9)]
        setHistory(updatedHistory)
        localStorage.setItem("mathWizardHistory", JSON.stringify(updatedHistory))
      } else {
        setError("Unable to perform the operation. Please check your input.")
      }
    } catch (err) {
      console.error("Error in handleOperation:", err)
      setError(err instanceof Error ? err.message : "An error occurred while fetching the result")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("mathWizardDarkMode", JSON.stringify(newDarkMode))
  }

  const handleTemplateSelect = useCallback((template: string) => {
    setExpression((prev) => prev + template)
  }, [])

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-gradient-to-br ${
        isDarkMode ? "from-gray-900 via-purple-900 to-violet-900" : "from-purple-400 via-pink-500 to-red-500"
      } p-4 transition-colors duration-500`}
    >
      <Card
        className={`w-full max-w-2xl shadow-lg ${isDarkMode ? "bg-gray-800/90" : "bg-white/90"} backdrop-blur-sm transition-colors duration-500`}
      >
        <CardHeader className="text-center">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <div className="flex justify-center items-center w-12 h-12">
              <WizardHatLogo />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowGraph(!showGraph)}>
              <History className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </div>
          <CardTitle className={`text-3xl font-bold ${isDarkMode ? "text-purple-300" : "text-purple-800"}`}>
            Math Wizard
          </CardTitle>
          <CardDescription className={`${isDarkMode ? "text-pink-300" : "text-pink-600"}`}>
            Enter a magical expression to analyze and visualize
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <ExamplesDrawer onSelect={setExpression} isDarkMode={isDarkMode} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const data = {
                    expression,
                    operation,
                    result,
                    timestamp: new Date().toISOString(),
                  }
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "math-expression.json"
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(expression)
                }}
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowMathKeypad(!showMathKeypad)}
                className="flex-shrink-0"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
              <MathInput
                value={expression}
                onChange={setExpression}
                isDarkMode={isDarkMode}
                placeholder="Enter expression (e.g., x^2-1 or sin(x))"
                className="flex-1"
              />
            </div>
            {showMathKeypad && (
              <MathKeypad
                onInput={(value) =>
                  setExpression((prev) => {
                    const newExpression = prev + value
                    return formatExpression(newExpression)
                  })
                }
                isDarkMode={isDarkMode}
                onClose={() => setShowMathKeypad(false)}
              />
            )}

            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Select value={operation} onValueChange={setOperation}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select operation" />
                      </SelectTrigger>
                      <SelectContent>
                        {operations.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{operations.find((op) => op.value === operation)?.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleOperation}
                disabled={isLoading || !expression}
                className={`flex-1 ${
                  isDarkMode
                    ? `bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-800 hover:to-pink-800`
                    : `bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600`
                } focus:ring-purple-500 text-white`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Casting Spell...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowGraph(!showGraph)}
                className={`${
                  isDarkMode
                    ? `bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-800 hover:to-pink-800`
                    : `bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600`
                } focus:ring-purple-400 text-white`}
              >
                {showGraph ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                {showGraph ? "Hide Graph" : "Show Graph"}
              </Button>
            </div>
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`${isDarkMode ? "bg-gradient-to-r from-purple-900 to-pink-900 border-purple-700" : "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200"}`}
                  >
                    <CardHeader>
                      <CardTitle className={`text-lg ${isDarkMode ? "text-purple-300" : "text-purple-800"}`}>
                        Result:
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className={`${isDarkMode ? "text-pink-300" : "text-pink-700"} font-mono mb-2`}>{result}</p>
                        <TextToSpeech text={result} />
                      </div>
                      <LatexRenderer latex={latexExpression} />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            {error && <p className="text-red-500 font-semibold">{error}</p>}
            <AnimatePresence>
              {showGraph && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`${isDarkMode ? "bg-gradient-to-r from-blue-900 to-cyan-900 border-blue-700" : "bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-200"}`}
                  >
                    <CardHeader>
                      <CardTitle className={`text-lg ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}>
                        Graph:
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DesmosCalculator expression={expression} isDarkMode={isDarkMode} />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"}`}>
                    <CardHeader>
                      <CardTitle className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}>
                        History:
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {history.map((item, index) => (
                          <li key={index} className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            <span className="font-semibold">
                              {operations.find((op) => op.value === item.operation)?.label}:
                            </span>{" "}
                            {item.expression} = {item.result}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


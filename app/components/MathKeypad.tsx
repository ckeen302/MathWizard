"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MATHEMATICAL_CONSTANTS } from "../utils/math"

interface MathKeypadProps {
  onInput: (value: string) => void
  isDarkMode: boolean
  onClose: () => void
}

export function MathKeypad({ onInput, isDarkMode, onClose }: MathKeypadProps) {
  const [activeTab, setActiveTab] = useState("basic")

  const basicSymbols = [
    { label: "x", value: "x" },
    { label: "y", value: "y" },
    { label: "a²", value: "^2" },
    { label: "aᵇ", value: "^" },
    { label: "(", value: "(" },
    { label: ")", value: ")" },
    { label: "<", value: "<" },
    { label: ">", value: ">" },
    { label: "|a|", value: "abs(" },
    { label: "√", value: "sqrt(" },
    ...MATHEMATICAL_CONSTANTS.map((c) => ({ label: c.symbol, value: c.value })),
  ]

  const numbers = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+"]

  const functions = {
    "TRIG FUNCTIONS": [
      { label: "sin", value: "sin(" },
      { label: "cos", value: "cos(" },
      { label: "tan", value: "tan(" },
      { label: "csc", value: "csc(" },
      { label: "sec", value: "sec(" },
      { label: "cot", value: "cot(" },
    ],
    "INVERSE TRIG": [
      { label: "sin⁻¹", value: "arcsin(" },
      { label: "cos⁻¹", value: "arccos(" },
      { label: "tan⁻¹", value: "arctan(" },
      { label: "csc⁻¹", value: "arccsc(" },
      { label: "sec⁻¹", value: "arcsec(" },
      { label: "cot⁻¹", value: "arccot(" },
    ],
    CALCULUS: [
      { label: "∫", value: "integrate(" },
      { label: "d/dx", value: "derive(" },
      { label: "lim", value: "limit(" },
      { label: "∑", value: "sum(" },
      { label: "∏", value: "product(" },
    ],
    STATISTICS: [
      { label: "μ", value: "mean(" },
      { label: "σ", value: "std(" },
      { label: "var", value: "var(" },
      { label: "med", value: "median(" },
      { label: "mode", value: "mode(" },
    ],
  }

  const templates = [
    { label: "x²", value: "x^2" },
    { label: "ax² + bx + c", value: "a*x^2 + b*x + c" },
    { label: "sin(x)", value: "sin(x)" },
    { label: "e^x", value: "e^x" },
    { label: "log(x)", value: "log(x)" },
    { label: "√x", value: "sqrt(x)" },
  ]

  const handleInput = (value: string) => {
    let processedValue = value
    switch (value) {
      case "×":
        processedValue = "*"
        break
      case "÷":
        processedValue = "/"
        break
      case "−":
        processedValue = "-"
        break
    }
    onInput(processedValue)
  }

  return (
    <Card className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>Math Keypad</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between">
          <Tabs defaultValue="basic" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-4 gap-1">
                {basicSymbols.map((symbol) => (
                  <TooltipProvider key={symbol.value}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInput(symbol.value)}
                          className={`font-mono ${
                            isDarkMode
                              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {symbol.label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {MATHEMATICAL_CONSTANTS.find((c) => c.value === symbol.value)?.description || symbol.label}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-1">
                {numbers.map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    size="sm"
                    onClick={() => handleInput(num)}
                    className={`font-mono ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced">
              <ScrollArea className="h-[300px] pr-4">
                {Object.entries(functions).map(([category, items]) => (
                  <div key={category} className="mb-4">
                    <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {category}
                    </h3>
                    <div className="grid grid-cols-3 gap-1">
                      {items.map((item) => (
                        <Button
                          key={item.value}
                          variant="outline"
                          size="sm"
                          onClick={() => handleInput(item.value)}
                          className={`font-mono ${
                            isDarkMode
                              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                Quick Templates
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid grid-cols-2 gap-2">
                {templates.map((template) => (
                  <Button
                    key={template.value}
                    variant="outline"
                    size="sm"
                    onClick={() => handleInput(template.value)}
                    className="justify-start"
                  >
                    {template.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Card>
  )
}


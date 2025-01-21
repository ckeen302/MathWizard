"use client"

import { useRef, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { LatexRenderer } from "./LatexRenderer"
import { validateExpression } from "../utils/math"
import katex from "katex"

interface MathInputProps {
  value: string
  onChange: (value: string) => void
  isDarkMode: boolean
  placeholder?: string
  className?: string
}

export function MathInput({ value, onChange, isDarkMode, placeholder, className }: MathInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [cursorPosition, setCursorPosition] = useState<number>(0)
  const [isValid, setIsValid] = useState(true)
  const [isTouched, setIsTouched] = useState(false)

  useEffect(() => {
    if (value.trim() === "") {
      setIsValid(true)
      return
    }

    const isValid = validateExpression(value)
    setIsValid(isValid)

    if (isValid) {
      try {
        const latexExpression = `$$${value}$$`
        katex.render(latexExpression, document.createElement("div"), {
          throwOnError: false,
          strict: false,
        })
      } catch (error) {
        console.error("Error validating LaTeX:", error)
        setIsValid(false)
      }
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const pos = inputRef.current?.selectionStart || 0
      const newValue = value.slice(0, pos) + "  " + value.slice(pos)
      onChange(newValue)
      setTimeout(() => {
        inputRef.current?.setSelectionRange(pos + 2, pos + 2)
      }, 0)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    setCursorPosition(e.target.selectionStart || 0)
    if (!isTouched) {
      setIsTouched(true)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`font-mono ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
          } ${!isValid && isTouched ? "border-red-500" : ""}`}
          aria-invalid={!isValid && isTouched}
        />
        {!isValid && isTouched && value.trim() !== "" && (
          <p className="text-red-500 text-sm mt-1">Invalid expression. Please check your syntax.</p>
        )}
      </div>
      {value && (
        <Card className={`p-2 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <p className="text-sm text-muted-foreground mb-1">Preview:</p>
          <LatexRenderer latex={value} />
        </Card>
      )}
    </div>
  )
}


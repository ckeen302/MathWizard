"use client"

import { useEffect, useRef } from "react"
import katex from "katex"

interface LatexRendererProps {
  latex: string
}

export function LatexRenderer({ latex }: LatexRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(latex, containerRef.current, {
          throwOnError: false,
          displayMode: true,
          strict: false,
        })
      } catch (error) {
        console.error("Error rendering LaTeX:", error)
        containerRef.current.textContent = "Error rendering LaTeX"
      }
    }
  }, [latex])

  return <div ref={containerRef} />
}


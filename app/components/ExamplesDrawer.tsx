"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { EXAMPLE_EXPRESSIONS } from "../utils/math"
import { BookOpen } from "lucide-react"

interface ExamplesDrawerProps {
  onSelect: (expression: string) => void
  isDarkMode: boolean
}

export function ExamplesDrawer({ onSelect, isDarkMode }: ExamplesDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <BookOpen className="w-4 h-4 mr-2" />
          Examples & Tutorials
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Examples & Tutorials</SheetTitle>
          <SheetDescription>Click on an example to try it out</SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <div className="space-y-4">
            {EXAMPLE_EXPRESSIONS.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start"
                onClick={() => onSelect(example.expression)}
              >
                <div className="text-left">
                  <p className="font-mono">{example.expression}</p>
                  <p className="text-sm text-muted-foreground">{example.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}


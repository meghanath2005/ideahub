'use client'
import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MindmapProps {
  diagram: string
}

export default function Mindmap({ diagram }: MindmapProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false })
    if (ref.current) {
      mermaid
        .render('diagram', diagram)
        .then(({ svg }) => {
          if (ref.current) ref.current.innerHTML = svg
        })
        .catch(() => {})
    }
  }, [diagram])

  const downloadSVG = () => {
    if (!ref.current) return
    const blob = new Blob([ref.current.innerHTML], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mindmap.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div ref={ref} />
      <button onClick={downloadSVG} className="mt-2 rounded bg-blue-500 px-3 py-1 text-white">
        Download as SVG
      </button>
    </div>
  )
}

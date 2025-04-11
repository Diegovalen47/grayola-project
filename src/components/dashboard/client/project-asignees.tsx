'use client'

export function ProjectAsignees({ asignees }: { asignees: { id: string, email: string }[] }) {

  
  if (!asignees || asignees.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2 overflow-hidden">
        {asignees.slice(0, 2).map((asignee, index) => (
          <div
            key={index}
            className="relative inline-block h-8 w-8 rounded-full border-2 border-background ring-0"
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium">
              {asignee.email.slice(0, 2).toUpperCase()}
            </div>
          </div>
        ))}
        {asignees.length > 2 && (
          <div className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
            +{asignees.length - 2}
          </div>
        )}
      </div>
      <div className="text-xs text-primary/50">
        {asignees.length > 1 ? "are working on this project" : "is working on this project"}
      </div>
    </div>
  )
}
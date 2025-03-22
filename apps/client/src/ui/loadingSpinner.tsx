export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-primary/20"></div>
        <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-t-2 border-l-2 border-primary animate-spin"></div>
      </div>
    </div>
  )
}


// src/components/Spinner/Spinner.tsx
export default function Spinner() {
  return (
    <div className="flex justify-center items-center p-6">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500" />
      <span className="ml-2 text-gray-600">Carregando...</span>
    </div>
  )
}

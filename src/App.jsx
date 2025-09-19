import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import ErrorBoundary from "@/components/ErrorBoundary"

function App() {
  console.log('🎵 Suno App component loaded');
  
  return (
    <ErrorBoundary>
      <Pages />
      <Toaster />
    </ErrorBoundary>
  )
}

export default App 
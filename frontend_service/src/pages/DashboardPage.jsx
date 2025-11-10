import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import GraphView from '../components/GraphView'
import SearchBar from '../components/SearchBar'
import PopupPanel from '../components/PopupPanel'
import CourseModal from '../components/CourseModal'
import apiService from '../services/apiService'

export default function DashboardPage() {
  const [selectedNode, setSelectedNode] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalCourse, setModalCourse] = useState(null)
  const [modalTab, setModalTab] = useState('theory')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleNodeClick = (node, nodeId) => {
    setSelectedNode(node)
    setIsPopupOpen(true)
  }

  const handlePopupClose = () => {
    setIsPopupOpen(false)
    setSelectedNode(null)
  }

  const handleOptionClick = async (node, optionId) => {
    // Find course by node label
    try {
      const courses = await apiService.getMyCourses()
      const course = courses.find(c => c.title === node.label || c.topic === node.label)
      
      if (course) {
        setModalCourse(course)
        setModalTab(optionId === 'theory' ? 'theory' : optionId === 'video' ? 'materials' : 'practice')
        setIsModalOpen(true)
        setIsPopupOpen(false)
      } else {
        // Create mock course data
        setModalCourse({
          id: Math.random(),
          title: node.label,
          topic: node.label,
          summary: `Курс по теме "${node.label}". Изучите все необходимые навыки и знания.`,
          tests: [],
          videos: [],
          categories: [node.label]
        })
        setModalTab(optionId === 'theory' ? 'theory' : optionId === 'video' ? 'materials' : 'practice')
        setIsModalOpen(true)
        setIsPopupOpen(false)
      }
    } catch (error) {
      console.error('Error loading course:', error)
    }
  }

  const handleSearch = async (query) => {
    setIsGenerating(true)
    try {
      const newCourse = await apiService.generateCourse(query)
      // Reload page to show new course in graph
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error('Error generating course:', error)
      setIsGenerating(false)
    }
  }

  const handleGenerate = () => {
    // Focus search input or show generate modal
    const input = document.querySelector('input[placeholder="Изучить..."]')
    if (input) {
      input.focus()
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <div className="flex pt-12">
        <Sidebar />
        <main className="flex-1 ml-sidebar p-8">
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} onGenerate={handleGenerate} />

          {/* Graph View - Central Element */}
          <div className="h-[calc(100vh-12rem)] relative">
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm z-20 rounded-2xl">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-2 border-text-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-text-secondary">Генерация курса...</p>
                </div>
              </div>
            )}
            <GraphView onNodeClick={handleNodeClick} />
          </div>
        </main>
      </div>

      {/* Popup Panel */}
      <PopupPanel
        node={selectedNode}
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        onOptionClick={handleOptionClick}
      />

      {/* Course Modal */}
      {isModalOpen && modalCourse && (
        <CourseModal
          course={modalCourse}
          activeTab={modalTab}
          onClose={() => {
            setIsModalOpen(false)
            setModalCourse(null)
            setModalTab('theory')
          }}
        />
      )}
    </div>
  )
}


import { useEffect, useRef, useState } from 'react'
// vis-network will be loaded dynamically

export default function GraphView({ onNodeClick }) {
  const containerRef = useRef(null)
  const networkRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadVisNetwork()
  }, [])

  const loadVisNetworkLibrary = () => {
    return new Promise((resolve, reject) => {
      if (typeof vis !== 'undefined') {
        resolve()
        return
      }

      // Load CSS
      if (!document.querySelector('link[href*="vis-network"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/vis-network/styles/vis-network.min.css'
        document.head.appendChild(link)
      }

      // Load JS
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/vis-network/standalone/umd/vis-network.min.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load vis-network'))
      document.head.appendChild(script)
    })
  }

  const loadVisNetwork = async () => {
    try {
      await loadVisNetworkLibrary()
      await loadGraphData()
    } catch (err) {
      console.error('Error loading graph:', err)
      setError('Не удалось загрузить граф знаний')
      setLoading(false)
    }
  }

  const loadGraphData = async () => {
    try {
      const { default: apiService } = await import('../services/apiService')
      const data = await apiService.getCourseGraph()
      buildGraph(data)
    } catch (err) {
      console.error('Error loading graph data:', err)
      setError('Не удалось загрузить данные графа')
      setLoading(false)
    }
  }

  const buildGraph = async (data) => {
    if (!containerRef.current) return

    // Load vis-network if not already loaded
    if (typeof vis === 'undefined') {
      await loadVisNetworkLibrary()
    }

    const { nodes: graphNodes, edges: graphEdges } = data

    // Convert nodes for vis-network
    const visNodes = graphNodes.map((node) => ({
      id: node.id,
      label: node.label,
      title: node.label,
      level: node.level || 0,
      shape: node.type === 'user' ? 'icon' : 'dot',
      size: node.type === 'user' ? 60 : node.level === 1 ? 40 : 30,
      color: {
        border: '#ffffff',
        background: node.type === 'user' ? '#1a1a1a' : '#2a2a2a',
        highlight: {
          border: '#ffffff',
          background: '#333333'
        },
        hover: {
          border: '#ffffff',
          background: '#3a3a3a'
        }
      },
      font: {
        size: node.type === 'user' ? 16 : 14,
        color: '#ffffff',
        face: 'Inter'
      },
      borderWidth: 2,
      borderWidthSelected: 4
    }))

    // Convert edges for vis-network
    const visEdges = graphEdges.map((edge, index) => ({
      id: `e${index}`,
      from: edge.from,
      to: edge.to,
      color: {
        color: 'rgba(255, 255, 255, 0.2)',
        highlight: '#ffffff',
        hover: '#ffffff'
      },
      width: 2,
      smooth: {
        type: 'continuous',
        roundness: 0.5
      }
    }))

    const graphData = {
      nodes: visNodes,
      edges: visEdges
    }

    const options = {
      nodes: {
        shape: 'dot',
        font: {
          size: 14,
          color: '#ffffff',
          face: 'Inter'
        },
        borderWidth: 2,
        borderWidthSelected: 4,
        shadow: false
      },
      edges: {
        width: 2,
        color: {
          color: 'rgba(255, 255, 255, 0.2)',
          highlight: '#ffffff',
          hover: '#ffffff'
        },
        smooth: {
          type: 'continuous',
          roundness: 0.5
        },
        shadow: false
      },
      physics: {
        enabled: true,
        stabilization: {
          iterations: 200
        },
        barnesHut: {
          gravitationalConstant: -8000,
          springConstant: 0.001,
          springLength: 200,
          damping: 0.09
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        navigationButtons: false,
        keyboard: true,
        zoomView: true,
        dragView: true
      },
      layout: {
        improvedLayout: true
      }
    }

    const network = new vis.Network(containerRef.current, graphData, options)

    // Event handlers
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0]
        const node = visNodes.find(n => n.id === nodeId)
        if (node && onNodeClick) {
          onNodeClick(node, nodeId)
        }
      }
    })

    network.on('stabilizationEnd', () => {
      setLoading(false)
    })

    networkRef.current = network

    // Handle window resize
    const handleResize = () => {
      if (networkRef.current) {
        networkRef.current.fit()
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (networkRef.current) {
        networkRef.current.destroy()
      }
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-secondary">{error}</div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-bg-primary rounded-2xl overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-text-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-text-secondary">Загрузка графа знаний...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}


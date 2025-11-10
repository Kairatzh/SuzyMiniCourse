// Graph View Component (2D Visualization with vis-network)
export class GraphView {
    constructor() {
        this.network = null;
        this.nodes = null;
        this.edges = null;
        this.container = null;
    }

    render() {
        return `
            <div class="graph-container" id="graphContainer">
                <div class="graph-loading" id="graphLoading">
                    <div class="spinner"></div>
                    <p>Загрузка графа знаний...</p>
                </div>
                <div class="graph-canvas" id="graphCanvas"></div>
                <div class="graph-controls">
                    <button class="control-btn" id="resetViewBtn" title="Сбросить вид">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                        </svg>
                    </button>
                    <button class="control-btn" id="centerViewBtn" title="Центрировать">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
                        </svg>
                    </button>
                    <button class="control-btn" id="physicsToggleBtn" title="Переключить физику">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M12,4A1,1 0 0,0 11,5V11A1,1 0 0,0 12,12A1,1 0 0,0 13,11V5A1,1 0 0,0 12,4M2,13C2,15.76 3.14,18.26 5,20A1.5,1.5 0 1,0 8,19.76A8.016,8.016 0 0,1 3.5,13A8.016,8.016 0 0,1 8,6.24A1.5,1.5 0 1,0 5,6A8,8 0 0,0 2,13M22,13C22,15.76 20.86,18.26 19,20A1.5,1.5 0 1,1 16,19.76A8.016,8.016 0 0,0 20.5,13A8.016,8.016 0 0,0 16,6.24A1.5,1.5 0 1,1 19,6A8,8 0 0,1 22,13Z"/>
                        </svg>
                    </button>
                    <button class="control-btn" id="fullScreenBtn" title="Полный экран">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                        </svg>
                    </button>
                </div>
                <div class="graph-info">
                    <span id="nodeCount">0</span> узлов, <span id="edgeCount">0</span> связей
                </div>
            </div>
        `;
    }

    mount(parent) {
        const template = document.createElement('template');
        template.innerHTML = this.render();
        this.element = template.content.firstElementChild;
        parent.appendChild(this.element);
        this.container = this.element;
        
        // Load vis-network dynamically
        this.initGraph();
    }

    unmount() {
        if (this.network) {
            this.network.destroy();
            this.network = null;
        }
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    async initGraph() {
        try {
            // Check if vis-network is loaded
            if (typeof vis === 'undefined') {
                await this.loadVisNetwork();
            }
            this.setupGraph();
            await this.loadGraphData();
        } catch (error) {
            console.error('Error initializing graph:', error);
            this.showError('Не удалось загрузить граф знаний');
        }
    }

    loadVisNetwork() {
        return new Promise((resolve, reject) => {
            if (typeof vis !== 'undefined') {
                resolve();
                return;
            }

            // Load vis-network CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/vis-network/styles/vis-network.min.css';
            document.head.appendChild(link);

            // Load vis-network JS
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/vis-network/standalone/umd/vis-network.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load vis-network'));
            document.head.appendChild(script);
        });
    }

    setupGraph() {
        const canvas = this.container.querySelector('#graphCanvas');
        this.nodes = new vis.DataSet([]);
        this.edges = new vis.DataSet([]);

        // Configure options for dark theme
        const options = {
            nodes: {
                shape: 'dot',
                size: 20,
                font: {
                    size: 14,
                    color: '#ffffff',
                    face: 'Inter',
                    align: 'center'
                },
                borderWidth: 2,
                borderWidthSelected: 4,
                shadow: {
                    enabled: false
                },
                color: {
                    border: '#ffffff',
                    background: '#1a1a1a',
                    highlight: {
                        border: '#ffffff',
                        background: '#222222'
                    },
                    hover: {
                        border: '#ffffff',
                        background: '#333333'
                    }
                }
            },
            edges: {
                width: 2,
                color: {
                    color: '#888888',
                    highlight: '#ffffff',
                    hover: '#ffffff'
                },
                arrows: {
                    to: {
                        enabled: false
                    }
                },
                smooth: {
                    type: 'continuous',
                    forceDirection: 'none',
                    roundness: 0.5
                },
                shadow: {
                    enabled: false
                }
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
        };

        const data = {
            nodes: this.nodes,
            edges: this.edges
        };

        this.network = new vis.Network(canvas, data, options);

        // Attach event handlers
        this.attachEvents();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.network.fit();
        });
    }

    attachEvents() {
        const canvas = this.container.querySelector('#graphCanvas');
        const resetBtn = this.container.querySelector('#resetViewBtn');
        const centerBtn = this.container.querySelector('#centerViewBtn');
        const physicsBtn = this.container.querySelector('#physicsToggleBtn');
        const fullScreenBtn = this.container.querySelector('#fullScreenBtn');

        let physicsEnabled = true;

        resetBtn.addEventListener('click', () => {
            this.network.fit({ animation: true });
        });

        centerBtn.addEventListener('click', () => {
            this.network.focus(0, { animation: true });
        });

        physicsBtn.addEventListener('click', () => {
            physicsEnabled = !physicsEnabled;
            this.network.setOptions({
                physics: { enabled: physicsEnabled }
            });
            physicsBtn.classList.toggle('active', !physicsEnabled);
        });

        fullScreenBtn.addEventListener('click', () => {
            if (canvas.requestFullscreen) {
                canvas.requestFullscreen();
            } else if (canvas.webkitRequestFullscreen) {
                canvas.webkitRequestFullscreen();
            } else if (canvas.msRequestFullscreen) {
                canvas.msRequestFullscreen();
            }
        });

        // Show detailed course info on click
        this.network.on('click', (params) => {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const node = this.nodes.get(nodeId);
                this.showCourseDetails(node, nodeId);
            }
        });

        // Update stats on stabilization
        this.network.on('stabilizationEnd', () => {
            this.updateStats();
        });
    }

    async loadGraphData() {
        try {
            const { default: ApiService } = await import('../services/api.service.js');
            const data = await ApiService.getCourseGraph();
            
            this.container.querySelector('#graphLoading').style.display = 'none';
            this.buildGraph(data);
        } catch (error) {
            console.error('Error loading graph data:', error);
            this.container.querySelector('#graphLoading').style.display = 'none';
            this.showError('Не удалось загрузить данные графа');
        }
    }

    buildGraph(data) {
        const { nodes: graphNodes, edges: graphEdges } = data;

        // Convert nodes format for vis-network
        const visNodes = graphNodes.map((node, index) => ({
            id: index,
            label: node.label || `Node ${index}`,
            title: node.label || '',
            level: node.level || 0
        }));

        // Convert edges format for vis-network
        const visEdges = graphEdges.map((edge, index) => ({
            id: `e${index}`,
            from: edge.from,
            to: edge.to,
            title: ''
        }));

        this.nodes.clear();
        this.edges.clear();
        this.nodes.add(visNodes);
        this.edges.add(visEdges);

        // Update stats
        this.updateStats();

        // Fit network after data is loaded
        setTimeout(() => {
            this.network.fit({ animation: true });
        }, 100);
    }

    updateStats() {
        const nodeCount = this.nodes.length;
        const edgeCount = this.edges.length;
        
        this.container.querySelector('#nodeCount').textContent = nodeCount;
        this.container.querySelector('#edgeCount').textContent = edgeCount;
    }

    async showCourseDetails(node, nodeId) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'course-modal-overlay';
        modal.innerHTML = `
            <div class="course-modal">
                <div class="course-modal-header">
                    <h2>${node.label}</h2>
                    <button class="modal-close-btn" id="modalClose">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                <div class="course-modal-content" id="modalContent">
                    <div class="loading-state">Загрузка информации...</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal handlers
        const closeBtn = modal.querySelector('#modalClose');
        const closeModal = () => {
            modal.classList.add('closing');
            setTimeout(() => modal.remove(), 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Load course details
        try {
            const { default: ApiService } = await import('../services/api.service.js');
            const courses = await ApiService.getMyCourses();
            
            // Find matching course or use mock data
            const course = courses.find(c => c.title === node.label) || this.createMockCourseData(node);
            
            this.renderCourseModalContent(modal.querySelector('#modalContent'), course);
        } catch (error) {
            console.error('Error loading course details:', error);
            modal.querySelector('#modalContent').innerHTML = `
                <div class="error-state">
                    <p>Не удалось загрузить информацию о курсе</p>
                </div>
            `;
        }
        
        // Show modal with animation
        setTimeout(() => modal.classList.add('visible'), 10);
    }
    
    createMockCourseData(node) {
        return {
            id: Math.floor(Math.random() * 1000),
            title: node.label,
            topic: node.label,
            summary: `Полный курс по теме "${node.label}". Освойте все необходимые навыки и знания для профессионального развития в этой области.`,
            tests: [
                {
                    question: `Основной вопрос о ${node.label}`,
                    options: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
                    correct_answer: "Вариант 1"
                },
                {
                    question: `Продвинутый вопрос о ${node.label}`,
                    options: ["Вариант A", "Вариант B", "Вариант C"],
                    correct_answer: "Вариант C"
                }
            ],
            videos: [
                "https://youtube.com/watch?v=demo1",
                "https://youtube.com/watch?v=demo2"
            ],
            categories: [node.label]
        };
    }
    
    renderCourseModalContent(content, course) {
        content.innerHTML = `
            <div class="course-detail-tabs">
                <div class="tab-buttons">
                    <button class="tab-btn active" data-tab="theory">📚 Теория</button>
                    <button class="tab-btn" data-tab="practice">🎯 Практика</button>
                    <button class="tab-btn" data-tab="materials">📎 Материалы</button>
                </div>
                
                <div class="tab-content active" data-content="theory">
                    <div class="theory-section">
                        <h3>Описание курса</h3>
                        <p class="course-description">${course.summary}</p>
                        <div class="course-meta-grid">
                            <div class="meta-item">
                                <span class="meta-label">Категория:</span>
                                <span class="meta-value">${course.categories.join(', ')}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Темы:</span>
                                <span class="meta-value">${course.topic}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" data-content="practice">
                    <div class="practice-section">
                        <h3>Тесты и задания</h3>
                        ${course.tests && course.tests.length > 0 ? `
                            <div class="tests-container">
                                ${course.tests.map((test, idx) => `
                                    <div class="test-card">
                                        <div class="test-header">
                                            <span class="test-number">Вопрос ${idx + 1}</span>
                                            <span class="test-difficulty">Средний</span>
                                        </div>
                                        <p class="test-question">${test.question}</p>
                                        <div class="test-options">
                                            ${test.options.map((opt, optIdx) => `
                                                <div class="option-item">
                                                    <span class="option-letter">${String.fromCharCode(65 + optIdx)}</span>
                                                    <span class="option-text">${opt}</span>
                                                </div>
                                            `).join('')}
                                        </div>
                                        <div class="correct-answer-badge">
                                            ✓ Правильный ответ: ${test.correct_answer}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<p class="no-data">Тесты пока не добавлены</p>'}
                    </div>
                </div>
                
                <div class="tab-content" data-content="materials">
                    <div class="materials-section">
                        <h3>Дополнительные материалы</h3>
                        ${course.videos && course.videos.length > 0 ? `
                            <div class="videos-grid">
                                ${course.videos.map((url, idx) => `
                                    <div class="video-card">
                                        <div class="video-thumbnail">
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </div>
                                        <div class="video-info">
                                            <h4>Видео ${idx + 1}</h4>
                                            <a href="${url}" target="_blank" class="video-link">Смотреть видео →</a>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<p class="no-data">Видео материалы пока не добавлены</p>'}
                    </div>
                </div>
            </div>
        `;
        
        // Attach tab switching
        const tabBtns = content.querySelectorAll('.tab-btn');
        const tabContents = content.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));
                
                btn.classList.add('active');
                content.querySelector(`[data-content="${targetTab}"]`).classList.add('active');
            });
        });
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'graph-error';
        errorDiv.textContent = message;
        this.container.appendChild(errorDiv);
    }
}

export default GraphView;

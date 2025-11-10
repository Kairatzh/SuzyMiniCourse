import { useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

export default function CommunityPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Alex Petrov',
      avatar: 'A',
      title: 'Лучшие практики изучения Python',
      content: 'Хочу поделиться своим опытом изучения Python. Начните с основ и постепенно переходите к сложным концепциям...',
      tags: ['Python', 'Обучение'],
      likes: 24,
      comments: 8,
      time: '2 часа назад',
      liked: false
    },
    {
      id: 2,
      author: 'Maria Ivanova',
      avatar: 'M',
      title: 'Новый курс по Machine Learning',
      content: 'Только что опубликовал новый курс по основам машинного обучения. Все материалы на русском языке...',
      tags: ['Machine Learning', 'Курс'],
      likes: 42,
      comments: 15,
      time: '5 часов назад',
      liked: true
    },
    {
      id: 3,
      author: 'Dmitry Volkov',
      avatar: 'D',
      title: 'Вопрос по нейронным сетям',
      content: 'Не могу понять разницу между forward propagation и backpropagation. Кто может объяснить?',
      tags: ['AI', 'Вопрос'],
      likes: 18,
      comments: 12,
      time: '1 день назад',
      liked: false
    }
  ])

  const toggleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <div className="flex pt-12">
        <Sidebar />
        <main className="flex-1 ml-sidebar p-8 max-w-6xl">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-bg-card border border-border-color rounded-xl p-6">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-2xl font-bold text-text-primary mb-1">1,234</div>
              <div className="text-sm text-text-secondary">Активных участников</div>
            </div>
            <div className="bg-bg-card border border-border-color rounded-xl p-6">
              <div className="text-4xl mb-2">💬</div>
              <div className="text-2xl font-bold text-text-primary mb-1">567</div>
              <div className="text-sm text-text-secondary">Обсуждений</div>
            </div>
            <div className="bg-bg-card border border-border-color rounded-xl p-6">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-2xl font-bold text-text-primary mb-1">89</div>
              <div className="text-sm text-text-secondary">Опубликованных курсов</div>
            </div>
          </div>

          {/* Posts */}
          <div className="bg-bg-card border border-border-color rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Последние обсуждения</h2>
              <button className="px-4 py-2 bg-text-primary text-bg-primary rounded-lg hover:bg-text-secondary transition-colors text-sm font-medium">
                Новый пост
              </button>
            </div>

            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-bg-secondary border border-border-color rounded-xl p-6 hover:border-border-hover transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-bg-card border border-border-color rounded-full flex items-center justify-center font-bold text-text-primary">
                      {post.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-text-primary">{post.author}</div>
                      <div className="text-sm text-text-tertiary">{post.time}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">{post.title}</h3>
                  <p className="text-text-secondary mb-4 leading-relaxed">{post.content}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-bg-card border border-border-color rounded-lg text-sm text-text-secondary">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 pt-4 border-t border-border-color">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        post.liked
                          ? 'text-red-500 hover:bg-red-500/10'
                          : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={post.liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Поделиться
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


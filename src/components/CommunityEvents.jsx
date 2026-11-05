import React, { useState } from 'react';
import { 
  Users, MessageSquare, ThumbsUp, Calendar, MapPin, 
  Sparkles, CheckCircle2, PlusCircle, ShieldAlert, Award, ArrowRight, Share2 
} from 'lucide-react';
import { COMMUNITY_POSTS, UPCOMING_EVENTS } from '../data/communityData';
import { TRANSLATIONS } from '../data/languages';
import PageBanner from './PageBanner';

export default function CommunityEvents({ currentLang }) {
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [events, setEvents] = useState(UPCOMING_EVENTS);
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'events'
  
  // New Post Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCrop, setPostCrop] = useState('Tomato');
  const [postCategory, setPostCategory] = useState('Question / Advice Needed');

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleLike = (id) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + 1, hasLiked: true };
      }
      return p;
    }));
  };

  const handleRSVP = (id) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === id) {
        return { ...ev, rsvps: ev.rsvps + 1, hasRsvp: true };
      }
      return ev;
    }));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const newPostObj = {
      id: 'post-' + Date.now(),
      author: 'Ravi Kumar (You)',
      role: 'Farmer (Shivamogga, KA)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      title: postTitle,
      category: postCategory,
      crop: postCrop,
      district: 'Shivamogga, KA',
      timestamp: 'Just now',
      likes: 1,
      commentsCount: 0,
      content: postContent,
      expertAnswer: null,
      image: null
    };

    setPosts([newPostObj, ...posts]);
    setPostTitle('');
    setPostContent('');
    setIsPostModalOpen(false);
  };

  const filteredPosts = posts.filter(p => 
    selectedCropFilter === 'All' || p.crop === selectedCropFilter
  );

  return (
    <>
      {/* High-Impact Photographic Page Hero Banner */}
      <PageBanner
        badgeIcon={Users}
        badgeText="Farmer Peer Network • Verified Agronomist Q&A in Local Dialects"
        badgeColor="purple"
        title={t.commTitle || "Farmer Community"}
        titleHighlight="& Krishi Vigyan Network"
        description={t.commDesc || "Connect with 50,000+ progressive Indian farmers, share real field experiences, get answers from University extension scientists, and attend regional field training workshops."}
        breadcrumbs={[
          { label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
          { label: 'Farmer Community & Workshops' }
        ]}
        imageSrc="/assets/images/farmer_community_hero.jpg"
        imageAlt="Group of Indian farmers at Krishi training center"
        imageBadgeText="50,000+ Active Farmers"
        floatingStat={{
          label: 'Avg Expert Answer Time',
          value: '< 20 Mins',
          icon: MessageSquare
        }}
        stats={[
          { value: '50,000+', label: 'Verified Farmers', subtext: 'Pan-India Network' },
          { value: '180+ KVKs', label: 'Extension Scientists', subtext: 'ICAR Verified' },
          { value: '6 Languages', label: 'Local Dialects', subtext: 'Kannada, Hindi, etc.' },
          { value: 'Weekly', label: 'Field Workshops', subtext: 'Hands-On Training' }
        ]}
        primaryAction={{
          label: t.btnPostQuestion || 'Ask a Farmer Question',
          onClick: () => setIsPostModalOpen(true),
          icon: PlusCircle
        }}
        secondaryAction={{
          label: 'Explore KVK Workshops',
          onClick: () => setActiveTab('events'),
          icon: Calendar
        }}
        quickChips={[
          { id: 'feed', label: '💬 Community Feed & Q&A' },
          { id: 'events', label: '📅 KVK Field Workshops' }
        ]}
        activeChip={activeTab}
        onChipClick={(tab) => setActiveTab(tab)}
      />

      <div className="section-pad">
        <div className="container">

        {/* Top Switcher Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '28px' }}>
          <button
            onClick={() => setActiveTab('feed')}
            className={`btn ${activeTab === 'feed' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '10px 24px' }}
          >
            <MessageSquare size={16} />
            <span>Farmer Discussions & Q&A ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '10px 24px' }}
          >
            <Calendar size={16} />
            <span>Workshops & Training Events ({events.length})</span>
          </button>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="btn btn-amber"
            style={{ borderRadius: 'var(--radius-full)', padding: '10px 20px', marginLeft: 'auto' }}
          >
            <PlusCircle size={16} />
            <span>Ask Question or Share Story</span>
          </button>
        </div>

        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div>
            {/* Filter by Crop Category */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '20px' }}>
              {['All', 'Tomato', 'Coffee', 'Paddy', 'Millets', 'Chilli', 'Arecanut', 'Onion', 'Mushroom'].map(crop => (
                <button
                  key={crop}
                  onClick={() => setSelectedCropFilter(crop)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: selectedCropFilter === crop ? 'var(--primary-600)' : 'var(--slate-200)',
                    background: selectedCropFilter === crop ? 'var(--primary-100)' : '#fff',
                    color: selectedCropFilter === crop ? 'var(--primary-800)' : 'var(--dark-700)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {crop === 'All' ? 'All Crop Discussions' : `${crop} Growers`}
                </button>
              ))}
            </div>

            {/* Posts Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '840px', margin: '0 auto' }}>
              {filteredPosts.map((post) => (
                <div key={post.id} className="glass-card" style={{ padding: '24px' }}>
                  {/* Author Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={post.avatar} 
                        alt={post.author} 
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/images/farmer_harvest.jpg';
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--dark-900)' }}>{post.author}</div>
                        <small style={{ color: 'var(--slate-400)', fontSize: '0.74rem' }}>{post.role} • {post.timestamp}</small>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="badge badge-green">{post.crop}</span>
                      <span className="badge badge-amber">{post.category}</span>
                    </div>
                  </div>

                  {/* Post Title & Content */}
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--dark-900)' }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--dark-700)', lineHeight: 1.6, marginBottom: '16px' }}>
                    {post.content}
                  </p>

                  {/* Post Image if attached */}
                  {post.image && (
                    <div style={{ borderRadius: '12px', overflow: 'hidden', maxHeight: '340px', marginBottom: '16px' }}>
                      <img 
                        src={post.image} 
                        alt="Crop demonstration" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/images/crop_biomass_hero.jpg';
                        }}
                      />
                    </div>
                  )}

                  {/* Verified Agronomist Answer Box */}
                  {post.expertAnswer && (
                    <div style={{ background: '#ecfdf5', border: '1.5px solid #10b981', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <Award size={18} color="#059669" />
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#065f46' }}>
                          {post.expertAnswer.expertName}
                        </span>
                        <span className="badge badge-green" style={{ fontSize: '0.64rem', padding: '2px 8px' }}>
                          Verified Scientist
                        </span>
                      </div>
                      <p style={{ fontSize: '0.86rem', color: '#047857', lineHeight: 1.55 }}>
                        {post.expertAnswer.text}
                      </p>
                    </div>
                  )}

                  {/* Bottom Likes & Engagement Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--slate-100)' }}>
                    <div style={{ display: 'flex', gap: '14px' }}>
                      <button
                        onClick={() => handleLike(post.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: post.hasLiked ? 'var(--primary-100)' : 'transparent',
                          color: post.hasLiked ? 'var(--primary-800)' : 'var(--slate-600)',
                          border: '1px solid',
                          borderColor: post.hasLiked ? 'var(--primary-400)' : 'var(--slate-200)',
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          fontWeight: 600
                        }}
                      >
                        <ThumbsUp size={14} />
                        <span>{post.likes} Helpful</span>
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--slate-400)' }}>
                        <MessageSquare size={14} />
                        <span>{post.commentsCount} Comments</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert('Link copied to clipboard to share with fellow farmers!')}
                      style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                    >
                      <Share2 size={14} />
                      <span>Share Post</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
            {events.map((ev) => (
              <div key={ev.id} className="glass-card glass-card-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <span className="badge badge-amber">{ev.mode}</span>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                    {ev.date}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--dark-900)' }}>
                  {ev.title}
                </h3>

                <small style={{ color: 'var(--slate-600)', fontSize: '0.78rem', marginBottom: '12px', display: 'block' }}>
                  Organized by: <strong>{ev.organizer}</strong>
                </small>

                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--primary-700)" />
                    <span>{ev.location}</span>
                  </div>
                  <div>• Time: {ev.time}</div>
                  <div>• Fee: <strong>{ev.fee}</strong></div>
                </div>

                <div style={{ marginBottom: '16px', flex: 1 }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--dark-800)', marginBottom: '4px' }}>Key Curriculum Topics:</div>
                  <ul style={{ listStyle: 'none', fontSize: '0.78rem', color: 'var(--slate-600)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {ev.topics.map((top, idx) => (
                      <li key={idx}>• {top}</li>
                    ))}
                  </ul>
                </div>

                {/* RSVP progress */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--slate-600)', marginBottom: '4px' }}>
                    <span>Seats Booked: {ev.rsvps} / {ev.maxSeats}</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>{ev.maxSeats - ev.rsvps} Spots Left</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--slate-200)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(ev.rsvps / ev.maxSeats) * 100}%`, height: '100%', background: 'var(--primary-600)', borderRadius: '3px' }} />
                  </div>
                </div>

                <button
                  onClick={() => handleRSVP(ev.id)}
                  disabled={ev.hasRsvp}
                  className={`btn ${ev.hasRsvp ? 'btn-outline' : 'btn-primary'}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Calendar size={15} />
                  <span>{ev.hasRsvp ? '✓ Confirmed Free Registration' : 'Register for Free Seat'}</span>
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* New Post Modal */}
      {isPostModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsPostModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlusCircle size={22} color="var(--primary-800)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Create Community Discussion Post</h3>
                <small style={{ color: 'var(--slate-600)' }}>Share your field experience or ask a question to fellow farmers</small>
              </div>
            </div>

            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Post Title:</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g., How to protect Arecanut nuts from sudden premature dropping?"
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Crop Category:</label>
                  <select
                    value={postCrop}
                    onChange={(e) => setPostCrop(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', background: '#fff' }}
                  >
                    <option value="Tomato">Tomato</option>
                    <option value="Coffee">Coffee</option>
                    <option value="Paddy">Paddy / Rice</option>
                    <option value="Arecanut">Arecanut</option>
                    <option value="Millets">Millets</option>
                    <option value="Chilli">Chilli</option>
                    <option value="Mushroom">Mushroom</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Post Type:</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', background: '#fff' }}
                  >
                    <option value="Question / Advice Needed">Question / Advice Needed</option>
                    <option value="Success Story">Success Story</option>
                    <option value="Waste to Wealth">Waste to Wealth</option>
                    <option value="Disease Alert">Disease Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Detailed Description:</label>
                <textarea
                  rows="4"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Describe your soil, crop age, symptoms or what technique you tested..."
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '0.74rem', color: 'var(--slate-600)' }}>
                ℹ️ <strong>Civil Assembly & Moderation:</strong> All posts are reviewed by agricultural extension moderators to prevent commercial spam or misinformation.
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Publish to Community Feed
                </button>
                <button type="button" onClick={() => setIsPostModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
    </>
  );
}

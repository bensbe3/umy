import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Actualite, Article, ArticleCategory, ContactSubmission } from '../../lib/supabase';
import { Plus, Edit, Trash2, Save, X, LogIn, FileText, Newspaper, Mail, CheckCircle, Clock, Archive } from 'lucide-react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageUpload } from '../ImageUpload';
import './CachePostPage.css';

/**
 * CachePostPage - Admin interface for managing content
 * 
 * Role-based access:
 * - Editor: Can create/edit/delete their own DecryptMundi articles
 * - Super Admin (commission-specific): Can manage actualités for their commission
 * - Super Admin (full): Can manage all actualités AND all articles
 */
export function CachePostPage() {
  const { user, appUser, loading: authLoading, signIn } = useAuth();
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Mark page as admin (for security bypass)
  useEffect(() => {
    document.body.setAttribute('data-admin-page', 'true');
    return () => {
      document.body.removeAttribute('data-admin-page');
    };
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('=== CachePostPage State ===');
    console.log('authLoading:', authLoading);
    console.log('user:', user?.id, user?.email);
    console.log('appUser:', appUser);
    console.log('=========================');
  }, [user, appUser, authLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!email || !password) {
      setLoginError('Please enter email and password');
      return;
    }

    setLoginLoading(true);
    try {
      await signIn(email, password);
      toast.success('Logged in successfully!');
      // Wait a moment for profile to load
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRefreshProfile = async () => {
    if (!user || !supabase) return;
    
    toast.info('Checking for profile...');
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('Manual profile check:', { data, error });
      
      if (error) {
        if (error.code === 'PGRST116') {
          toast.error('No profile found in database. Please run the SQL to assign a role.');
        } else {
          toast.error(`Database error: ${error.message}`);
        }
      } else if (data) {
        toast.success('Profile found! Refreshing page...');
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err: any) {
      console.error('Profile check error:', err);
      toast.error(err.message);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="cache-post-page">
        <div className="posting-interface">
          <div className="container">
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in - show login form
  if (!user) {
    return (
      <div className="cache-post-page">
        {/* Add spacer for fixed header */}
        <div className="header__spacer"></div>
        <div className="login-container">
          <div className="login-card">
            <h1>Admin Access</h1>
            <p>Sign in to manage content</p>
            
            {loginError && (
              <div className="error-message">
                {loginError}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <button type="submit" className="login-button" disabled={loginLoading}>
                <LogIn size={18} />
                {loginLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Logged in but no profile - show access denied message
  if (!appUser) {
    return (
      <div className="cache-post-page">
        <div className="header__spacer"></div>
        <div className="posting-interface">
          <div className="container">
            <div className="access-denied">
              <h1>⚠️ No Role Assigned</h1>
              <p>Your account ({user?.email}) doesn't have a role assigned yet.</p>
              <p>An administrator needs to assign you a role in the database.</p>
              
              <button onClick={handleRefreshProfile} className="refresh-button">
                🔄 Check Again
              </button>
              
              <div className="access-denied-info">
                <h3>For Administrators:</h3>
                <p>To assign a role to this user, run this SQL in Supabase:</p>
                <pre>
{`INSERT INTO users (id, role, commissions_role)
SELECT id, 'super_admin', 'full'
FROM auth.users
WHERE email = '${user?.email || 'user@example.com'}'
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin', 
    commissions_role = 'full';`}
                </pre>
                <p className="access-hint">
                  Replace <code>'super_admin'</code> with <code>'editor'</code> if needed.<br/>
                  Replace <code>'full'</code> with <code>'ir'</code>, <code>'mp'</code>, or <code>'sd'</code> for specific commissions.
                </p>
                
                <div className="debug-info">
                  <h4>Debug Info (Press F12 to see console):</h4>
                  <ul>
                    <li>User ID: <code>{user?.id}</code></li>
                    <li>Email: <code>{user?.email}</code></li>
                    <li>appUser: <code>{appUser ? JSON.stringify(appUser) : 'null'}</code></li>
                    <li>authLoading: <code>{authLoading.toString()}</code></li>
                  </ul>
                  <p style={{marginTop: '1rem', fontSize: '0.9rem'}}>
                    Check the browser console (F12) for detailed logs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged in with profile - show main interface
  return <ContentManagementInterface />;
}

/**
 * Main content management interface
 * Handles both Actualités and DecryptMundi Articles
 */
function ContentManagementInterface() {
  const { user, appUser } = useAuth();
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor states
  const [showActualiteEditor, setShowActualiteEditor] = useState(false);
  const [showArticleEditor, setShowArticleEditor] = useState(false);
  const [editingActualite, setEditingActualite] = useState<Actualite | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
  // Persist draft when switching tab/page so content is not lost
  const [draftActualite, setDraftActualite] = useState<{
    commissionId: 'ir' | 'mp' | 'sd' | 'orientation';
    title: string;
    content: string;
    imageUrl: string;
    status: 'draft' | 'published';
  } | null>(null);
  const [draftArticle, setDraftArticle] = useState<{
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImageUrl: string;
    featuredImageUrl: string;
    authorName: string;
    authorBio: string;
    editorName: string;
    category: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    readTimeMinutes: number;
    isFeatured: boolean;
    status: 'draft' | 'published';
  } | null>(null);
  
  // Post type selector
  const [showPostTypeSelector, setShowPostTypeSelector] = useState(false);
  
  // Contact submission view
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);

  // Determine user capabilities
  const isEditor = appUser?.role === 'editor';
  const isSuperAdmin = appUser?.role === 'super_admin';
  const hasFullAccess = isSuperAdmin && appUser?.commissions_role === 'full';
  const canManageActualites = isSuperAdmin && appUser?.commissions_role;
  const canManageArticles = isEditor || hasFullAccess;
  const canViewContacts = hasFullAccess;

  const [activeTab, setActiveTab] = useState<'actualites' | 'articles' | 'contacts'>('actualites');
  
  // Set default tab based on user permissions when appUser loads
  useEffect(() => {
    if (canManageActualites) {
      setActiveTab('actualites');
    } else if (canManageArticles) {
      setActiveTab('articles');
    } else if (canViewContacts) {
      setActiveTab('contacts');
    }
  }, [canManageActualites, canManageArticles, canViewContacts]);

  // Commission info (orientation = News & Actualities only, not shown on commission pages)
  const commissions = [
    { id: 'ir' as const, name: 'International Relations', color: '#0ea5e9' },
    { id: 'mp' as const, name: 'Moroccan Politics', color: '#dc2626' },
    { id: 'sd' as const, name: 'Social Development', color: '#16a34a' },
    { id: 'orientation' as const, name: 'Orientation (News & Actualities only)', color: '#6366f1' }
  ];

  const allowedCommissions = !canManageActualites ? [] :
    appUser.commissions_role === 'full'
      ? commissions
      : commissions.filter(c => c.id === appUser.commissions_role);

  // Debug permissions
  useEffect(() => {
    console.log('=== ContentManagementInterface Permissions ===');
    console.log('appUser:', appUser);
    console.log('isEditor:', isEditor);
    console.log('isSuperAdmin:', isSuperAdmin);
    console.log('hasFullAccess:', hasFullAccess);
    console.log('canManageActualites:', canManageActualites);
    console.log('canManageArticles:', canManageArticles);
    console.log('canViewContacts:', canViewContacts);
    console.log('activeTab:', activeTab);
    console.log('actualites.length:', actualites.length);
    console.log('articles.length:', articles.length);
    console.log('===========================================');
  }, [appUser, canManageActualites, canManageArticles, canViewContacts, activeTab, actualites.length, articles.length]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [appUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        canManageActualites ? fetchActualites() : Promise.resolve(),
        canManageArticles ? fetchArticles() : Promise.resolve(),
        canViewContacts ? fetchContactSubmissions() : Promise.resolve()
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchContactSubmissions = async () => {
    if (!supabase || !canViewContacts) return;
    
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setContactSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      toast.error('Failed to load contact submissions');
    }
  };

  const fetchActualites = async () => {
    if (!supabase || !canManageActualites) return;
    
    try {
      let query = supabase
        .from('commission_actualites')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Filter by commission if not full access
      if (appUser?.commissions_role && appUser.commissions_role !== 'full') {
        query = query.eq('commission_id', appUser.commissions_role);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      setActualites(data || []);
    } catch (error) {
      console.error('Error fetching actualités:', error);
      toast.error('Failed to load actualités');
    }
  };

  const fetchArticles = async () => {
    if (!supabase || !canManageArticles) return;
    
    try {
      let query = supabase
        .from('decryptmundi_articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Editors can only see their own articles
      if (isEditor && user) {
        query = query.eq('author_id', user.id);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load articles');
    }
  };

  const handleNewPost = () => {
    // If user can only manage one type, go directly to editor
    if (canManageActualites && !canManageArticles) {
      setEditingActualite(null);
      setShowActualiteEditor(true);
    } else if (canManageArticles && !canManageActualites) {
      setEditingArticle(null);
      setShowArticleEditor(true);
    } else {
      // Show selector if user can manage both
      setShowPostTypeSelector(true);
    }
  };

  const handleSelectPostType = (type: 'actualite' | 'article') => {
    setShowPostTypeSelector(false);
    if (type === 'actualite') {
      setEditingActualite(null);
      setShowActualiteEditor(true);
      setActiveTab('actualites');
    } else {
      setEditingArticle(null);
      setShowArticleEditor(true);
      setActiveTab('articles');
    }
  };

  const handleEditActualite = (actualite: Actualite) => {
    setEditingActualite(actualite);
    setShowActualiteEditor(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setShowArticleEditor(true);
  };

  const handleDeleteActualite = async (id: string, commissionId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    if (!supabase) return;

    // Check permissions
    if (!hasFullAccess && appUser?.commissions_role !== commissionId) {
      toast.error('You can only delete posts from your assigned commission');
      return;
    }

    try {
      const { error } = await supabase
        .from('commission_actualites')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Post deleted');
      fetchActualites();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete post');
    }
  };

  const handleDeleteArticle = async (id: string, authorId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    if (!supabase || !user) return;

    // Check permissions
    if (!hasFullAccess && authorId !== user.id) {
      toast.error('You can only delete your own articles');
      return;
    }

    try {
      const { error } = await supabase
        .from('decryptmundi_articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Article deleted');
      fetchArticles();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete article');
    }
  };

  if (loading) {
    return (
      <div className="cache-post-page">
        <div className="posting-interface">
          <div className="container">
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading content...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cache-post-page">
      <div className="posting-interface">
        <div className="container">
          {/* Header */}
          <div className="interface-header">
            <div>
              <h1>Content Management</h1>
              {appUser?.commissions_role && (
                <p className="commission-info">
                  Access: {appUser.commissions_role === 'full'
                    ? 'Full Access (All Commissions + Articles)'
                    : isEditor
                      ? 'Editor (DecryptMundi Articles)'
                      : `Commission ${commissions.find(c => c.id === appUser.commissions_role)?.name || appUser.commissions_role}`}
                </p>
              )}
            </div>
            <button onClick={handleNewPost} className="new-post-button">
              <Plus size={18} />
              Create Post
            </button>
          </div>

          {/* Post Type Selector Modal */}
          {showPostTypeSelector && (
            <div className="post-type-selector-overlay" onClick={() => setShowPostTypeSelector(false)}>
              <div className="post-type-selector" onClick={(e) => e.stopPropagation()}>
                <h2>Choose Post Type</h2>
                <div className="post-type-options">
                  {canManageActualites && (
                    <div className="post-type-card" onClick={() => handleSelectPostType('actualite')}>
                      <Newspaper size={48} />
                      <h3>Actualité</h3>
                      <p>Commission news and updates</p>
                    </div>
                  )}
                  {canManageArticles && (
                    <div className="post-type-card" onClick={() => handleSelectPostType('article')}>
                      <FileText size={48} />
                      <h3>DecryptMundi Article</h3>
                      <p>Long-form articles and analysis</p>
                    </div>
                  )}
                </div>
                <button className="cancel-selector-button" onClick={() => setShowPostTypeSelector(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Tabs - Always visible so user can switch tab without losing draft (draft is saved in parent) */}
          {(canManageActualites || canManageArticles || canViewContacts) && (
            <div className="content-tabs">
              {canManageActualites && (
                <button
                  className={activeTab === 'actualites' ? 'active' : ''}
                  onClick={() => {
                    setActiveTab('actualites');
                    setShowActualiteEditor(false);
                    setShowArticleEditor(false);
                    setEditingActualite(null);
                    setEditingArticle(null);
                  }}
                >
                  <Newspaper size={16} />
                  Actualités ({actualites.length})
                </button>
              )}
              {canManageArticles && (
                <button
                  className={activeTab === 'articles' ? 'active' : ''}
                  onClick={() => {
                    setActiveTab('articles');
                    setShowActualiteEditor(false);
                    setShowArticleEditor(false);
                    setEditingActualite(null);
                    setEditingArticle(null);
                  }}
                >
                  <FileText size={16} />
                  DecryptMundi ({articles.length})
                </button>
              )}
              {canViewContacts && (
                <button
                  className={activeTab === 'contacts' ? 'active' : ''}
                  onClick={() => {
                    setActiveTab('contacts');
                    setShowActualiteEditor(false);
                    setShowArticleEditor(false);
                    setEditingActualite(null);
                    setEditingArticle(null);
                  }}
                >
                  <Mail size={16} />
                  Contact Submissions ({contactSubmissions.length})
                </button>
              )}
            </div>
          )}

          {/* Editors */}
          {showActualiteEditor ? (
            <ActualiteEditor
              actualite={editingActualite}
              initialDraft={draftActualite}
              onDraftChange={setDraftActualite}
              allowedCommissions={allowedCommissions}
              onClose={() => {
                setShowActualiteEditor(false);
                setEditingActualite(null);
              }}
              onSave={() => {
                setDraftActualite(null);
                setShowActualiteEditor(false);
                setEditingActualite(null);
                fetchActualites();
              }}
            />
          ) : showArticleEditor ? (
            <ArticleEditor
              article={editingArticle}
              initialDraft={draftArticle}
              onDraftChange={setDraftArticle}
              onClose={() => {
                setShowArticleEditor(false);
                setEditingArticle(null);
              }}
              onSave={() => {
                setDraftArticle(null);
                setShowArticleEditor(false);
                setEditingArticle(null);
                fetchArticles();
              }}
            />
          ) : activeTab === 'contacts' && canViewContacts ? (
            /* Contact Submissions View */
            <ContactSubmissionsView
              submissions={contactSubmissions}
              selectedContact={selectedContact}
              onSelectContact={setSelectedContact}
              onUpdateStatus={async (id, status) => {
                if (!supabase) return;
                try {
                  const { error } = await supabase
                    .from('contact_submissions')
                    .update({ status })
                    .eq('id', id);
                  
                  if (error) throw error;
                  toast.success('Status updated');
                  fetchContactSubmissions();
                  if (selectedContact?.id === id) {
                    setSelectedContact({ ...selectedContact, status });
                  }
                } catch (error: any) {
                  toast.error(error.message || 'Failed to update status');
                }
              }}
            />
          ) : (
            /* Posts Lists */
            <div className="posts-list">
              {/* Actualités Tab */}
              {activeTab === 'actualites' && canManageActualites && (
                actualites.length === 0 ? (
                  <div className="no-posts">
                    <Newspaper size={48} />
                    <p>No actualités yet. Create your first post!</p>
                    <button onClick={handleNewPost} className="new-post-button">
                      <Plus size={18} />
                      Create First Post
                    </button>
                  </div>
                ) : (
                  <div className="posts-grid">
                    {actualites.map((actualite) => {
                      const commission = commissions.find(c => c.id === actualite.commission_id);
                      const canEdit = hasFullAccess || actualite.commission_id === appUser?.commissions_role;
                      
                      return (
                        <div key={actualite.id} className="post-card">
                          <div className="post-commission-badge" style={{ backgroundColor: commission?.color }}>
                            {commission?.name || actualite.commission_id.toUpperCase()}
                          </div>
                          <div className={`post-status-badge post-status-badge--${actualite.status}`}>{actualite.status}</div>
                          <h3>{actualite.title}</h3>
                          <div
                            className="post-preview"
                            dangerouslySetInnerHTML={{
                              __html: actualite.content.substring(0, 150) + '...'
                            }}
                          />
                          {canEdit && (
                            <div className="post-actions">
                              <button onClick={() => handleEditActualite(actualite)} className="action-button edit">
                                <Edit size={16} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteActualite(actualite.id, actualite.commission_id)}
                                className="action-button delete"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {/* Articles Tab */}
              {activeTab === 'articles' && canManageArticles && (
                articles.length === 0 ? (
                  <div className="no-posts">
                    <FileText size={48} />
                    <p>No articles yet. Create your first article!</p>
                    <button onClick={handleNewPost} className="new-post-button">
                      <Plus size={18} />
                      Create First Article
                    </button>
                  </div>
                ) : (
                  <div className="posts-grid">
                    {articles.map((article) => {
                      const canEdit = hasFullAccess || article.author_id === user?.id;
                      
                      return (
                        <div key={article.id} className="post-card">
                          <div className={`post-status-badge post-status-badge--${article.status}`}>{article.status}</div>
                          <h3>{article.title}</h3>
                          {article.excerpt && <p className="post-preview">{article.excerpt}</p>}
                          {canEdit && (
                            <div className="post-actions">
                              <button onClick={() => handleEditArticle(article)} className="action-button edit">
                                <Edit size={16} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(article.id, article.author_id)}
                                className="action-button delete"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {/* Default view when no tabs match */}
              {!canManageActualites && !canManageArticles && !canViewContacts && (
                <div className="no-posts">
                  <FileText size={48} />
                  <p>No content access. Please contact an administrator.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Contact Submissions View Component
 * Form-style display with status tabs: Pending, Accepted, Interesting, Weak Candidate
 */
function ContactSubmissionsView({
  submissions,
  selectedContact,
  onSelectContact,
  onUpdateStatus
}: {
  submissions: ContactSubmission[];
  selectedContact: ContactSubmission | null;
  onSelectContact: (contact: ContactSubmission | null) => void;
  onUpdateStatus: (id: string, status: ContactSubmission['status']) => Promise<void>;
}) {
  const [typeFilter, setTypeFilter] = useState<'all' | 'application' | 'contact'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getType = (submission: ContactSubmission): 'application' | 'contact' => {
    const explicit = (submission as any).type;
    if (explicit === 'application' || explicit === 'contact') {
      return explicit;
    }
    return submission.commission_interest || submission.position_applying || submission.age
      ? 'application'
      : 'contact';
  };

  const typeFilteredSubmissions =
    typeFilter === 'all'
      ? submissions
      : submissions.filter((s) => getType(s) === typeFilter);

  const statusTabs = [
    { id: 'all', label: 'All', count: typeFilteredSubmissions.length },
    { id: 'pending', label: 'Pending', count: typeFilteredSubmissions.filter(s => ['new', 'read'].includes(s.status)).length },
    { id: 'accepted', label: 'Accepted', count: typeFilteredSubmissions.filter(s => s.status === 'accepted').length },
    { id: 'interesting', label: 'Interesting', count: typeFilteredSubmissions.filter(s => s.status === 'interesting').length },
    { id: 'weak_candidate', label: 'Weak', count: typeFilteredSubmissions.filter(s => s.status === 'weak_candidate').length },
  ];

  const filteredSubmissions = statusFilter === 'all'
    ? typeFilteredSubmissions
    : statusFilter === 'pending'
      ? typeFilteredSubmissions.filter(s => ['new', 'read'].includes(s.status))
      : typeFilteredSubmissions.filter(s => s.status === statusFilter);

  const getStatusIcon = (status: ContactSubmission['status']) => {
    switch (status) {
      case 'new':
      case 'read':
        return <Clock size={16} />;
      case 'accepted':
        return <CheckCircle size={16} />;
      case 'interesting':
        return <Mail size={16} />;
      case 'weak_candidate':
        return <Archive size={16} />;
      case 'replied':
      case 'archived':
        return <Mail size={16} />;
      default:
        return <Mail size={16} />;
    }
  };

  const getStatusColor = (status: ContactSubmission['status']) => {
    switch (status) {
      case 'new':
      case 'read':
        return '#0ea5e9';
      case 'accepted':
        return '#16a34a';
      case 'interesting':
        return '#d4af37';
      case 'weak_candidate':
        return '#6b7280';
      case 'replied':
        return '#16a34a';
      case 'archived':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const candidateStatuses = ['accepted', 'interesting', 'weak_candidate'] as const;

  if (submissions.length === 0) {
    return (
      <div className="no-posts">
        <Mail size={48} />
        <p>No contact submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="contact-submissions-container">
      <div className="contact-type-tabs">
        <button
          className={`contact-status-tab ${typeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setTypeFilter('all')}
        >
          All ({submissions.length})
        </button>
        <button
          className={`contact-status-tab ${typeFilter === 'application' ? 'active' : ''}`}
          onClick={() => setTypeFilter('application')}
        >
          Applications ({submissions.filter(s => getType(s) === 'application').length})
        </button>
        <button
          className={`contact-status-tab ${typeFilter === 'contact' ? 'active' : ''}`}
          onClick={() => setTypeFilter('contact')}
        >
          Contacts ({submissions.filter(s => getType(s) === 'contact').length})
        </button>
      </div>

      <div className="contact-status-tabs">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            className={`contact-status-tab ${statusFilter === tab.id ? 'active' : ''}`}
            onClick={() => setStatusFilter(tab.id)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="contact-submissions-layout">
      <div className="contact-submissions-table-wrapper">
        <table className="contact-submissions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Commission / Subject</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((submission) => (
              <tr
                key={submission.id}
                className={selectedContact?.id === submission.id ? 'selected' : ''}
                onClick={() => onSelectContact(submission)}
              >
                <td className="contact-table-date">
                  {new Date(submission.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="contact-table-name">{submission.name}</td>
                <td className="contact-table-email">
                  <a href={`mailto:${submission.email}`}>{submission.email}</a>
                </td>
                <td className="contact-table-subject">
                  <span className={`contact-type-pill contact-type-pill--${getType(submission)}`}>
                    {getType(submission) === 'application' ? 'Application' : 'Contact'}
                  </span>
                  {submission.commission_interest || submission.subject || 'UMY Application'}
                </td>
                <td>
                  <span
                    className="contact-status-badge contact-table-status"
                    style={{ backgroundColor: getStatusColor(submission.status) }}
                  >
                    {getStatusIcon(submission.status)}
                    {submission.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="contact-detail-wrapper">
      {selectedContact && (
        <div className="contact-detail-panel contact-detail-panel--form">
          <div className="contact-detail-header">
            <h2>Application Details</h2>
            <button onClick={() => onSelectContact(null)} className="close-detail-button">
              <X size={18} />
            </button>
          </div>

          <div className="contact-detail-content contact-form-display">
            <div className="contact-detail-section">
              <h3>Personal Information</h3>
              <div className="contact-form-row">
                <div className="contact-detail-field">
                  <label>Full Name</label>
                  <div>{selectedContact.name}</div>
                </div>
                <div className="contact-detail-field">
                  <label>Age</label>
                  <div>{selectedContact.age ?? '—'}</div>
                </div>
              </div>
              <div className="contact-form-row">
                <div className="contact-detail-field">
                  <label>Email</label>
                  <div><a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a></div>
                </div>
                <div className="contact-detail-field">
                  <label>Phone</label>
                  <div><a href={`tel:${selectedContact.phone}`}>{selectedContact.phone}</a></div>
                </div>
              </div>
              <div className="contact-detail-field">
                <label>CIN Number</label>
                <div>{selectedContact.cin_number || '—'}</div>
              </div>
            </div>

            <div className="contact-detail-section">
              <h3>Current Situation</h3>
              <div className="contact-form-row">
                <div className="contact-detail-field">
                  <label>Current Occupation</label>
                  <div>{selectedContact.current_occupation || '—'}</div>
                </div>
                <div className="contact-detail-field">
                  <label>City</label>
                  <div>{selectedContact.city || '—'}</div>
                </div>
              </div>
              <div className="contact-form-row">
                <div className="contact-detail-field">
                  <label>Other Organization</label>
                  <div>{selectedContact.other_organization || '—'}</div>
                </div>
                <div className="contact-detail-field">
                  <label>Political Party</label>
                  <div>{selectedContact.political_party || '—'}</div>
                </div>
              </div>
            </div>

            <div className="contact-detail-section">
              <h3>Commission & Position</h3>
              <div className="contact-form-row">
                <div className="contact-detail-field">
                  <label>Commission Interest</label>
                  <div>{selectedContact.commission_interest || '—'}</div>
                </div>
                <div className="contact-detail-field">
                  <label>Position Applying</label>
                  <div>{selectedContact.position_applying || '—'}</div>
                </div>
              </div>
              <div className="contact-detail-field">
                <label>Commission Motivation</label>
                <div className="contact-message-content">{selectedContact.commission_motivation || selectedContact.message || '—'}</div>
              </div>
            </div>

            <div className="contact-detail-section">
              <h3>Experience & Skills</h3>
              <div className="contact-detail-field">
                <label>Active Membership Acknowledged</label>
                <div>{selectedContact.active_membership_acknowledged ? 'Yes' : 'No'}</div>
              </div>
              <div className="contact-detail-field">
                <label>Previous Experiences</label>
                <div className="contact-message-content">{selectedContact.previous_experiences || '—'}</div>
              </div>
              <div className="contact-detail-field">
                <label>Skills</label>
                <div>{selectedContact.skills?.length ? selectedContact.skills.join(', ') : '—'}</div>
              </div>
            </div>

            <div className="contact-detail-section">
              <h3>Additional</h3>
              <div className="contact-form-row">
                <div className="contact-detail-field">
                  <label>Referral Source</label>
                  <div>{selectedContact.referral_source || '—'}</div>
                </div>
              </div>
              <div className="contact-detail-field">
                <label>Additional Info</label>
                <div className="contact-message-content">{selectedContact.additional_info || '—'}</div>
              </div>
            </div>

            <div className="contact-detail-section">
              <h3>Classification</h3>
              <div className="contact-detail-field">
                <label>Move to</label>
                <div className="contact-status-selector contact-classification-buttons">
                  {candidateStatuses.map((status) => (
                    <button
                      key={status}
                      className={`status-button ${selectedContact.status === status ? 'active' : ''}`}
                      onClick={() => onUpdateStatus(selectedContact.id, status)}
                      style={{
                        backgroundColor: selectedContact.status === status ? getStatusColor(status) : 'transparent',
                        borderColor: getStatusColor(status)
                      }}
                    >
                      {getStatusIcon(status)}
                      {status === 'accepted' ? 'Accepted Members' : status === 'interesting' ? 'Interesting Members' : 'Weak Candidate'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="contact-detail-field">
                <label>Submitted</label>
                <div>
                  {new Date(selectedContact.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      </div>
    </div>
  );
}

/**
 * Actualite Editor Component
 * For creating/editing commission actualités
 */
function ActualiteEditor({
  actualite,
  initialDraft,
  onDraftChange,
  allowedCommissions,
  onClose,
  onSave
}: {
  actualite: Actualite | null;
  initialDraft?: { commissionId: 'ir' | 'mp' | 'sd' | 'orientation'; title: string; content: string; imageUrl: string; status: 'draft' | 'published' } | null;
  onDraftChange?: (draft: { commissionId: 'ir' | 'mp' | 'sd' | 'orientation'; title: string; content: string; imageUrl: string; status: 'draft' | 'published' } | null) => void;
  allowedCommissions: Array<{ id: 'ir' | 'mp' | 'sd' | 'orientation'; name: string; color: string }>;
  onClose: () => void;
  onSave: () => void;
}) {
  const { user, appUser } = useAuth();
  const [commissionId, setCommissionId] = useState<'ir' | 'mp' | 'sd' | 'orientation'>(
    actualite?.commission_id || initialDraft?.commissionId || allowedCommissions[0]?.id || 'ir'
  );
  const [title, setTitle] = useState(actualite?.title || initialDraft?.title || '');
  const [content, setContent] = useState(actualite?.content || initialDraft?.content || '');
  const [imageUrl, setImageUrl] = useState(actualite?.image_url || initialDraft?.imageUrl || '');
  const [status, setStatus] = useState<'draft' | 'published'>(
    actualite?.status === 'published' ? 'published' : (initialDraft?.status || 'draft')
  );
  const [saving, setSaving] = useState(false);

  // Persist draft to parent when editing new post (so switching tab doesn't lose content)
  useEffect(() => {
    if (actualite || !onDraftChange) return;
    const t = setTimeout(() => {
      onDraftChange({
        commissionId,
        title,
        content,
        imageUrl,
        status
      });
    }, 400);
    return () => clearTimeout(t);
  }, [actualite, commissionId, title, content, imageUrl, status, onDraftChange]);

  const handleSave = async () => {
    console.log('=== SAVE CLICKED ===');
    console.log('Title:', title);
    console.log('Content length:', content?.length);
    console.log('Commission:', commissionId);
    console.log('Status:', status);
    console.log('User:', user?.id);
    console.log('appUser:', appUser);
    
    if (!title.trim() || !content.trim()) {
      console.error('Validation failed: Missing title or content');
      toast.error('Please fill in title and content');
      return;
    }

    if (!supabase || !user) {
      console.error('Not authenticated or no supabase client');
      toast.error('Not authenticated');
      return;
    }

    // Validate commission access (orientation only for full access)
    if (commissionId === 'orientation') {
      if (appUser?.commissions_role !== 'full') {
        toast.error('Only full-access admins can post to Orientation (News & Actualities)');
        return;
      }
    } else if (appUser?.commissions_role !== 'full' && commissionId !== appUser?.commissions_role) {
      console.error('Commission access denied:', {
        userCommission: appUser?.commissions_role,
        targetCommission: commissionId
      });
      toast.error('You can only post to your assigned commission');
      return;
    }

    console.log('Validation passed, preparing to save...');
    setSaving(true);
    
    try {
      const data = {
        commission_id: commissionId,
        title: title.trim(),
        content: content.trim(),
        image_url: imageUrl.trim() || null,
        author_id: user.id,
        status,
        ...(status === 'published' && !actualite?.published_at
          ? { published_at: new Date().toISOString() }
          : {})
      };

      console.log('=== ACTUALITÉ SAVE DATA ===');
      console.log('Image URL:', imageUrl);
      console.log('Image URL (trimmed):', imageUrl.trim());
      console.log('Image URL (final):', imageUrl.trim() || null);
      console.log('Full data:', data);

      if (actualite) {
        // Update existing
        console.log('Updating actualité:', actualite.id);
        const { data: result, error } = await supabase
          .from('commission_actualites')
          .update(data)
          .eq('id', actualite.id)
          .select();
        
        console.log('Update result:', { result, error });
        
        if (error) throw error;
        
        // Verify image URL was saved
        if (result && result[0]) {
          console.log('✅ Saved actualité:', result[0]);
          console.log('✅ Image URL in database:', result[0].image_url);
          if (result[0].image_url) {
            toast.success('Actualité updated successfully! Image saved.');
          } else {
            toast.warning('Actualité updated, but image URL is empty. Check console.');
          }
        }
      } else {
        // Create new
        console.log('Creating new actualité...');
        const { data: result, error } = await supabase
          .from('commission_actualites')
          .insert([data])
          .select();
        
        console.log('Insert result:', { result, error });
        
        if (error) throw error;
        
        // Verify image URL was saved
        if (result && result[0]) {
          console.log('✅ Created actualité:', result[0]);
          console.log('✅ Image URL in database:', result[0].image_url);
          if (result[0].image_url) {
            toast.success('Actualité created successfully! Image saved.');
          } else {
            toast.warning('Actualité created, but image URL is empty. Check console.');
          }
        }
      }

      console.log('Save successful, calling onSave()');
      onSave();
    } catch (error: any) {
      console.error('=== SAVE ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      toast.error(error.message || 'Failed to save');
    } finally {
      setSaving(false);
      console.log('=== SAVE COMPLETE ===');
    }
  };

  const selectedCommission = allowedCommissions.find(c => c.id === commissionId);

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>{actualite ? 'Edit Actualité' : 'New Actualité'}</h2>
        <div className="editor-actions">
          <button onClick={onClose} className="cancel-button">
            <X size={18} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="save-button"
            style={{ backgroundColor: selectedCommission?.color || '#0ea5e9' }}
            disabled={saving}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="editor-form">
        <div className="form-group">
          <label>Commission *</label>
          <select
            value={commissionId}
            onChange={(e) => setCommissionId(e.target.value as 'ir' | 'mp' | 'sd' | 'orientation')}
            disabled={allowedCommissions.length === 1}
          >
            {allowedCommissions.map((comm) => (
              <option key={comm.id} value={comm.id}>
                {comm.name}
              </option>
            ))}
          </select>
          {allowedCommissions.length === 1 && (
            <p className="form-hint">You can only post to this commission</p>
          )}
        </div>

        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            maxLength={200}
          />
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <ImageUpload
            bucket="actualite-images"
            currentImage={imageUrl}
            onUploadComplete={(url) => {
              console.log('Image upload complete, URL received:', url);
              setImageUrl(url);
              toast.success('Image URL set: ' + url.substring(0, 50) + '...');
            }}
            label="Actualité Image"
            maxSizeMB={5}
          />
          {imageUrl && (
            <div className="image-url-display">
              <p className="form-hint" style={{ color: '#4ade80', marginTop: '0.5rem' }}>
                ✅ Image URL: {imageUrl.substring(0, 60)}...
              </p>
              <p className="form-hint" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                This URL will be saved when you click Save
              </p>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Image URL (optional - legacy, use upload above)</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => {
              console.log('Image URL manually changed:', e.target.value);
              setImageUrl(e.target.value);
            }}
            placeholder="https://example.com/image.jpg"
          />
          <p className="form-hint">Use the image upload above instead</p>
        </div>

        <div className="form-group">
          <label>Content *</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Write your content here..."
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <p className="form-hint">
            {status === 'published'
              ? 'Will be visible to the public'
              : 'Only visible to you'}
          </p>
        </div>
      </div>
    </div>
  );
}

type ArticleDraft = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImageUrl: string;
  featuredImageUrl: string;
  authorName: string;
  authorBio: string;
  editorName: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  readTimeMinutes: number;
  isFeatured: boolean;
  status: 'draft' | 'published';
};

/**
 * Article Editor Component
 * For creating/editing DecryptMundi articles
 */
function ArticleEditor({
  article,
  initialDraft,
  onDraftChange,
  onClose,
  onSave
}: {
  article: Article | null;
  initialDraft?: ArticleDraft | null;
  onDraftChange?: (draft: ArticleDraft | null) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const { user, appUser } = useAuth();
  const [title, setTitle] = useState(article?.title || initialDraft?.title || '');
  const [slug, setSlug] = useState(article?.slug || initialDraft?.slug || '');
  const [content, setContent] = useState(article?.content || initialDraft?.content || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || initialDraft?.excerpt || '');
  const [coverImageUrl, setCoverImageUrl] = useState(article?.cover_image_url || initialDraft?.coverImageUrl || '');
  const [featuredImageUrl, setFeaturedImageUrl] = useState(article?.featured_image_url || initialDraft?.featuredImageUrl || '');
  const [authorName, setAuthorName] = useState(article?.author_name || initialDraft?.authorName || '');
  const [authorBio, setAuthorBio] = useState(article?.author_bio || initialDraft?.authorBio || '');
  const [editorName, setEditorName] = useState(article?.editor_name || initialDraft?.editorName || '');
  const [category, setCategory] = useState(article?.category || initialDraft?.category || '');
  const [metaTitle, setMetaTitle] = useState(article?.meta_title || initialDraft?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(article?.meta_description || initialDraft?.metaDescription || '');
  const [metaKeywords, setMetaKeywords] = useState(article?.meta_keywords || initialDraft?.metaKeywords || '');
  const [readTimeMinutes, setReadTimeMinutes] = useState(article?.read_time_minutes ?? initialDraft?.readTimeMinutes ?? 5);
  const [isFeatured, setIsFeatured] = useState(article?.is_featured ?? initialDraft?.isFeatured ?? false);
  const [status, setStatus] = useState<'draft' | 'published'>(
    article?.status === 'published' ? 'published' : (initialDraft?.status || 'draft')
  );
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);

  // Persist draft to parent when editing new article (so switching tab doesn't lose content)
  useEffect(() => {
    if (article || !onDraftChange) return;
    const t = setTimeout(() => {
      onDraftChange({
        title,
        slug,
        content,
        excerpt,
        coverImageUrl,
        featuredImageUrl,
        authorName,
        authorBio,
        editorName,
        category,
        metaTitle,
        metaDescription,
        metaKeywords,
        readTimeMinutes,
        isFeatured,
        status
      });
    }, 400);
    return () => clearTimeout(t);
  }, [article, title, slug, content, excerpt, coverImageUrl, featuredImageUrl, authorName, authorBio, editorName, category, metaTitle, metaDescription, metaKeywords, readTimeMinutes, isFeatured, status, onDraftChange]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('article_categories')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    // Auto-generate slug only for new articles
    if (!article) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSave = async () => {
    console.log('=== ARTICLE SAVE CLICKED ===');
    console.log('Title:', title);
    console.log('Slug:', slug);
    console.log('Content length:', content?.length);
    console.log('Status:', status);
    
    if (!title.trim() || !content.trim()) {
      console.error('Validation failed: Missing title or content');
      toast.error('Please fill in title and content');
      return;
    }

    if (!supabase || !user) {
      console.error('Not authenticated or no supabase client');
      toast.error('Not authenticated');
      return;
    }

    const finalSlug = slug.trim() || generateSlug(title);
    console.log('Final slug:', finalSlug);
    
    setSaving(true);
    try {
      const data = {
        title: title.trim(),
        slug: finalSlug,
        content: content.trim(),
        excerpt: excerpt.trim() || null,
        cover_image_url: coverImageUrl.trim() || null,
        featured_image_url: featuredImageUrl.trim() || null,
        author_id: user.id,
        author_name: authorName.trim() || null,
        author_bio: authorBio.trim() || null,
        editor_name: editorName.trim() || null,
        category: category || null,
        meta_title: metaTitle.trim() || null,
        meta_description: metaDescription.trim() || null,
        meta_keywords: metaKeywords.trim() || null,
        read_time_minutes: readTimeMinutes || null,
        is_featured: isFeatured,
        status,
        ...(status === 'published' && !article?.published_at
          ? { published_at: new Date().toISOString() }
          : {})
      };

      console.log('Data to save:', data);

      if (article) {
        // Update existing
        console.log('Updating article:', article.id);
        const { data: result, error } = await supabase
          .from('decryptmundi_articles')
          .update(data)
          .eq('id', article.id)
          .select();
        
        console.log('Update result:', { result, error });
        if (error) throw error;
        toast.success('Article updated successfully!');
      } else {
        // Create new
        console.log('Creating new article...');
        const { data: result, error } = await supabase
          .from('decryptmundi_articles')
          .insert([data])
          .select();
        
        console.log('Insert result:', { result, error });
        if (error) throw error;
        toast.success('Article created successfully!');
      }

      console.log('Save successful!');
      onSave();
    } catch (error: any) {
      console.error('=== ARTICLE SAVE ERROR ===', error);
      if (error.code === '23505') {
        toast.error('This slug is already taken. Please use a different one.');
      } else {
        toast.error(error.message || 'Failed to save');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>{article ? 'Edit Article' : 'New Article'}</h2>
        <div className="editor-actions">
          <button onClick={onClose} className="cancel-button">
            <X size={18} />
            Cancel
          </button>
          <button onClick={handleSave} className="save-button" disabled={saving}>
            <Save size={18} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="editor-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter article title..."
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label>Slug (URL)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            placeholder="article-url-slug"
          />
          <p className="form-hint">URL: /decryptmundi/{slug || 'article-url-slug'}</p>
        </div>

        <div className="form-group">
          <label>Excerpt (optional)</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary or introduction..."
            rows={3}
            maxLength={300}
          />
        </div>

        {/* Featured Image Upload */}
        <div className="form-group">
          <ImageUpload
            bucket="article-images"
            currentImage={featuredImageUrl}
            onUploadComplete={(url) => setFeaturedImageUrl(url)}
            label="Featured Image (for article card)"
            maxSizeMB={5}
          />
        </div>

        <div className="form-group">
          <label>Cover Image URL (optional - legacy)</label>
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://example.com/cover-image.jpg"
          />
          <p className="form-hint">Use Featured Image upload above instead</p>
        </div>

        {/* Author Information */}
        <div className="form-section-divider">
          <h3>Author Information</h3>
        </div>

        <div className="form-group">
          <label>Author Name *</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Author's full name"
            maxLength={255}
          />
          <p className="form-hint">Displayed on article card and article page</p>
        </div>

        <div className="form-group">
          <label>Author Bio (optional)</label>
          <textarea
            value={authorBio}
            onChange={(e) => setAuthorBio(e.target.value)}
            placeholder="Brief biography of the author..."
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="form-group">
          <label>Editor Name (optional)</label>
          <input
            type="text"
            value={editorName}
            onChange={(e) => setEditorName(e.target.value)}
            placeholder="Editor who reviewed this article"
            maxLength={255}
          />
        </div>

        {/* Category & Featured */}
        <div className="form-section-divider">
          <h3>Article Settings</h3>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Featured Article
          </label>
          <p className="form-hint">Featured articles appear prominently on the DecryptMundi homepage</p>
        </div>

        <div className="form-group">
          <label>Read Time (minutes)</label>
          <input
            type="number"
            value={readTimeMinutes}
            onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
            min={1}
            max={60}
            placeholder="5"
          />
          <p className="form-hint">Estimated reading time in minutes</p>
        </div>

        {/* SEO Fields */}
        <div className="form-section-divider">
          <h3>SEO Settings</h3>
        </div>

        <div className="form-group">
          <label>Meta Title (SEO)</label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="SEO title for search engines (60 chars max)"
            maxLength={60}
          />
          <p className="form-hint">
            {metaTitle.length}/60 characters. Shows in Google search results.
            {!metaTitle && ' Leave empty to use article title.'}
          </p>
        </div>

        <div className="form-group">
          <label>Meta Description (SEO)</label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Brief description for search engines (160 chars max)"
            rows={3}
            maxLength={160}
          />
          <p className="form-hint">
            {metaDescription.length}/160 characters. Shows in Google search results.
          </p>
        </div>

        <div className="form-group">
          <label>Meta Keywords (SEO)</label>
          <input
            type="text"
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
            maxLength={255}
          />
          <p className="form-hint">Comma-separated keywords for SEO</p>
        </div>

        <div className="form-group">
          <label>Content *</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Write your article here..."
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <p className="form-hint">
            {status === 'published'
              ? 'Will be visible on DecryptMundi page'
              : 'Only visible to you'}
          </p>
        </div>
      </div>
    </div>
  );
}

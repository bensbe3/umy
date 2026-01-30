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
  const [activeTab, setActiveTab] = useState<'actualites' | 'articles' | 'contacts'>('actualites');
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor states
  const [showActualiteEditor, setShowActualiteEditor] = useState(false);
  const [showArticleEditor, setShowArticleEditor] = useState(false);
  const [editingActualite, setEditingActualite] = useState<Actualite | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
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

  // Commission info
  const commissions = [
    { id: 'ir' as const, name: 'International Relations', color: '#0ea5e9' },
    { id: 'mp' as const, name: 'Moroccan Politics', color: '#dc2626' },
    { id: 'sd' as const, name: 'Social Development', color: '#16a34a' }
  ];

  const allowedCommissions = !canManageActualites ? [] :
    appUser.commissions_role === 'full'
      ? commissions
      : commissions.filter(c => c.id === appUser.commissions_role);

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

          {/* Tabs - Only show Contact Submissions for full access admins */}
          {canViewContacts && (
            <div className="content-tabs">
              <button
                className={activeTab === 'contacts' ? 'active' : ''}
                onClick={() => setActiveTab('contacts')}
              >
                <Mail size={16} />
                Contact Submissions ({contactSubmissions.length})
              </button>
            </div>
          )}

          {/* Editors */}
          {showActualiteEditor ? (
            <ActualiteEditor
              actualite={editingActualite}
              allowedCommissions={allowedCommissions}
              onClose={() => {
                setShowActualiteEditor(false);
                setEditingActualite(null);
              }}
              onSave={() => {
                setShowActualiteEditor(false);
                setEditingActualite(null);
                fetchActualites();
              }}
            />
          ) : showArticleEditor ? (
            <ArticleEditor
              article={editingArticle}
              onClose={() => {
                setShowArticleEditor(false);
                setEditingArticle(null);
              }}
              onSave={() => {
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
            /* Empty state - show message to create post */
            <div className="no-posts">
              <FileText size={48} />
              <p>Click "Create Post" to start creating content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Contact Submissions View Component
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
  const getStatusIcon = (status: ContactSubmission['status']) => {
    switch (status) {
      case 'new':
        return <Clock size={16} />;
      case 'read':
        return <Mail size={16} />;
      case 'replied':
        return <CheckCircle size={16} />;
      case 'archived':
        return <Archive size={16} />;
      default:
        return <Mail size={16} />;
    }
  };

  const getStatusColor = (status: ContactSubmission['status']) => {
    switch (status) {
      case 'new':
        return '#0ea5e9';
      case 'read':
        return '#d4af37';
      case 'replied':
        return '#16a34a';
      case 'archived':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

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
      <div className="contact-submissions-list">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className={`contact-submission-card ${selectedContact?.id === submission.id ? 'selected' : ''}`}
            onClick={() => onSelectContact(submission)}
          >
            <div className="contact-card-header">
              <div className="contact-card-name">{submission.name}</div>
              <div
                className="contact-status-badge"
                style={{ backgroundColor: getStatusColor(submission.status) }}
              >
                {getStatusIcon(submission.status)}
                {submission.status}
              </div>
            </div>
            <div className="contact-card-email">{submission.email}</div>
            <div className="contact-card-subject">{submission.subject}</div>
            <div className="contact-card-date">
              {new Date(submission.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedContact && (
        <div className="contact-detail-panel">
          <div className="contact-detail-header">
            <h2>Contact Submission Details</h2>
            <button onClick={() => onSelectContact(null)} className="close-detail-button">
              <X size={18} />
            </button>
          </div>

          <div className="contact-detail-content">
            <div className="contact-detail-section">
              <h3>Personal Information</h3>
              <div className="contact-detail-field">
                <label>Name</label>
                <div>{selectedContact.name}</div>
              </div>
              <div className="contact-detail-field">
                <label>Email</label>
                <div>
                  <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
                </div>
              </div>
              <div className="contact-detail-field">
                <label>Phone</label>
                <div>
                  <a href={`tel:${selectedContact.phone}`}>{selectedContact.phone}</a>
                </div>
              </div>
              {selectedContact.organization && (
                <div className="contact-detail-field">
                  <label>Organization</label>
                  <div>{selectedContact.organization}</div>
                </div>
              )}
              {selectedContact.linkedin && (
                <div className="contact-detail-field">
                  <label>LinkedIn</label>
                  <div>
                    <a href={selectedContact.linkedin} target="_blank" rel="noopener noreferrer">
                      {selectedContact.linkedin}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="contact-detail-section">
              <h3>Message</h3>
              <div className="contact-detail-field">
                <label>Subject</label>
                <div>{selectedContact.subject}</div>
              </div>
              <div className="contact-detail-field">
                <label>Interest</label>
                <div>{selectedContact.interest || 'Not specified'}</div>
              </div>
              <div className="contact-detail-field">
                <label>Message</label>
                <div className="contact-message-content">{selectedContact.message}</div>
              </div>
            </div>

            <div className="contact-detail-section">
              <h3>Metadata</h3>
              <div className="contact-detail-field">
                <label>Status</label>
                <div className="contact-status-selector">
                  {(['new', 'read', 'replied', 'archived'] as const).map((status) => (
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
                      {status}
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
              {selectedContact.updated_at !== selectedContact.created_at && (
                <div className="contact-detail-field">
                  <label>Last Updated</label>
                  <div>
                    {new Date(selectedContact.updated_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Actualite Editor Component
 * For creating/editing commission actualités
 */
function ActualiteEditor({
  actualite,
  allowedCommissions,
  onClose,
  onSave
}: {
  actualite: Actualite | null;
  allowedCommissions: Array<{ id: 'ir' | 'mp' | 'sd'; name: string; color: string }>;
  onClose: () => void;
  onSave: () => void;
}) {
  const { user, appUser } = useAuth();
  const [commissionId, setCommissionId] = useState<'ir' | 'mp' | 'sd'>(
    actualite?.commission_id || allowedCommissions[0]?.id || 'ir'
  );
  const [title, setTitle] = useState(actualite?.title || '');
  const [content, setContent] = useState(actualite?.content || '');
  const [imageUrl, setImageUrl] = useState(actualite?.image_url || '');
  const [status, setStatus] = useState<'draft' | 'published'>(
    actualite?.status === 'published' ? 'published' : 'draft'
  );
  const [saving, setSaving] = useState(false);

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

    // Validate commission access
    if (appUser?.commissions_role !== 'full' && commissionId !== appUser?.commissions_role) {
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
            onChange={(e) => setCommissionId(e.target.value as 'ir' | 'mp' | 'sd')}
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

/**
 * Article Editor Component
 * For creating/editing DecryptMundi articles
 */
function ArticleEditor({
  article,
  onClose,
  onSave
}: {
  article: Article | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const { user, appUser } = useAuth();
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [content, setContent] = useState(article?.content || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [coverImageUrl, setCoverImageUrl] = useState(article?.cover_image_url || '');
  const [featuredImageUrl, setFeaturedImageUrl] = useState(article?.featured_image_url || '');
  const [authorName, setAuthorName] = useState(article?.author_name || '');
  const [authorBio, setAuthorBio] = useState(article?.author_bio || '');
  const [editorName, setEditorName] = useState(article?.editor_name || '');
  const [category, setCategory] = useState(article?.category || '');
  const [metaTitle, setMetaTitle] = useState(article?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(article?.meta_description || '');
  const [metaKeywords, setMetaKeywords] = useState(article?.meta_keywords || '');
  const [readTimeMinutes, setReadTimeMinutes] = useState(article?.read_time_minutes || 5);
  const [isFeatured, setIsFeatured] = useState(article?.is_featured || false);
  const [status, setStatus] = useState<'draft' | 'published'>(
    article?.status === 'published' ? 'published' : 'draft'
  );
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);

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

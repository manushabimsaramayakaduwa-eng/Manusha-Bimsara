import React, { useState, useEffect } from 'react';
import { 
  Image, 
  Plus, 
  Trash2, 
  Download, 
  FolderPlus, 
  Camera, 
  Sparkles,
  FileImage,
  ArrowDownToLine,
  ExternalLink
} from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  description: string;
  uploadedAt: string;
  fileSizeMB: number;
}

interface Album {
  id: string;
  name: string;
  description: string;
  photos: Photo[];
  createdAt: string;
}

interface PhotoAlbumsProps {
  userRole: 'leader' | 'scout';
  currentUser: { username: string; role: 'admin' | 'leader' | 'member'; fullName: string };
  onStorageChange: (sizeMB: number) => void;
  onAuditLog: (action: string) => void;
}

const INITIAL_ALBUMS: Album[] = [
  {
    id: 'alb-1',
    name: 'District Camporee 2026',
    description: 'Campfire ceremonies, pioneering projects, and competitive hiking trails in Colombo district.',
    createdAt: '2026-05-15',
    photos: [
      { id: 'ph-1', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', description: 'Cooking dinner on patrol campfire', uploadedAt: '2026-05-15', fileSizeMB: 4.2 },
      { id: 'ph-2', url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80', description: 'Pitching the A-frame tents', uploadedAt: '2026-05-15', fileSizeMB: 3.8 }
    ]
  },
  {
    id: 'alb-2',
    name: 'Colombo International Investiture',
    description: 'Welcome ceremonies and scarf presentation ceremonies for our newly enrolled Cub Scouts.',
    createdAt: '2026-06-10',
    photos: [
      { id: 'ph-3', url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80', description: 'Presentation of the Tenderfoot badges', uploadedAt: '2026-06-10', fileSizeMB: 5.1 }
    ]
  }
];

export default function PhotoAlbums({ userRole, currentUser, onStorageChange, onAuditLog }: PhotoAlbumsProps) {
  const [albums, setAlbums] = useState<Album[]>(() => {
    const saved = localStorage.getItem('51_scouttrack_albums');
    return saved ? JSON.parse(saved) : INITIAL_ALBUMS;
  });

  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [isNewAlbumOpen, setIsNewAlbumOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');

  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoDesc, setNewPhotoDesc] = useState('');

  // Persist and notify parent of total photo storage weight
  useEffect(() => {
    localStorage.setItem('51_scouttrack_albums', JSON.stringify(albums));
    let totalMB = 0;
    albums.forEach(alb => {
      alb.photos.forEach(ph => {
        totalMB += ph.fileSizeMB;
      });
    });
    onStorageChange(totalMB);
  }, [albums]);

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;

    const newAlb: Album = {
      id: `alb-${Date.now()}`,
      name: newAlbumName.trim(),
      description: newAlbumDesc.trim() || 'No description provided.',
      createdAt: new Date().toISOString().split('T')[0],
      photos: []
    };

    setAlbums(prev => [newAlb, ...prev]);
    setIsNewAlbumOpen(false);
    setNewAlbumName('');
    setNewAlbumDesc('');
    
    const logMsg = `Admin/Leader (${currentUser.fullName}) created a new Photo Album: "${newAlb.name}"`;
    onAuditLog(logMsg);
  };

  const handleDeleteAlbum = (albId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser.role !== 'admin' && currentUser.role !== 'leader') {
      alert('Permission Denied! Only Leaders and Administrators can delete photo albums.');
      return;
    }
    if (!confirm('Are you sure you want to delete this photo album and all its photos? This frees Google Drive space.')) return;

    const targetAlb = albums.find(a => a.id === albId);
    setAlbums(prev => prev.filter(a => a.id !== albId));
    if (activeAlbumId === albId) setActiveAlbumId(null);

    const logMsg = `Admin/Leader (${currentUser.fullName}) deleted Photo Album: "${targetAlb?.name}"`;
    onAuditLog(logMsg);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAlbumId || !newPhotoUrl.trim()) return;

    const randomSizes = [3.2, 4.5, 5.0, 2.8, 6.1, 4.0];
    const sizeMB = randomSizes[Math.floor(Math.random() * randomSizes.length)];

    const newPh: Photo = {
      id: `ph-${Date.now()}`,
      url: newPhotoUrl.trim(),
      description: newPhotoDesc.trim() || 'CIS Scout activity photo',
      uploadedAt: new Date().toISOString().split('T')[0],
      fileSizeMB: sizeMB
    };

    setAlbums(prev => prev.map(alb => {
      if (alb.id !== activeAlbumId) return alb;
      return {
        ...alb,
        photos: [newPh, ...alb.photos]
      };
    }));

    setIsAddPhotoOpen(false);
    setNewPhotoUrl('');
    setNewPhotoDesc('');

    const targetAlbName = albums.find(a => a.id === activeAlbumId)?.name;
    const logMsg = `Admin/Leader (${currentUser.fullName}) uploaded a new photo (${sizeMB} MB) to "${targetAlbName}"`;
    onAuditLog(logMsg);
  };

  const handleDeletePhoto = (photoId: string) => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'leader') {
      alert('Permission Denied! Only Leaders and Administrators can delete photos.');
      return;
    }
    if (!confirm('Remove this photo from the album?')) return;

    setAlbums(prev => prev.map(alb => {
      if (alb.id !== activeAlbumId) return alb;
      return {
        ...alb,
        photos: alb.photos.filter(p => p.id !== photoId)
      };
    }));

    onAuditLog(`Admin/Leader (${currentUser.fullName}) deleted a photo from album.`);
  };

  // Safe download simulation
  const triggerDownload = (url: string, description: string) => {
    // Standard secure notification for downloading image
    alert(`[DOWNLOAD INITIATED] \nFile: "${description}" \nDownloading safely from CIS Google Drive Cloud node...`);
  };

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'leader';
  const activeAlbum = albums.find(a => a.id === activeAlbumId);

  return (
    <div className="space-y-6 text-left">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="font-sans font-black text-xl text-brand-green flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-gold" />
            <span>Facebook-style Photo Gallery</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Browse and download high-resolution photos of active scouting activities. Leaders manage album uploads.
          </p>
        </div>

        {canEdit && !activeAlbumId && (
          <button
            onClick={() => setIsNewAlbumOpen(true)}
            className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm transition"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create Album</span>
          </button>
        )}

        {activeAlbumId && (
          <button
            onClick={() => setActiveAlbumId(null)}
            className="border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer transition"
          >
            ← Back to Albums
          </button>
        )}
      </div>

      {/* Album List Grid */}
      {!activeAlbumId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map(alb => {
            const photoCount = alb.photos.length;
            const coverPhoto = alb.photos[0]?.url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80';
            const albumSizeMB = alb.photos.reduce((sum, p) => sum + p.fileSizeMB, 0).toFixed(1);

            return (
              <div 
                key={alb.id}
                onClick={() => setActiveAlbumId(alb.id)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-brand-gold/50 cursor-pointer transition duration-300 relative group text-left"
              >
                {/* Image top */}
                <div className="h-44 overflow-hidden bg-slate-100 relative">
                  <img 
                    src={coverPhoto} 
                    alt={alb.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[9px] font-bold text-brand-green px-2 py-0.5 rounded uppercase tracking-wider">
                    {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'} • {albumSizeMB} MB
                  </span>
                </div>

                {/* Info area */}
                <div className="p-5 space-y-2">
                  <h4 className="font-sans font-black text-sm text-slate-800 leading-tight">
                    {alb.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {alb.description}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    <span>Created: {alb.createdAt}</span>
                    {canEdit && (
                      <button
                        onClick={(e) => handleDeleteAlbum(alb.id, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Album"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {albums.length === 0 && (
            <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              <Image className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium">No albums available yet. Create one above to get started!</p>
            </div>
          )}
        </div>
      ) : (
        /* Inside specific album rendering */
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold-hover">Active Album view</span>
              <h4 className="font-sans font-black text-lg text-slate-800">{activeAlbum?.name}</h4>
              <p className="text-xs text-slate-500 font-light leading-relaxed">{activeAlbum?.description}</p>
            </div>

            {canEdit && (
              <button
                onClick={() => setIsAddPhotoOpen(true)}
                className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
            )}
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activeAlbum?.photos.map(ph => (
              <div 
                key={ph.id} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition duration-200 group text-left"
              >
                <div className="h-48 overflow-hidden bg-slate-100 relative">
                  <img 
                    src={ph.url} 
                    alt={ph.description} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Download overlay button */}
                  <button
                    onClick={() => triggerDownload(ph.url, ph.description)}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-brand-gold text-brand-green hover:text-white rounded-xl shadow-md transition duration-200 cursor-pointer"
                    title="Download Photo"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <span className="absolute bottom-3 left-3 bg-slate-900/70 text-[9px] font-mono text-white px-2 py-0.5 rounded">
                    {ph.fileSizeMB} MB
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-xs text-slate-700 leading-normal font-light">
                    {ph.description}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Uploaded: {ph.uploadedAt}</span>
                    {canEdit && (
                      <button
                        onClick={() => handleDeletePhoto(ph.id)}
                        className="text-slate-400 hover:text-rose-600 transition"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {activeAlbum?.photos.length === 0 && (
              <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                <Camera className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">This album doesn't have any photos yet. Upload some!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL DIALOGS --- */}
      {isNewAlbumOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-4">
            <h3 className="font-sans font-black text-lg text-brand-green border-b border-slate-100 pb-3">Create Photo Album</h3>
            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Album Name*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Campfire 2026"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Album Description</label>
                <textarea
                  placeholder="Provide context for this album..."
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-green resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsNewAlbumOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold uppercase hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-green text-white rounded-lg font-bold uppercase hover:bg-brand-green-light"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddPhotoOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-4">
            <h3 className="font-sans font-black text-lg text-brand-green border-b border-slate-100 pb-3">Upload Photo to Album</h3>
            <form onSubmit={handleAddPhoto} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Photo Image URL*</label>
                <input
                  type="url"
                  required
                  placeholder="Paste Unsplash or external image address..."
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-brand-green"
                />
                <span className="text-[10px] text-slate-400 italic block mt-1">Note: You can use any public web image link!</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Short Caption / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Setting up the camp flagpole"
                  value={newPhotoDesc}
                  onChange={(e) => setNewPhotoDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddPhotoOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold uppercase hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-green text-white rounded-lg font-bold uppercase hover:bg-brand-green-light"
                >
                  Upload Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Download, 
  Trash2, 
  Plus, 
  FileText, 
  Search,
  Sparkles,
  ArrowDownToLine,
  Tag
} from 'lucide-react';

interface EDocument {
  id: string;
  title: string;
  author: string;
  category: 'Manuals' | 'Knotting' | 'First Aid' | 'Camping' | 'History';
  description: string;
  fileSizeMB: number;
  downloadCount: number;
  uploadedAt: string;
}

const INITIAL_DOCS: EDocument[] = [
  {
    id: 'doc-1',
    title: 'Sri Lanka Scout Association Handbook (Part I)',
    author: 'SLSA Education Department',
    category: 'Manuals',
    description: 'The official rule book containing policy, organization, and rules for scouting in Sri Lanka.',
    fileSizeMB: 15.4,
    downloadCount: 142,
    uploadedAt: '2025-01-10'
  },
  {
    id: 'doc-2',
    title: 'The Pioneering & Knotting Master Guide',
    author: 'John Gilcraft',
    category: 'Knotting',
    description: 'Full schematic diagrams for making standard structures, towers, and basic survival binding.',
    fileSizeMB: 8.7,
    downloadCount: 95,
    uploadedAt: '2025-03-22'
  },
  {
    id: 'doc-3',
    title: 'First Responder - Advanced First Aid for Patrols',
    author: 'Red Cross Sri Lanka',
    category: 'First Aid',
    description: 'Crucial reference manual for treatment of venomous bites, fractures, fire burns, and emergency CPR.',
    fileSizeMB: 12.1,
    downloadCount: 204,
    uploadedAt: '2025-02-18'
  },
  {
    id: 'doc-4',
    title: 'Minimalist Outdoor Cooking & Campsite Guide',
    author: 'Kapila Jayawardene (GSL)',
    category: 'Camping',
    description: 'Traditional wood fire cookery formulas, edible forest plants identification, and water filtration systems.',
    fileSizeMB: 4.5,
    downloadCount: 61,
    uploadedAt: '2025-06-05'
  }
];

interface ELibraryProps {
  currentUser: { username: string; role: 'admin' | 'leader' | 'member'; fullName: string };
  onStorageChange: (sizeMB: number) => void;
  onAuditLog: (action: string) => void;
}

export default function ELibrary({ currentUser, onStorageChange, onAuditLog }: ELibraryProps) {
  const [docs, setDocs] = useState<EDocument[]>(() => {
    const saved = localStorage.getItem('51_scouttrack_elibrary');
    return saved ? JSON.parse(saved) : INITIAL_DOCS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Doc Form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<'Manuals' | 'Knotting' | 'First Aid' | 'Camping' | 'History'>('Manuals');
  const [description, setDescription] = useState('');
  const [fileSizeMB, setFileSizeMB] = useState(5.5);

  useEffect(() => {
    localStorage.setItem('51_scouttrack_elibrary', JSON.stringify(docs));
    // Notify parent of total e-library size in MB
    const totalMB = docs.reduce((sum, d) => sum + d.fileSizeMB, 0);
    onStorageChange(totalMB);
  }, [docs]);

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const newDoc: EDocument = {
      id: `doc-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      category,
      description: description.trim() || 'No description provided.',
      fileSizeMB: Number(fileSizeMB) || 3.5,
      downloadCount: 0,
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    setDocs(prev => [newDoc, ...prev]);
    setIsAddOpen(false);

    // Reset Form
    setTitle('');
    setAuthor('');
    setCategory('Manuals');
    setDescription('');
    setFileSizeMB(5.5);

    const logMsg = `Admin/Leader (${currentUser.fullName}) uploaded E-Book document: "${newDoc.title}" (${newDoc.fileSizeMB} MB)`;
    onAuditLog(logMsg);
  };

  const handleDeleteDoc = (id: string) => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'leader') {
      alert('Permission Denied! Only Leaders and Administrators can delete documents from the E-Library.');
      return;
    }
    if (!confirm('Are you sure you want to permanently remove this document from the E-Library? This frees Google Drive space.')) return;

    const targetDoc = docs.find(d => d.id === id);
    setDocs(prev => prev.filter(d => d.id !== id));

    const logMsg = `Admin/Leader (${currentUser.fullName}) removed E-Book: "${targetDoc?.title}"`;
    onAuditLog(logMsg);
  };

  const triggerDownload = (id: string, title: string) => {
    setDocs(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, downloadCount: d.downloadCount + 1 };
      }
      return d;
    }));

    // Beautiful simulated prompt showing safe download of e-book
    alert(`[DOWNLOAD STARTED] \nFile: "${title}" \nThis document has been downloaded to your local device. (Simulated LKR Rs. 0.00 Free Service)`);
    onAuditLog(`Scout Member (${currentUser.fullName}) downloaded E-Book: "${title}"`);
  };

  const categories = ['All', 'Manuals', 'Knotting', 'First Aid', 'Camping', 'History'];

  const filteredDocs = docs.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.author.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'All' || d.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'leader';

  return (
    <div className="space-y-6 text-left">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="font-sans font-black text-xl text-brand-green flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-gold" />
            <span>⚜️ E-Library & Learning Center</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Access, read, and download official Scout manuals, knot books, and training resources. LKR Rs. 0.00 free education.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        )}
      </div>

      {/* Search & Category Filter Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search books, authors, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-green placeholder-slate-400"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto py-1 shrink-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Category:</span>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-brand-green text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map(doc => (
          <div 
            key={doc.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between hover:border-brand-gold/40 text-left"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="text-[9px] bg-brand-green/10 text-brand-green font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5 text-brand-gold" />
                  {doc.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold">
                  {doc.fileSizeMB} MB
                </span>
              </div>

              <h4 className="font-sans font-black text-sm text-slate-800 leading-snug">
                {doc.title}
              </h4>
              <p className="text-[10px] text-brand-gold-hover font-bold uppercase tracking-wider leading-none">
                By {doc.author}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed font-light pt-1">
                {doc.description}
              </p>
            </div>

            {/* Bottom action panel */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
              <span>Uploaded: {doc.uploadedAt} • {doc.downloadCount} downloads</span>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => triggerDownload(doc.id, doc.title)}
                  className="bg-brand-green hover:bg-brand-green-light text-white font-black uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                {canEdit && (
                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">No documents matching your filters or search.</p>
          </div>
        )}
      </div>

      {/* --- ADD DOCUMENT MODAL --- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-4">
            <h3 className="font-sans font-black text-lg text-brand-green border-b border-slate-100 pb-3">Upload E-Book Document</h3>
            <form onSubmit={handleAddDoc} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Document Title*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pioneering Manual Sri Lanka"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Author/Issuer*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SLSA Headquarters"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category*</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-600 focus:outline-none focus:border-brand-green cursor-pointer"
                  >
                    <option value="Manuals">Manuals</option>
                    <option value="Knotting">Knotting</option>
                    <option value="First Aid">First Aid</option>
                    <option value="Camping">Camping</option>
                    <option value="History">History</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">File Weight Size (MB)*</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 5.5"
                  value={fileSizeMB}
                  onChange={(e) => setFileSizeMB(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Short Overview Description</label>
                <textarea
                  placeholder="Summarize the core topics in this PDF book..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-green resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold uppercase hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-green text-white rounded-lg font-bold uppercase hover:bg-brand-green-light"
                >
                  Publish E-Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

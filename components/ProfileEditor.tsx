
import React from 'react';
import { User, Image as ImageIcon, X } from 'lucide-react';
import { Profile } from '../types.ts';

interface ProfileEditorProps {
  label: string;
  profile: Profile;
  onChange: (profile: Profile) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ label, profile, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <User size={16} className="text-slate-400" />
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={32} className="text-slate-300" />
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            <span className="text-white text-xs font-medium">Change</span>
          </label>
          {profile.avatar && (
            <button 
              onClick={() => onChange({ ...profile, avatar: '' })}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="w-full space-y-2">
          <input
            type="text"
            placeholder="Name"
            value={profile.name}
            onChange={(e) => onChange({ ...profile, name: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
          />
          <input
            type="text"
            placeholder="Subtitle"
            value={profile.subtext}
            onChange={(e) => onChange({ ...profile, subtext: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-slate-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;

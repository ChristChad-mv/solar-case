import React, { useState } from 'react';
import { generateVideo, generateImage, editImage, analyzeContent } from '../services/gemini';
import { Loader2, Video, Image as ImageIcon, Edit, Sparkles, X } from 'lucide-react';

interface AIToolsProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'veo' | 'imagen' | 'flash' | 'pro';

const AITools: React.FC<AIToolsProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<Mode>('veo');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
          const res = reader.result as string;
          // Remove Data URI prefix if API expects raw base64, 
          // but our service helper handles it or expects clean string.
          // The Google GenAI helper usually wants the base64 string WITHOUT prefix for some calls,
          // and WITH prefix for others. Let's strip it for the Service calls to be safe and consistent.
          const base64 = res.split(',')[1]; 
          resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let res;
      switch (mode) {
        case 'veo':
          // Veo Video Generation
          if (file) {
            const b64 = await fileToBase64(file);
            res = await generateVideo(prompt, b64);
          } else {
            res = await generateVideo(prompt);
          }
          break;
        case 'imagen':
          // Imagen Generation
          res = await generateImage(prompt);
          break;
        case 'flash':
          // Image Editing
          if (!file) throw new Error("Veuillez télécharger une image à éditer.");
          const b64Edit = await fileToBase64(file);
          res = await editImage(b64Edit, prompt);
          break;
        case 'pro':
          // Video/Content Analysis
          // Using text prompt as proxy for "Video Understanding" in this demo context
          // since we don't have a video upload pipeline to File API here.
          res = await analyzeContent(prompt, 'gemini-3-pro-preview');
          break;
      }
      setResult(res || "Tâche terminée.");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-96 bg-black/90 backdrop-blur-xl border-l border-white/10 p-6 z-50 shadow-2xl text-gray-100 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" /> Studio IA
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={() => setMode('veo')} className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${mode === 'veo' ? 'bg-blue-600 text-white' : 'bg-white/5 hover:bg-white/10'}`}>
            <Video className="w-4 h-4 inline mr-1"/> Vidéo Veo
        </button>
        <button onClick={() => setMode('imagen')} className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${mode === 'imagen' ? 'bg-purple-600 text-white' : 'bg-white/5 hover:bg-white/10'}`}>
            <ImageIcon className="w-4 h-4 inline mr-1"/> Imagen
        </button>
        <button onClick={() => setMode('flash')} className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${mode === 'flash' ? 'bg-green-600 text-white' : 'bg-white/5 hover:bg-white/10'}`}>
            <Edit className="w-4 h-4 inline mr-1"/> Éditer (Flash)
        </button>
        <button onClick={() => setMode('pro')} className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${mode === 'pro' ? 'bg-orange-600 text-white' : 'bg-white/5 hover:bg-white/10'}`}>
            <Sparkles className="w-4 h-4 inline mr-1"/> Analyse Pro
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="text-sm text-gray-400 mb-2">
            {mode === 'veo' && "Générez des vidéos 16:9 à partir de texte ou animez une image."}
            {mode === 'imagen' && "Générez des textures haute fidélité ou des concepts d'arrière-plan."}
            {mode === 'flash' && "Éditez des images conceptuelles via langage naturel."}
            {mode === 'pro' && "Analysez la logique d'assemblage ou le contenu."}
        </div>

        {(mode === 'veo' || mode === 'flash') && (
           <div>
             <label className="block text-xs font-medium text-gray-400 mb-1">Image de référence (Optionnel Veo, Requis Éditer)</label>
             <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-blue-400 hover:file:bg-white/20" />
           </div>
        )}

        <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Prompt (Consigne)</label>
            <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition h-24"
                placeholder={mode === 'pro' ? "Posez une question sur l'assemblage..." : "Décrivez le résultat attendu..."}
            />
        </div>

        <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 flex justify-center items-center gap-2"
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isLoading ? "Génération..." : "Lancer la Tâche IA"}
        </button>

        {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                {error}
            </div>
        )}

        {result && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Résultat</h3>
                {mode === 'veo' ? (
                    <video src={result} controls className="w-full rounded-lg" autoPlay loop />
                ) : mode === 'imagen' || mode === 'flash' ? (
                    <img src={result} alt="Résultat IA" className="w-full rounded-lg" />
                ) : (
                    <p className="text-sm leading-relaxed text-gray-300">{result}</p>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default AITools;

import React, { useState, useRef } from 'react';

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setAiResponse(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      /**
       * Hits the Spring Boot Backend:
       * POST /api/insight/edit-image
       */
      const response = await fetch('/api/insight/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: image,
          prompt: prompt,
          mimeType: mimeType
        })
      });

      if (!response.ok) throw new Error("Backend service failed to process image.");

      const data = await response.json();
      setAiResponse(data.result);
    } catch (err: any) {
      setError("The Spring Boot service was unable to process this request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent mb-4">
          Backend AI Vision
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Multi-modal analysis powered by Spring AI. Upload an image for the backend to interpret.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="glass-panel p-8 rounded-3xl flex flex-col justify-center border-t-4 border-t-emerald-500 shadow-xl shadow-black">
          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-900/30 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-900/10 transition-all group"
            >
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-slate-400 font-medium">Click to upload image</p>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative group">
                <img src={image} alt="Original" className="w-full h-auto max-h-80 object-contain rounded-xl shadow-2xl" />
                <button 
                  onClick={() => { setImage(null); setAiResponse(null); }}
                  className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-500/70 mb-2 uppercase tracking-wide">Vision Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask the AI to describe or analyze the image..."
                  className="w-full p-4 bg-slate-900 rounded-xl border border-emerald-900/30 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 min-h-[100px] resize-none"
                />
              </div>

              <button
                onClick={handleEdit}
                disabled={loading || !prompt.trim()}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-black font-bold rounded-xl transition-all shadow-xl shadow-emerald-900/20"
              >
                {loading ? 'Sending to Spring Boot...' : 'Analyze with Spring AI'}
              </button>
            </div>
          )}
        </div>

        <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center min-h-[400px] shadow-xl shadow-black">
          {aiResponse ? (
            <div className="w-full">
              <h3 className="text-lg font-bold text-emerald-100 mb-4 text-center">Backend Response</h3>
              <div className="p-6 bg-black/40 rounded-xl border border-emerald-500/20">
                <p className="text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">{aiResponse}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-600 p-8">
              <p className="text-lg font-medium text-slate-500">Backend response will appear here</p>
              <p className="text-sm">This process now bypasses the client-side SDK entirely.</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;

import React, { useState } from 'react';
import { usePosts, useCreatePost } from '../queries/postQueries';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusCircle, Send, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export const Home: React.FC = () => {
  const [limit, setLimit] = useState(4);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch posts hook
  const { data: posts, isLoading, isError, error, refetch, isFetching } = usePosts(limit);

  // Create post mutation hook
  const createPostMutation = useCreatePost();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    createPostMutation.mutate(
      {
        title,
        body,
        userId: 1,
      },
      {
        onSuccess: () => {
          setTitle('');
          setBody('');
          setSubmitSuccess(true);
          setTimeout(() => setSubmitSuccess(false), 4000);
        },
      }
    );
  };

  return (
    <div className="space-y-10">
      
      {/* Hello World Header Section */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-brand-900/40 via-dark-900/60 to-dark-900 border border-brand-500/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl">
          <span className="px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono uppercase tracking-wider rounded-full">
            Ready to Build
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 font-sans leading-tight">
            Hello World from React 19!
          </h2>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base font-sans leading-relaxed">
            This workspace is pre-configured with React Router, TanStack Query, Axios interceptors, TypeScript, and Tailwind CSS. Use this starter code to build out your modules.
          </p>
        </div>
      </section>

      {/* Grid Layout for API Interaction */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Create Post Form (Mutation Demonstration) */}
        <section className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-dark-900 border border-dark-800 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2.5 mb-6">
              <PlusCircle className="w-5 h-5 text-brand-400" />
              <h3 className="text-lg font-bold text-zinc-100 font-sans">
                Create Mock Post
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="post-title" className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Post Title
                </label>
                <input
                  id="post-title"
                  type="text"
                  placeholder="Enter a title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-dark-950 border border-dark-800 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 rounded-xl text-zinc-200 placeholder-zinc-600 outline-none text-sm transition-all font-sans"
                  required
                />
              </div>

              <div>
                <label htmlFor="post-body" className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Post Body Content
                </label>
                <textarea
                  id="post-body"
                  rows={4}
                  placeholder="Enter body content details..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-4 py-2.5 bg-dark-950 border border-dark-800 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 rounded-xl text-zinc-200 placeholder-zinc-600 outline-none text-sm transition-all font-sans resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={createPostMutation.isPending}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-500 active:scale-[0.98] disabled:bg-dark-800 disabled:text-zinc-600 disabled:scale-100 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 text-sm shadow-md"
              >
                {createPostMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" label="" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Mutation</span>
                  </>
                )}
              </button>
            </form>

            {/* Mutation Success Notification */}
            {submitSuccess && (
              <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-2.5 text-xs animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Success! Cache updated (appended locally).</span>
              </div>
            )}

            {/* Mutation Error Notification */}
            {createPostMutation.isError && (
              <div className="mt-4 p-3 bg-red-950/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2.5 text-xs">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>Error: {createPostMutation.error.message}</span>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Server State Query List */}
        <section className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-dark-900 border border-dark-800 rounded-2xl shadow-xl flex flex-col min-h-[400px]">
            
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-dark-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-400" />
                <h3 className="text-lg font-bold text-zinc-100 font-sans">
                  Server State Logs
                </h3>
                {isFetching && !isLoading && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
                )}
              </div>

              {/* Fetch Limit Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono">Limit:</span>
                <select
                  aria-label="Filter count"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="bg-dark-950 border border-dark-850 px-2 py-1 rounded text-xs text-zinc-400 focus:outline-none"
                >
                  <option value={2}>2 posts</option>
                  <option value={4}>4 posts</option>
                  <option value={6}>6 posts</option>
                  <option value={10}>10 posts</option>
                </select>
                <button
                  onClick={() => refetch()}
                  className="px-2 py-1 bg-dark-800 hover:bg-dark-750 text-zinc-400 hover:text-zinc-200 border border-dark-700 rounded text-xs transition-colors"
                >
                  Force Reload
                </button>
              </div>
            </div>

            {/* List States */}
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner label="Fetching Server Posts via Axios..." />
              </div>
            ) : isError ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-red-950/10 border border-red-500/10 rounded-xl">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                <h4 className="text-sm font-semibold text-zinc-200">Query Failed</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">{error?.message || 'Check connection settings.'}</p>
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-4 flex-1">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 bg-dark-950/50 hover:bg-dark-950 border border-dark-850 hover:border-brand-500/20 rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="px-2 py-1 bg-dark-900 border border-dark-800 text-[10px] text-zinc-500 font-mono rounded group-hover:text-brand-400 group-hover:border-brand-500/20 transition-colors">
                        ID: {post.id}
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors capitalize">
                          {post.title}
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          {post.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                No logs found.
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;

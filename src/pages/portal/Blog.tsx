import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, ArrowRight, Calendar, Eye, Sparkles, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { SEOHead } from '@/components/portal/SEOHead';
import { Breadcrumbs } from '@/components/portal/Breadcrumbs';
import { useBlogPosts, useBlogCategories, useContentSearch } from '@/hooks/useContentPortal';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { posts, loading: postsLoading } = useBlogPosts();
  const { posts: featuredPosts } = useBlogPosts({ featured: true, limit: 3 });
  const { categories, loading: categoriesLoading } = useBlogCategories();
  const { results: searchResults } = useContentSearch(searchQuery);

  const popularPosts = [...posts].sort((a, b) => b.view_count - a.view_count).slice(0, 5);

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category?.slug === selectedCategory)
    : posts;

  const getCategoryColor = (slug: string) => {
    const colors: Record<string, string> = {
      'dicas': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
      'guias': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      'tutoriais': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      'noticias': 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      'default': 'bg-slate-100 text-slate-700 hover:bg-slate-200'
    };
    return colors[slug] || colors['default'];
  };

  return (
    <PortalLayout>
      <SEOHead
        title="Blog - Dicas e Guias para Depósitos de Reciclagem"
        description="Aprenda como organizar seu depósito de reciclagem, controlar caixa, compras, vendas por kg e muito mais. Dicas práticas e guias completos."
      />

      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <Breadcrumbs items={[{ label: 'Blog' }]} />

          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              <Sparkles className="h-3 w-3 mr-1" />
              Conteúdo Exclusivo
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              Blog XLata
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Dicas práticas, guias completos e templates prontos para você organizar seu depósito de reciclagem e aumentar seus lucros.
            </p>

            {/* Enhanced Search */}
            <div className="relative max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                <Input
                  type="search"
                  placeholder="Buscar artigos, dicas, guias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-xl border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 shadow-lg shadow-emerald-100/50"
                />
              </div>
              {searchQuery && searchResults.posts.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-emerald-100 rounded-xl shadow-xl z-20 p-2 max-h-80 overflow-y-auto">
                  {searchResults.posts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="block p-3 hover:bg-emerald-50 rounded-lg transition-colors group"
                    >
                      <p className="font-medium text-slate-800 group-hover:text-emerald-600 transition-colors">{post.title}</p>
                      <p className="text-sm text-slate-500 line-clamp-1 mt-1">{post.excerpt}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Categories Scroll */}
          {!categoriesLoading && categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
                }`}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category.slug
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
                  }`}
                >
                  {category.icon && <span>{category.icon}</span>}
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && !selectedCategory && (
              <section className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Em Destaque</h2>
                </div>
                <div className="grid gap-6">
                  {/* Featured Main Card */}
                  {featuredPosts[0] && (
                    <Link to={`/blog/${featuredPosts[0].slug}`}>
                      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-emerald-100">
                        <div className="relative">
                          {featuredPosts[0].og_image ? (
                            <div className="relative h-64 md:h-80 overflow-hidden">
                              <img
                                src={featuredPosts[0].og_image}
                                alt={featuredPosts[0].title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                {featuredPosts[0].category && (
                                  <Badge className="mb-3 bg-emerald-500 hover:bg-emerald-600">
                                    {featuredPosts[0].category.name}
                                  </Badge>
                                )}
                                <h3 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-2">
                                  {featuredPosts[0].title}
                                </h3>
                                <p className="text-white/80 line-clamp-2 mb-3">
                                  {featuredPosts[0].excerpt}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-white/70">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {featuredPosts[0].reading_time_minutes} min
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {featuredPosts[0].view_count || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <CardContent className="p-6">
                              {featuredPosts[0].category && (
                                <Badge className="mb-3 bg-emerald-100 text-emerald-700">
                                  {featuredPosts[0].category.name}
                                </Badge>
                              )}
                              <h3 className="text-2xl font-bold mb-2 text-slate-800 group-hover:text-emerald-600 transition-colors">
                                {featuredPosts[0].title}
                              </h3>
                              <p className="text-slate-600 line-clamp-2">
                                {featuredPosts[0].excerpt}
                              </p>
                            </CardContent>
                          )}
                        </div>
                      </Card>
                    </Link>
                  )}
                  
                  {/* Secondary Featured Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featuredPosts.slice(1).map((post) => (
                      <Link key={post.id} to={`/blog/${post.slug}`}>
                        <Card className="h-full group hover:shadow-lg transition-all duration-300 border-emerald-100 hover:border-emerald-200">
                          <CardContent className="p-5">
                            {post.category && (
                              <Badge className={`mb-3 ${getCategoryColor(post.category.slug)}`}>
                                {post.category.name}
                              </Badge>
                            )}
                            <h3 className="font-semibold text-lg mb-2 text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-3">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.reading_time_minutes} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.view_count || 0}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* All Posts */}
            <section className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedCategory ? `Artigos: ${categories.find(c => c.slug === selectedCategory)?.name}` : 'Todos os Artigos'}
                </h2>
                <Badge variant="outline" className="border-slate-200 text-slate-500">
                  {filteredPosts.length} artigos
                </Badge>
              </div>
              
              {postsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse border-slate-100">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <div className="h-5 bg-slate-100 rounded w-24 mb-3"></div>
                            <div className="h-6 bg-slate-100 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                          </div>
                          <div className="w-32 h-24 bg-slate-100 rounded-lg hidden sm:block"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <Card className="border-slate-100">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-emerald-600" />
                    </div>
                    <p className="text-slate-600 font-medium">Nenhum artigo encontrado</p>
                    <p className="text-sm text-slate-400 mt-2">
                      Volte em breve para novos conteúdos!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 border-slate-100 hover:border-emerald-200 overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            {post.og_image && (
                              <div className="sm:w-48 h-48 sm:h-auto overflow-hidden">
                                <img
                                  src={post.og_image}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <div className="flex-1 p-5">
                              {post.category && (
                                <Badge className={`mb-3 ${getCategoryColor(post.category.slug)}`}>
                                  {post.category.name}
                                </Badge>
                              )}
                              <h3 className="font-semibold text-lg mb-2 text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                {post.title}
                              </h3>
                              <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {post.reading_time_minutes} min de leitura
                                </span>
                                {post.published_at && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(post.published_at).toLocaleDateString('pt-BR')}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {post.view_count || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* CTA Card */}
            <Card className="bg-gradient-to-br from-emerald-600 to-emerald-500 border-0 shadow-xl shadow-emerald-200/50 overflow-hidden">
              <CardContent className="p-6 relative">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full" />
                <div className="relative z-10">
                  <h3 className="font-bold text-xl mb-3 text-white">
                    Quer parar de perder dinheiro?
                  </h3>
                  <p className="text-sm text-emerald-100 mb-5">
                    O XLata.site organiza seu depósito e coloca cada centavo no lugar certo.
                  </p>
                  <Link to="/register">
                    <Button className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-semibold shadow-lg">
                      Organizar meu depósito
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Popular Posts */}
            {popularPosts.length > 0 && (
              <Card className="border-slate-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                    <div className="p-1.5 bg-orange-100 rounded">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                    </div>
                    Mais Lidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="flex items-start gap-4 group"
                    >
                      <span className="text-3xl font-bold text-emerald-200 group-hover:text-emerald-400 transition-colors w-8">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-slate-700 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <Eye className="h-3 w-3" />
                          {post.view_count || 0} views
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Newsletter */}
            <Card className="border-emerald-100 bg-emerald-50/50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-2">
                  📬 Receba nossas dicas
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Cadastre-se e receba conteúdos exclusivos sobre reciclagem.
                </p>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  className="mb-3 border-emerald-200 focus:border-emerald-400"
                />
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Inscrever-se
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Blog;

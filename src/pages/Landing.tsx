import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ResponsiveNavigation from "@/components/ResponsiveNavigation";
import MercadoPagoCheckout from "@/components/MercadoPagoCheckout";

import {
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  Calculator,
  Shield,
  AlertTriangle,
  TrendingDown,
  BarChart3,
  Target,
  Users,
  DollarSign,
  TrendingUp,
  Star,
  Crown,
  Calendar,
  Check,
  User2,
  BarChart,
} from "lucide-react";

import { PlanData } from "@/types/mercadopago";

interface TestimonialData {
  id?: string;
  name: string;
  company: string;
  location: string;
  rating: number;
  text: string;
  revenue: string;
  icon: string;
  profileImage?: string;
}

interface LandingContentSettings {
  id?: string;
  user_id: string;
  hero_badge_text: string;
  hero_main_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_button_text: string;
  logo_url: string;
  background_image_url: string;
  company_name: string;
  company_phone: string;
  footer_text: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  testimonials?: string | TestimonialData[];
}

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { updateMetaTags } = useSEO();
  const { user } = useAuth();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);

  const [contentSettings, setContentSettings] = useState<LandingContentSettings>({
    user_id: "",
    hero_badge_text: "EVOLUÇÃO NO SEU DEPÓSITO DE RECICLAGEM",
    hero_main_title: "Chega de papel, caneta e conta de cabeça",
    hero_subtitle:
      "Sistema online feito para depósitos de reciclagem, sucatas e ferros velhos que querem organização de verdade.",
    hero_description:
      "Ganhe velocidade na balança, controle total dos materiais e veja seu lucro em tempo real.",
    hero_button_text: "TESTAR GRÁTIS AGORA",
    logo_url: "/lovable-uploads/xlata.site_logotipo.png",
    background_image_url: "/lovable-uploads/capa_xlata.jpg",
    company_name: "XLata.site Gestor Completo",
    company_phone: "(11) 96351-2105",
    footer_text: "© 2025 XLata. Todos os direitos reservados.",
    seo_title:
      "Sistema para Depósito de Reciclagem e Ferro Velho | XLata.site – Balança, Estoque e Lucro",
    seo_description:
      "Sistema online para depósito de reciclagem, sucata e ferro velho. Controle de pesagem, estoque, clientes, notas e lucros em um só lugar. Teste grátis 7 dias, sem cartão.",
    seo_keywords:
      "sistema para depósito de reciclagem, sistema para reciclagem, programa para ferro velho, software para sucata, controle de balança, controle de materiais recicláveis, sistema PDV reciclagem, xlata, sistema sucata",
    testimonials: [],
  });

  const defaultTestimonials: TestimonialData[] = [
    {
      name: "Gabriel Celestino",
      company: "JMT Sucata",
      location: "São Bernardo do Campo - SP",
      rating: 5,
      text: "Cara, triplicou minha produtividade! O que levava 15 minutos agora levo 5. Fila acabou!",
      icon: "Rocket",
      revenue: "+R$ 8.000/mês",
      profileImage: "/lovable-uploads/clien01-xlata.png",
    },
    {
      name: "Felipe Nunes",
      company: "BH Sucatas",
      location: "Guarulhos - SP",
      rating: 5,
      text: "Acabaram os erros de conta e as brigas com cliente. Sistema perfeito, recomendo!",
      icon: "Award",
      revenue: "+R$ 12.000/mês",
      profileImage: "/lovable-uploads/clien02-xlata.png",
    },
    {
      name: "Hélio Machado",
      company: "HJM Recicla",
      location: "Três Corações - MG",
      rating: 5,
      text: "Paguei o sistema em 1 mês só com o que parei de perder. Melhor investimento da vida!",
      icon: "TrendingUp",
      revenue: "+R$ 15.000/mês",
      profileImage: "/lovable-uploads/clien03-xlata.png",
    },
    {
      name: "Roberto Fernandes",
      company: "Ferro & Aço Nordeste",
      location: "Fortaleza - CE",
      rating: 5,
      text: "Sistema revolucionou meu negócio! Agora controlo tudo pelo celular e o lucro aumentou muito.",
      icon: "Star",
      revenue: "+R$ 10.500/mês",
      profileImage: "/lovable-uploads/clien04-xlata.png",
    },
    {
      name: "Marcos Pereira",
      company: "Recicla Sul",
      location: "Curitiba - PR",
      rating: 5,
      text: "Antes perdia muito tempo com papelada. Hoje em dia é só pesar, apertar botão e pronto! Fantástico!",
      icon: "Award",
      revenue: "+R$ 9.200/mês",
      profileImage: "/lovable-uploads/clien05-xlata.jpg",
    },
    {
      name: "Eduardo Costa",
      company: "Metais do Centro-Oeste",
      location: "Campo Grande - MS",
      rating: 5,
      text: "Meus clientes adoraram a agilidade no atendimento. Recomendo demais, vale cada centavo!",
      icon: "TrendingUp",
      revenue: "+R$ 13.800/mês",
      profileImage: "/lovable-uploads/clien06-xlata.jpeg",
    },
  ];

  // SEO
  useEffect(() => {
    if (!contentSettings.seo_title) return;

    updateMetaTags({
      title: contentSettings.seo_title,
      description: contentSettings.seo_description,
      keywords: contentSettings.seo_keywords,
      author: "Rick Costa",
      ogTitle: contentSettings.seo_title,
      ogDescription: contentSettings.seo_description,
      ogImage: contentSettings.logo_url,
      twitterCard: "summary_large_image",
      robots: "index, follow",
      canonical: "https://xlata.lovable.app",
    });

    document.title = contentSettings.seo_title;

    const metaDescription = document.querySelector(
      'meta[name="description"]'
    );
    if (metaDescription) {
      metaDescription.setAttribute("content", contentSettings.seo_description);
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = contentSettings.seo_description;
      document.head.appendChild(newMetaDescription);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", contentSettings.seo_keywords);
    } else {
      const newMetaKeywords = document.createElement("meta");
      newMetaKeywords.name = "keywords";
      newMetaKeywords.content = contentSettings.seo_keywords;
      document.head.appendChild(newMetaKeywords);
    }
  }, [contentSettings, updateMetaTags]);

  useEffect(() => {
    loadContentSettings();
    loadPlansData();

    const handleConfigUpdate = (event: CustomEvent) => {
      console.log("Configuração de landing atualizada, recarregando...");
      loadContentSettings();
      loadPlansData();
    };

    window.addEventListener(
      "landingConfigUpdated",
      handleConfigUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "landingConfigUpdated",
        handleConfigUpdate as EventListener
      );
    };
  }, []);

  const loadContentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("landing_page_settings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar configurações:", error);
        setTestimonials(defaultTestimonials);
        return;
      }

      if (data) {
        const settingsData: LandingContentSettings = {
          ...data,
          testimonials: data.testimonials || "[]",
        };

        setContentSettings(settingsData);

        let parsedTestimonials: TestimonialData[] = [];

        if (data.testimonials) {
          try {
            parsedTestimonials =
              typeof data.testimonials === "string"
                ? JSON.parse(data.testimonials)
                : data.testimonials;

            parsedTestimonials = parsedTestimonials.map((testimonial) => ({
              ...testimonial,
              profileImage: testimonial.profileImage || "",
            }));
          } catch (parseError) {
            console.error("Erro ao fazer parse dos depoimentos:", parseError);
            parsedTestimonials = defaultTestimonials;
          }
        } else {
          parsedTestimonials = defaultTestimonials;
        }

        if (Array.isArray(parsedTestimonials) && parsedTestimonials.length > 0) {
          setTestimonials(parsedTestimonials);
        } else {
          setTestimonials(defaultTestimonials);
        }
      } else {
        console.log("Nenhuma configuração encontrada, usando padrão");
        setTestimonials(defaultTestimonials);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações da landing:", error);
      setTestimonials(defaultTestimonials);
    }
  };

  const loadPlansData = async () => {
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;

      const formattedPlans =
        data?.map((plan) => ({
          id: plan.plan_id,
          name: plan.name,
          price:
            plan.is_promotional && plan.promotional_price
              ? `R$ ${plan.promotional_price.toFixed(2).replace(".", ",")}`
              : `R$ ${plan.price.toFixed(2).replace(".", ",")}`,
          period:
            plan.is_promotional && plan.promotional_period
              ? plan.promotional_period
              : plan.period,
          description: plan.description,
          icon: plan.is_promotional ? (
            <Badge className="h-6 w-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
              🔥
            </Badge>
          ) : plan.is_popular ? (
            <Crown className="h-6 w-6" />
          ) : (
            <Calendar className="h-6 w-6" />
          ),
          popular: plan.is_popular,
          promotional: plan.is_promotional,
          savings:
            plan.is_promotional && plan.promotional_description
              ? plan.promotional_description
              : plan.savings,
          amount:
            plan.is_promotional && plan.promotional_price
              ? plan.promotional_price
              : plan.amount,
        })) || [];

      setPlans(formattedPlans);
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
      setPlans([
        {
          id: "promocional",
          name: "Plano Promocional",
          price: "R$ 97,90",
          period: "/mês nos 3 primeiros meses",
          description: "Oferta especial limitada",
          icon: (
            <Badge className="h-6 w-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
              🔥
            </Badge>
          ),
          popular: false,
          promotional: true,
          savings: "Depois R$ 147,90/mês",
          amount: 97.9,
        },
        {
          id: "mensal",
          name: "Plano Mensal",
          price: "R$ 147,90",
          period: "/mês",
          description: "Ideal para começar",
          icon: <Calendar className="h-6 w-6" />,
          popular: false,
          savings: null,
          amount: 147.9,
        },
        {
          id: "trimestral",
          name: "Plano Trimestral",
          price: "R$ 387,90",
          period: "/3 meses",
          description: "Melhor custo-benefício",
          icon: <Crown className="h-6 w-6" />,
          popular: true,
          savings: "Economize R$ 56,80",
          amount: 387.9,
        },
        {
          id: "trienal",
          name: "Plano Trienal",
          price: "R$ 4.497,90",
          period: "/3 anos",
          description: "Máxima economia",
          icon: <Star className="h-6 w-6" />,
          popular: false,
          savings: "Economize R$ 884,50",
          amount: 4497.9,
        },
      ]);
    }
  };

  const handleSelectPlan = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const planData: PlanData = {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      amount: plan.amount,
    };

    setSelectedPlan(planData);
    setIsCheckoutOpen(true);
  };

  // COPY (mesma que já criamos, só reorganizada visualmente)
  const problems = [
    {
      icon: Clock,
      title: "Fila na balança = caminhão indo embora",
      loss: "R$ 3.500/mês",
      description:
        "Caminhões e carroceiros cansam de esperar, desistem da descarga e vão vender no depósito do concorrente.",
      urgency: "CRÍTICO",
    },
    {
      icon: Calculator,
      title: "Erro de cálculo e material = prejuízo direto",
      loss: "R$ 2.800/mês",
      description:
        "Peso anotado errado, tipo de material trocado, preço por kg confundido – cada erro é dinheiro saindo do seu caixa.",
      urgency: "ALTO",
    },
    {
      icon: AlertTriangle,
      title: "Fornecedor desconfiado não volta",
      loss: "R$ 4.200/mês",
      description:
        "Papel rabiscado, conta confusa, sem comprovante claro – o fornecedor acha que perdeu dinheiro e procura outro depósito.",
      urgency: "CRÍTICO",
    },
    {
      icon: TrendingDown,
      title: "Papelada bagunçada = não sabe se lucrou",
      loss: "R$ 2.100/mês",
      description:
        "Caderninho rasgado, notas misturadas e planilhas soltas. Você não sabe quanto tem de cobre, alumínio, ferro ou plástico… nem quanto realmente ganhou.",
      urgency: "ALTO",
    },
    {
      icon: BarChart3,
      title: "Fiscalização = multa e dor de cabeça",
      loss: "R$ 5.000/mês",
      description:
        "Quando Receita ou fiscalização batem na porta, cadê relatório, cadastro, histórico e organização? Sem sistema, a chance de multa é enorme.",
      urgency: "CRÍTICO",
    },
    {
      icon: Target,
      title: "Concorrência organizada te ultrapassando",
      loss: "R$ 6.800/mês",
      description:
        "Depósito do lado já modernizou, gera comprovante, paga certinho e sabe quanto pode oferecer. Seus melhores fornecedores começam a migrar.",
      urgency: "EMERGÊNCIA",
    },
  ];

  const benefits = [
    {
      icon: Clock,
      label: "Produtividade",
      title: "Acabe com a fila na balança",
      description:
        "Atenda muito mais caminhões e carroceiros por dia. O sistema calcula tudo sozinho e libera a balança em poucos minutos.",
      tag: "Até 300% mais produtividade",
    },
    {
      icon: Calculator,
      label: "Precisão",
      title: "Zero erros de pesagem e de preço",
      description:
        "Nada de peso anotado errado, tipo de material trocado ou conta feita na pressa. O sistema soma tudo com precisão de centavos.",
      tag: "100% de precisão nos cálculos",
    },
    {
      icon: Shield,
      label: "Confiança",
      title: "Fornecedor confia e volta sempre",
      description:
        "Comprovante profissional, pesagem transparente e histórico de cada carga. Quem vende pra você se sente seguro e volta com mais material.",
      tag: "Muito mais fidelização",
    },
  ];

  const features = [
    {
      icon: User2,
      badge: "Gestão inteligente",
      title: "Controle total de clientes e fornecedores",
      description:
        "Histórico completo de quem vende e de quem compra. Veja quanto cada cliente já trouxe, o que trouxe, quando trouxe e quanto você pagou.",
    },
    {
      icon: BarChart,
      badge: "Controle financeiro",
      title: "Lucro do depósito na palma da mão",
      description:
        "Dashboard mostra quanto entrou hoje, ontem, na semana e no mês. Veja se o depósito está dando lucro ou só girando dinheiro.",
    },
    {
      icon: Users,
      badge: "130+ clientes",
      title: "Mais de 130 depósitos e ferros velhos",
      description:
        "Do Norte ao Sul do Brasil, empresas de reciclagem usam o XLata.site para organizar o pátio e aumentar o faturamento.",
    },
    {
      icon: MessageSquare,
      badge: "Suporte 24h",
      title: "Suporte WhatsApp 24/7",
      description:
        "Travou, ficou com dúvida ou precisa ajustar algo? Chama no WhatsApp e nosso time te ajuda a resolver na hora.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-white">
      {/* NAV */}
      <ResponsiveNavigation
        logoUrl={contentSettings.logo_url}
        companyName={contentSettings.company_name}
        companyPhone={contentSettings.company_phone}
      />

      {/* HERO NOVO – 2 colunas */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at top, rgba(22, 163, 74,0.4), transparent 55%), radial-gradient(circle at bottom, rgba(34,197,94,0.35), transparent 55%)`,
          }}
        />
        <div className="container mx-auto px-4 py-10 lg:py-20 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Texto principal */}
            <div>
              <Badge className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-400 text-black font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                {contentSettings.hero_badge_text}
              </Badge>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-4">
                <span className="bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
                  {contentSettings.hero_main_title}
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-3">
                {contentSettings.hero_subtitle}
              </p>

              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-emerald-300 mb-6">
                {contentSettings.hero_description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/register")}
                  className="bg-emerald-500 hover:bg-emerald-600 text-black font-black text-lg px-8 py-6 rounded-xl shadow-[0_0_40px_rgba(16,185,129,0.6)] flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  {contentSettings.hero_button_text}
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <p className="text-xs sm:text-sm text-gray-300 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    7 dias grátis
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Sem cartão
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Suporte WhatsApp
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-400">
                <Users className="w-4 h-4 text-emerald-300" />
                <span>Mais de 130 depósitos e ferros velhos em todo o Brasil</span>
              </div>
            </div>

            {/* “Tela” do sistema / resumo visual */}
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full" />
              <Card className="relative bg-slate-900/80 border-emerald-500/30 shadow-2xl shadow-emerald-500/40 backdrop-blur-xl">
                <CardHeader className="flex flex-col gap-2 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-gray-300">
                      Visão geral do depósito
                    </CardTitle>
                    <Badge className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                      Em tempo real
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400">
                    Exemplo de como o XLata.site mostra faturamento e fluxo do dia.
                  </p>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-800/80 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] uppercase text-gray-400 mb-1">
                        Lucro estimado hoje
                      </p>
                      <p className="text-lg font-bold text-emerald-300">
                        R$ 3.870,00
                      </p>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        +22% vs ontem
                      </span>
                    </div>
                    <div className="bg-slate-800/80 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] uppercase text-gray-400 mb-1">
                        Cargas atendidas
                      </p>
                      <p className="text-lg font-bold text-white">18</p>
                      <span className="text-[11px] text-gray-400">
                        Média 3 min/carga
                      </span>
                    </div>
                    <div className="bg-slate-800/80 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] uppercase text-gray-400 mb-1">
                        Erros de cálculo
                      </p>
                      <p className="text-lg font-bold text-emerald-400">
                        0
                      </p>
                      <span className="text-[11px] text-emerald-400">
                        Zero prejuízo
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-800/60 rounded-xl p-3 border border-white/5 space-y-2">
                    <p className="text-[11px] text-gray-400">
                      Principais materiais do dia
                    </p>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Ferro misto</span>
                        <span className="text-gray-400">12,4 t</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Alumínio</span>
                        <span className="text-gray-400">1,8 t</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Cobre</span>
                        <span className="text-gray-400">650 kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-emerald-400" />
                      Dados protegidos e com backup automático
                    </span>
                    <span>Exemplo ilustrativo do sistema</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO ANTES x DEPOIS */}
      <section className="border-b border-white/5 bg-slate-950/70">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            <div className="flex-1">
              <h2 className="text-2xl lg:text-3xl font-black mb-2">
                De depósito bagunçado para{" "}
                <span className="text-emerald-400">operação organizada</span>
              </h2>
              <p className="text-sm lg:text-base text-gray-300 mb-6 max-w-xl">
                Todo depósito de reciclagem começa igual: papel, caderninho,
                calculadora velha e muita conta de cabeça. O XLata.site entra
                justamente aqui: transforma esse caos em números claros e lucro
                previsível.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <Card className="bg-red-950/40 border-red-500/40">
                  <CardHeader className="pb-2">
                    <Badge className="bg-red-600/80 text-white mb-2">
                      ANTES — MODO “APAGA INCÊNDIO”
                    </Badge>
                    <CardTitle className="text-base text-red-100">
                      Tudo no papel e na memória
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-[13px] text-red-100/90">
                    <p>• Fila na balança e caminhão indo embora;</p>
                    <p>
                      • Peso anotado errado e preço por kg confundido na
                      correria;
                    </p>
                    <p>
                      • Caderninho rasgado, nota perdida e lucro que ninguém
                      sabe;
                    </p>
                    <p>• Medo da fiscalização bater na porta.</p>
                  </CardContent>
                </Card>

                <Card className="bg-emerald-950/40 border-emerald-500/40">
                  <CardHeader className="pb-2">
                    <Badge className="bg-emerald-500/80 text-black mb-2">
                      DEPOIS — MODO “DEPÓSITO PROFISSIONAL”
                    </Badge>
                    <CardTitle className="text-base text-emerald-100">
                      Tudo dentro do XLata.site
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-[13px] text-emerald-100/90">
                    <p>
                      • Pesagem rápida, cálculo automático e comprovante
                      profissional;
                    </p>
                    <p>
                      • Histórico por cliente e fornecedor, com materiais e
                      valores;
                    </p>
                    <p>
                      • Dashboard mostrando lucro do dia, da semana e do mês;
                    </p>
                    <p>• Relatórios prontos para fiscalização.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bloco de ROI rápido */}
            <div className="w-full lg:w-[360px]">
              <Card className="bg-gradient-to-br from-emerald-900/80 to-slate-900 border-emerald-500/50 shadow-xl shadow-emerald-500/40 h-full">
                <CardHeader>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 mb-2">
                    RETORNO MÉDIO EM 28 DIAS
                  </Badge>
                  <CardTitle className="text-lg font-bold text-emerald-100">
                    Em quanto tempo o XLata.se paga?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Lucro adicional / mês</span>
                    <span className="text-lg font-bold text-emerald-300">
                      R$ 12.000
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      Tempo médio para se pagar
                    </span>
                    <span className="text-lg font-bold text-emerald-300">
                      28 dias
                    </span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-emerald-900/60 overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-emerald-400 to-emerald-500" />
                  </div>

                  <p className="text-[13px] text-emerald-100/90">
                    Depósitos de reciclagem que começam a usar o XLata.site
                    normalmente recuperam o valor investido em menos de 1 mês,
                    apenas com o que param de perder em erro de conta e má
                    gestão.
                  </p>

                  <Button
                    size="sm"
                    onClick={() => navigate("/register")}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold mt-2"
                  >
                    Testar grátis por 7 dias
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO PROBLEMAS — GRID ENXUTO */}
      <section className="border-b border-white/5 bg-gradient-to-b from-slate-950 to-black">
        <div className="container mx-auto px-4 py-12 lg:py-18">
          <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
            <div>
              <Badge className="bg-red-600/80 text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Seu depósito pode estar vazando dinheiro
              </Badge>
              <h2 className="text-2xl lg:text-3xl font-black text-red-100 mb-2">
                Os 6 ladrões que comem o lucro do seu depósito todos os dias
              </h2>
              <p className="text-sm lg:text-base text-gray-300 max-w-xl">
                Sem controle, cada espera na balança, cada conta errada e cada
                papel perdido viram dinheiro indo embora sem você perceber.
              </p>
            </div>

            <div className="bg-red-950/40 border border-red-500/40 rounded-2xl px-4 py-3 text-sm text-red-100 max-w-sm">
              💸 Estimativa média:{" "}
              <span className="font-bold text-red-200">
                R$ 292.800,00 por ano
              </span>{" "}
              em perdas que poderiam virar lucro no seu depósito.
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 lg:gap-6 text-sm">
            {problems.map((p, idx) => (
              <Card
                key={idx}
                className="bg-slate-900/80 border border-red-500/40 hover:border-red-400/70 transition-colors"
              >
                <CardHeader className="pb-2 flex flex-row items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                    <p.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-red-700/80 text-red-100 mb-1 text-[10px]">
                      Urgência: {p.urgency}
                    </Badge>
                    <CardTitle className="text-sm text-red-100">
                      {p.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-1 space-y-3">
                  <p className="text-[13px] text-gray-200">{p.description}</p>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-gray-400">Perda aproximada</span>
                    <span className="font-bold text-red-200">-{p.loss}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS PRINCIPAIS */}
      <section className="border-b border-white/5 bg-slate-950/80">
        <div className="container mx-auto px-4 py-12 lg:py-18">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 mb-3">
              A solução que organiza seu depósito
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-black mb-3">
              O que muda quando você coloca o XLata.site no centro da operação
            </h2>
            <p className="text-sm lg:text-base text-gray-300">
              O sistema foi pensado especificamente para depósitos de reciclagem
              e ferros velhos. Não é um programa genérico adaptado — é uma
              ferramenta criada para a realidade do pátio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 text-sm">
            {benefits.map((b, i) => (
              <Card
                key={i}
                className="bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-400/70 transition-colors"
              >
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                      <b.icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge className="bg-emerald-500/15 text-emerald-200 border border-emerald-400/50 text-[10px]">
                      {b.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-base text-emerald-100">
                    {b.title}
                  </CardTitle>
                  <Badge className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 text-[10px]">
                    {b.tag}
                  </Badge>
                </CardHeader>
                <CardContent className="text-[13px] text-gray-200">
                  {b.description}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features */}
          <div className="mt-12 grid md:grid-cols-2 gap-5 text-sm">
            {features.map((f, i) => (
              <Card
                key={i}
                className="bg-slate-900/80 border border-white/10 hover:border-emerald-400/60 transition-colors"
              >
                <CardHeader className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <Badge className="bg-emerald-500/15 text-emerald-200 border border-emerald-400/40 text-[10px] mb-1">
                      {f.badge}
                    </Badge>
                    <CardTitle className="text-sm">{f.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-[13px] text-gray-200">
                  {f.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL + NÚMEROS */}
      <section className="border-b border-white/5 bg-black">
        <div className="container mx-auto px-4 py-12 lg:py-18">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Números */}
            <div className="w-full lg:w-1/3 space-y-5">
              <h2 className="text-xl lg:text-2xl font-black mb-1">
                Números de quem já usa o XLata.site no dia a dia
              </h2>
              <p className="text-sm text-gray-300">
                São depósitos de reciclagem, sucatas e ferros velhos que saíram
                do papel e hoje controlam tudo pelo sistema.
              </p>

              <div className="space-y-3 text-sm">
                <Card className="bg-slate-900/80 border border-emerald-500/40">
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-gray-400">
                        Lucro adicional / mês
                      </p>
                      <p className="text-2xl font-black text-emerald-300">
                        R$ 12.000
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-emerald-400" />
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/80 border border-emerald-500/40">
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-gray-400">
                        Tempo para se pagar
                      </p>
                      <p className="text-2xl font-black text-emerald-300">
                        28 dias
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-emerald-400" />
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/80 border border-emerald-500/40">
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-gray-400">
                        Depósitos e ferros velhos
                      </p>
                      <p className="text-2xl font-black text-emerald-300">
                        130+
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-emerald-400" />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Depoimentos */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge className="bg-yellow-500/15 text-yellow-300 border border-yellow-400/40 mb-2">
                    Depoimentos reais
                  </Badge>
                  <h3 className="text-lg lg:text-xl font-bold">
                    O que outros donos de depósito falam do XLata.site
                  </h3>
                </div>
                <Star className="w-8 h-8 text-yellow-400" />
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                {testimonials.slice(0, 3).map((t, i) => (
                  <Card
                    key={t.id || i}
                    className="bg-slate-900/80 border border-yellow-400/40"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        {[...Array(t.rating)].map((_, idx) => (
                          <Star
                            key={idx}
                            className="w-3 h-3 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                      <CardTitle className="text-sm text-white">
                        {t.name}
                      </CardTitle>
                      <p className="text-[11px] text-gray-400">
                        {t.company} • {t.location}
                      </p>
                      <Badge className="mt-1 bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 text-[10px]">
                        {t.revenue}
                      </Badge>
                    </CardHeader>
                    <CardContent className="text-[12px] text-gray-200 italic">
                      “{t.text}”
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLANOS – NOVO LAYOUT */}
      <section className="border-b border-white/5 bg-slate-950">
        <div className="container mx-auto px-4 py-12 lg:py-18">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 mb-3">
              Planos para todo tipo de depósito
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-black mb-3">
              Escolha como você quer crescer com o XLata.site
            </h2>
            <p className="text-sm lg:text-base text-gray-300">
              Todos os planos incluem acesso completo ao sistema, suporte por
              WhatsApp e atualizações constantes — sem surpresa escondida.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`bg-slate-900 border ${
                  plan.promotional
                    ? "border-emerald-400 ring-2 ring-emerald-400/70"
                    : plan.popular
                    ? "border-emerald-500/60"
                    : "border-white/10"
                }`}
              >
                <CardHeader className="text-center space-y-2">
                  <div className="flex justify-center mb-1 text-emerald-400">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-base lg:text-lg">
                    {plan.name}
                  </CardTitle>
                  <p className="text-xs text-gray-400">{plan.description}</p>
                  <div className="mt-2">
                    <span className="text-2xl lg:text-3xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 text-xs ml-1">
                      {plan.period}
                    </span>
                  </div>
                  {plan.savings && (
                    <Badge className="mt-1 bg-emerald-500/10 text-emerald-300 border border-emerald-400/50 text-[10px]">
                      {plan.savings}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="space-y-2 text-[13px] text-gray-200">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Sistema PDV completo para reciclagem e sucata</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Controle de estoque e materiais por categoria</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Relatórios detalhados para gestão e fiscalização</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Suporte WhatsApp sempre disponível</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full mt-2 ${
                      plan.promotional
                        ? "bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
                        : plan.popular
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        : "bg-slate-800 hover:bg-slate-700 text-white"
                    } flex items-center justify-center gap-2`}
                  >
                    <Crown className="w-4 h-4" />
                    Assinar plano
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => navigate("/planos")}
              className="border border-emerald-400 text-emerald-300 hover:bg-emerald-500 hover:text-black transition-colors text-sm"
            >
              Ver todos os detalhes dos planos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-500">
        <div className="container mx-auto px-4 py-10 lg:py-16 text-center text-black">
          <h2 className="text-2xl lg:text-3xl font-black mb-3">
            Pronto para parar de perder dinheiro no seu depósito?
          </h2>
          <p className="text-sm lg:text-base max-w-xl mx-auto mb-6">
            Teste o XLata.site por 7 dias, sem cartão, e veja a diferença na
            balança, na papelada e no seu lucro. Se não fizer sentido pra você,
            basta cancelar.
          </p>

          <Button
            size="lg"
            onClick={() => navigate("/register")}
            className="bg-black text-emerald-300 hover:bg-slate-900 font-black text-lg px-10 py-6 rounded-xl flex items-center justify-center gap-2 mx-auto"
          >
            <Zap className="w-5 h-5" />
            Começar teste grátis agora
            <ArrowRight className="w-5 h-5" />
          </Button>

          <div className="mt-4 flex flex-wrap justify-center gap-3 text-[11px] text-black/80 font-semibold">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-900" />
              7 dias grátis
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-900" />
              Sem cartão
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-900" />
              Suporte WhatsApp
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/10">
        <div className="container mx-auto px-4 py-6 text-center text-xs sm:text-sm text-gray-400 space-y-2">
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/termos-de-uso")}
              className="text-gray-400 hover:text-white text-xs"
            >
              Termos de Uso
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/guia-completo")}
              className="text-gray-400 hover:text-white text-xs"
            >
              Guia Completo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/planos")}
              className="text-gray-400 hover:text-white text-xs"
            >
              Planos
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="text-gray-400 hover:text-white text-xs"
            >
              Área do Cliente
            </Button>
          </div>
          <p className="font-semibold">
            © {new Date().getFullYear()} XLata.site. Todos os direitos
            reservados.
          </p>
          <p className="text-[11px] text-gray-500">
            Sistema XLata para Depósitos de Reciclagem e Ferros Velhos – Tecnologia que Gera Lucro
          </p>
        </div>
      </footer>

      {selectedPlan && (
        <MercadoPagoCheckout
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setSelectedPlan(null);
          }}
          selectedPlan={selectedPlan}
        />
      )}
    </div>
  );
};

export default Landing;

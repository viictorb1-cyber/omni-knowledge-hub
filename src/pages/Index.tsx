import { Header } from '@/components/Header';
import { SolutionCard } from '@/components/SolutionCard';
import { useArticleStore } from '@/stores/articleStore';
import { Phone, MessageSquare } from 'lucide-react';

const Index = () => {
  const { articles } = useArticleStore();
  
  const pabxCount = articles.filter(a => a.category === 'pabx').length;
  const omniCount = articles.filter(a => a.category === 'omni').length;

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />
      
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Central de Conhecimento
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acesse documentações, tutoriais e guias das nossas soluções. 
            Encontre rapidamente as informações que você precisa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <SolutionCard
            title="PABX"
            description="Documentação completa sobre a solução de telefonia PABX, incluindo configurações, troubleshooting e boas práticas."
            icon={Phone}
            articleCount={pabxCount}
            href="/solucao/pabx"
            variant="pabx"
          />
          
          <SolutionCard
            title="OMNI"
            description="Guias e tutoriais da plataforma Omnichannel, integração de canais, configuração de fluxos e relatórios."
            icon={MessageSquare}
            articleCount={omniCount}
            href="/solucao/omni"
            variant="omni"
          />
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Não encontrou o que procura? Entre em contato com o suporte.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;

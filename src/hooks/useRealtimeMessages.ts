import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface RealtimeMessage {
  id: string;
  sender_name: string;
  title: string;
  message: string;
  created_at: string;
}

export const useRealtimeMessages = () => {
  const [unreadMessages, setUnreadMessages] = useState<RealtimeMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<RealtimeMessage | null>(null);
  
  // Use refs to prevent re-renders causing listener recreation
  const processedMessagesRef = useRef<Set<string>>(new Set());
  const isInitializedRef = useRef(false);

  // Buscar mensagens não lidas ao inicializar
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    fetchUnreadMessages();
  }, []);

  // Configurar listener para mensagens em tempo real - SEM dependências para evitar loop
  useEffect(() => {
    const channel = supabase
      .channel('admin_realtime_messages_listener')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_realtime_messages'
        },
        (payload) => {
          console.log('Nova mensagem recebida:', payload);
          const newMessage = payload.new as any;
          
          // Verificar se já foi processada usando ref
          if (processedMessagesRef.current.has(newMessage.id)) {
            console.log('Mensagem já processada, ignorando:', newMessage.id);
            return;
          }
          
          // Verificar se a mensagem é para o usuário atual
          supabase.auth.getUser().then(({ data: { user } }) => {
            if (user && newMessage.target_user_id === user.id) {
              const message: RealtimeMessage = {
                id: newMessage.id,
                sender_name: newMessage.sender_name,
                title: newMessage.title,
                message: newMessage.message,
                created_at: newMessage.created_at
              };
              
              // Marcar como processada usando ref
              processedMessagesRef.current.add(newMessage.id);
              
              setUnreadMessages(prev => [message, ...prev]);
              
              // Se não há mensagem sendo exibida, mostrar esta
              setCurrentMessage(prev => prev || message);
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Array vazio - listener criado apenas uma vez

  const fetchUnreadMessages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('admin_realtime_messages')
        .select('id, sender_name, title, message, created_at')
        .eq('target_user_id', user.id)
        .eq('is_read', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar mensagens:', error);
        return;
      }

      if (data && data.length > 0) {
        console.log('Mensagens não lidas encontradas:', data.length);
        const messages = data.map(msg => ({
          id: msg.id,
          sender_name: msg.sender_name,
          title: msg.title,
          message: msg.message,
          created_at: msg.created_at
        }));
        
        // Marcar todas como processadas usando ref
        messages.forEach(msg => processedMessagesRef.current.add(msg.id));
        
        setUnreadMessages(messages);
        setCurrentMessage(messages[0]);
      } else {
        console.log('Nenhuma mensagem não lida encontrada');
        setUnreadMessages([]);
        setCurrentMessage(null);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      console.log('Marcando mensagem como lida:', messageId);
      
      const { error } = await supabase
        .from('admin_realtime_messages')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) {
        console.error('Erro ao marcar mensagem como lida:', error);
        throw error;
      }

      console.log('Mensagem marcada como lida com sucesso');

      // Atualizar estados de forma segura
      setUnreadMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== messageId);
        
        // Atualizar currentMessage baseado nas mensagens restantes
        setCurrentMessage(current => {
          if (current?.id === messageId) {
            return filtered.length > 0 ? filtered[0] : null;
          }
          return current;
        });
        
        return filtered;
      });
      
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar mensagem. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, []);

  const dismissCurrentMessage = useCallback(() => {
    console.log('Descartando mensagem atual');
    setCurrentMessage(current => {
      if (current) {
        markAsRead(current.id);
      }
      return null; // Limpar imediatamente para evitar re-exibição
    });
  }, [markAsRead]);

  return {
    unreadMessages,
    currentMessage,
    dismissCurrentMessage,
    fetchUnreadMessages
  };
};

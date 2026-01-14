import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Pencil, Trash2, GripVertical, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MaterialCategory } from '@/types/pdv';
import { getMaterialCategories, saveMaterialCategory, removeMaterialCategory } from '@/utils/supabaseStorage';
import { CATEGORY_COLORS, CATEGORY_COLOR_OPTIONS } from './CategoryBar';
import { cn } from '@/lib/utils';

interface CategoryManagementModalProps {
  open: boolean;
  onClose: () => void;
  onCategoriesChanged?: () => void;
}

const CategoryManagementModal: React.FC<CategoryManagementModalProps> = ({
  open,
  onClose,
  onCategoriesChanged
}) => {
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MaterialCategory | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('blue');

  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const cats = await getMaterialCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar categorias",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicates
    if (categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      toast({
        title: "Erro",
        description: "Já existe uma categoria com este nome",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const newCategory = await saveMaterialCategory({
        id: crypto.randomUUID(),
        name: newCategoryName.trim(),
        color: newCategoryColor,
        display_order: categories.length
      });

      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      setNewCategoryColor('blue');
      setIsAdding(false);
      onCategoriesChanged?.();

      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso"
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar categoria",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;

    setIsLoading(true);
    try {
      const updated = await saveMaterialCategory({
        id: editingCategory.id,
        name: editingCategory.name.trim(),
        color: editingCategory.color,
        display_order: editingCategory.display_order
      });

      setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
      setEditingCategory(null);
      onCategoriesChanged?.();

      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso"
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar categoria",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setIsLoading(true);
    try {
      await removeMaterialCategory(categoryId);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      onCategoriesChanged?.();

      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso"
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir categoria",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ColorPicker: React.FC<{ value: string; onChange: (color: string) => void }> = ({ value, onChange }) => (
    <div className="flex flex-wrap gap-1.5">
      {CATEGORY_COLOR_OPTIONS.map((option) => {
        const colors = CATEGORY_COLORS[option.value];
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'w-7 h-7 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
              colors.bg,
              value === option.value 
                ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800 border-white' 
                : 'border-transparent hover:scale-110'
            )}
            title={option.label}
          >
            {value === option.value && <Check className="w-3.5 h-3.5 text-white" />}
          </button>
        );
      })}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar Categorias</DialogTitle>
          <DialogDescription className="text-slate-400">
            Crie, edite ou exclua categorias de materiais
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Add new category form */}
          {isAdding ? (
            <div className="bg-slate-700/50 rounded-lg p-3 space-y-3">
              <div className="space-y-2">
                <Label className="text-white text-sm">Nome da categoria</Label>
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ex: Metais Ferrosos"
                  className="bg-slate-700 border-slate-600 text-white"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white text-sm">Cor</Label>
                <ColorPicker value={newCategoryColor} onChange={setNewCategoryColor} />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddCategory}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Check className="w-4 h-4 mr-1" /> Salvar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewCategoryName('');
                    setNewCategoryColor('blue');
                  }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <X className="w-4 h-4 mr-1" /> Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setIsAdding(true)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar Categoria
            </Button>
          )}

          {/* Categories list */}
          <ScrollArea className="h-[280px]">
            <div className="space-y-2 pr-2">
              {isLoading && categories.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  Carregando...
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  Nenhuma categoria cadastrada
                </div>
              ) : (
                categories.map((category) => {
                  const colors = CATEGORY_COLORS[category.color] || CATEGORY_COLORS.blue;
                  const isEditing = editingCategory?.id === category.id;

                  return (
                    <div
                      key={category.id}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-lg transition-all',
                        isEditing ? 'bg-slate-700' : 'bg-slate-700/50 hover:bg-slate-700'
                      )}
                    >
                      <div className={cn('w-4 h-4 rounded-full flex-shrink-0', colors.bg)} />
                      
                      {isEditing ? (
                        <div className="flex-1 space-y-2">
                          <Input
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                            className="bg-slate-600 border-slate-500 text-white h-8 text-sm"
                            autoFocus
                          />
                          <ColorPicker 
                            value={editingCategory.color} 
                            onChange={(color) => setEditingCategory({ ...editingCategory, color })} 
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleUpdateCategory}
                              disabled={isLoading}
                              className="bg-emerald-600 hover:bg-emerald-700 h-7 text-xs"
                            >
                              <Check className="w-3 h-3 mr-1" /> Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingCategory(null)}
                              className="border-slate-600 text-slate-300 hover:bg-slate-600 h-7 text-xs"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 text-white text-sm font-medium truncate">
                            {category.name}
                          </span>
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="text-slate-300 border-slate-600 hover:bg-slate-700"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryManagementModal;

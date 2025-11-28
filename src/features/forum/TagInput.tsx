import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

interface Tag {
  id: string;
  name: string;
}

interface TagInputProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput = ({ selectedTags, onTagsChange, placeholder }: TagInputProps) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setAllTags(data || []);
    } catch (error: any) {
      console.error("Error loading tags:", error);
    }
  };

  useEffect(() => {
    if (inputValue) {
      const filtered = allTags.filter(tag => 
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.includes(tag.id)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, allTags, selectedTags]);

  const handleAddTag = async (tagName: string) => {
    try {
      // Check if tag exists
      let tag = allTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
      
      if (!tag) {
        // Create new tag
        const { data, error } = await supabase
          .from("tags")
          .insert({ name: tagName.toLowerCase() })
          .select()
          .single();
        
        if (error) throw error;
        tag = data;
        setAllTags([...allTags, data]);
        toast.success("Nueva etiqueta creada");
      }
      
      if (tag && !selectedTags.includes(tag.id)) {
        onTagsChange([...selectedTags, tag.id]);
      }
      
      setInputValue("");
      setSuggestions([]);
    } catch (error: any) {
      console.error("Error adding tag:", error);
      toast.error("Error al agregar etiqueta");
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue.trim());
    }
  };

  const getTagName = (tagId: string) => {
    return allTags.find(t => t.id === tagId)?.name || "";
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tagId => (
          <Badge
            key={tagId}
            variant="secondary"
            className="px-3 py-1 text-sm"
          >
            {getTagName(tagId)}
            <button
              type="button"
              onClick={() => handleRemoveTag(tagId)}
              className="ml-2 hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Agregar etiquetas..."}
          className="modern-input"
        />
        
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
            {suggestions.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => {
                  onTagsChange([...selectedTags, tag.id]);
                  setInputValue("");
                  setSuggestions([]);
                }}
                className="w-full px-4 py-2 text-left hover:bg-muted transition-colors"
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Presiona Enter para agregar una etiqueta nueva
      </p>
    </div>
  );
};

export default TagInput;

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Sparkles, Heart, Building2, Coffee, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Table {
  id: number;
  table_number: string;
  seating_capacity: number;
  section: string;
  is_available: boolean;
}

interface TableSelectionProps {
  reservationData: any;
  onTableSelect: (table: Table) => void;
  onAIRecommendation: () => void;
  selectedTable?: Table;
}

const TableSelection = ({ reservationData, onTableSelect, onAIRecommendation, selectedTable }: TableSelectionProps) => {
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [showAISuggestion, setShowAISuggestion] = useState(false);

  const { data: tables, isLoading } = useQuery({
    queryKey: ['restaurant-tables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*')
        .order('section, table_number');
      
      if (error) throw error;
      return data as Table[];
    }
  });

  // Check for existing reservations at the same time
  const { data: existingReservations } = useQuery({
    queryKey: ['existing-reservations', reservationData.arrivalDate, reservationData.arrivalTime],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('table_number')
        .eq('arrival_date', reservationData.arrivalDate)
        .eq('arrival_time', reservationData.arrivalTime)
        .eq('status', 'confirmed');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading tables...</div>;
  }

  // Mark tables as unavailable if they're already reserved
  const reservedTableNumbers = existingReservations?.map(r => r.table_number) || [];
  const availableTables = tables?.map(table => ({
    ...table,
    is_available: table.is_available && !reservedTableNumbers.includes(table.table_number)
  })) || [];

  // Group tables by section
  const groupedTables = availableTables.reduce((acc: any, table: Table) => {
    if (!acc[table.section]) {
      acc[table.section] = [];
    }
    acc[table.section].push(table);
    return acc;
  }, {});

  const getRecommendedTables = () => {
    const numPeople = parseInt(reservationData.numPeople);
    const purpose = reservationData.purpose.toLowerCase();
    
    return availableTables.filter(table => {
      // Basic capacity filter
      const capacityMatch = table.seating_capacity >= numPeople && table.seating_capacity <= numPeople + 2;
      
      // Purpose-based recommendations
      if (purpose.includes('romantic') && table.section === 'Window Side') return capacityMatch;
      if (purpose.includes('corporate') && table.section === 'Private Cabin') return capacityMatch;
      if (purpose.includes('family') && table.section === 'Main Hall') return capacityMatch;
      
      return capacityMatch && table.is_available;
    }).slice(0, 3);
  };

  const recommendedTables = getRecommendedTables();

  const getTableIcon = (section: string) => {
    switch (section) {
      case 'Window Side': return <Heart className="h-4 w-4" />;
      case 'Private Cabin': return <Building2 className="h-4 w-4" />;
      case 'Main Hall': return <Coffee className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getSectionDescription = (section: string) => {
    switch (section) {
      case 'Window Side': return 'Perfect for romantic dinners with beautiful views 💕';
      case 'Private Cabin': return 'Ideal for corporate meetings and private discussions 🏢';
      case 'Main Hall': return 'Great for families and casual dining 👨‍👩‍👧‍👦';
      default: return 'Standard seating area';
    }
  };

  const handleAIRecommendation = async () => {
    setLoadingAI(true);
    setShowAISuggestion(true);
    
    try {
      const context = `Customer details: ${reservationData.numPeople} people, purpose: ${reservationData.purpose}. Available tables: ${availableTables.map(t => `${t.table_number} (${t.section}, ${t.seating_capacity} seats)`).join(', ')}. Please recommend the best table and explain why.`;
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: "What table would you recommend for my reservation?",
          context
        }
      });

      if (error) throw error;
      setAiSuggestion(data.response);
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      setAiSuggestion('Unable to get AI recommendation at the moment. Please select from the available tables.');
    } finally {
      setLoadingAI(false);
    }
  };

  const applyAISuggestion = () => {
    // Find the best recommended table and select it
    if (recommendedTables.length > 0) {
      const bestTable = recommendedTables[0];
      onTableSelect(bestTable);
      setShowAISuggestion(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Recommendation Section */}
      <Card className="card-royal border-royal-gold">
        <CardHeader>
          <CardTitle className="text-royal-gold flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Table Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Based on your party of {reservationData.numPeople} people for {reservationData.purpose}, 
            here are our top recommendations:
          </p>
          
          {recommendedTables.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recommendedTables.map((table) => (
                <Button
                  key={table.id}
                  variant="outline"
                  className={`h-20 flex flex-col items-center justify-center ${
                    selectedTable?.id === table.id 
                      ? "bg-royal-gold text-black border-royal-gold" 
                      : "border-royal-gold text-royal-gold hover:bg-royal-gold/20"
                  }`}
                  onClick={() => onTableSelect(table)}
                >
                  <div className="flex items-center gap-1 mb-1">
                    {getTableIcon(table.section)}
                    <span className="font-semibold">{table.table_number}</span>
                  </div>
                  <span className="text-xs">{table.seating_capacity} seats</span>
                  <Badge className="text-xs bg-green-500 mt-1">Recommended</Badge>
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No perfect matches found. Please select from available tables below.
            </p>
          )}
          
          <div className="flex gap-2">
            <Button
              onClick={handleAIRecommendation}
              variant="outline"
              className="border-royal-gold text-royal-gold hover:bg-royal-gold/20"
              disabled={loadingAI}
            >
              {loadingAI ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Get AI Recommendation
            </Button>
            
            {showAISuggestion && !loadingAI && (
              <Button
                onClick={applyAISuggestion}
                className="btn-royal"
              >
                Apply AI Suggestion
              </Button>
            )}
          </div>

          {/* AI Suggestion Display */}
          {showAISuggestion && (
            <div className="mt-4 p-4 bg-royal-gold/10 border border-royal-gold rounded-lg">
              <h4 className="font-semibold text-royal-gold mb-2">AI Recommendation:</h4>
              {loadingAI ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Getting personalized recommendation...</span>
                </div>
              ) : (
                <p className="text-sm">{aiSuggestion}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Tables Section */}
      <Card className="card-royal">
        <CardHeader>
          <CardTitle className="text-royal-subtitle flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Available Tables
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Reserved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-royal-gold rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedTables).map(([section, sectionTables]: [string, any]) => (
            <div key={section}>
              <div className="flex items-center gap-2 mb-3">
                {getTableIcon(section)}
                <h3 className="font-semibold text-royal-gold">{section}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{getSectionDescription(section)}</p>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {sectionTables.map((table: Table) => (
                  <Button
                    key={table.id}
                    variant="outline"
                    className={`h-16 p-2 flex flex-col items-center justify-center ${
                      selectedTable?.id === table.id 
                        ? "bg-royal-gold text-black border-royal-gold" 
                        : !table.is_available 
                          ? "bg-red-500/20 border-red-500 cursor-not-allowed" 
                          : "border-green-500 hover:bg-green-500/20"
                    }`}
                    onClick={() => table.is_available && onTableSelect(table)}
                    disabled={!table.is_available}
                  >
                    <span className="font-semibold">{table.table_number}</span>
                    <span className="text-xs">{table.seating_capacity} seats</span>
                    {recommendedTables.some(rec => rec.id === table.id) && (
                      <Badge className="text-xs bg-royal-gold text-black">★</Badge>
                    )}
                    {!table.is_available && (
                      <Badge className="text-xs bg-red-500 text-white">Reserved</Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TableSelection;

import React from "react";
import { useForm } from "react-hook-form";
import { X, AlertTriangle, ClipboardList, Stethoscope, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { QuestionnaireData } from "@/store";

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuestionnaireData) => void;
}

const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { register, handleSubmit, setValue, watch, formState } = useForm({
    defaultValues: {
      pain: 'none' as const,
      breathing: 'none' as const,
      symptoms: [] as string[],
      symptomsDescription: "",
      symptomsStarted: "today",
      painLevel: 5,
      conditions: {
        diabetes: false,
        hypertension: false,
        heart: false,
        asthma: false,
        other: false
      },
      allergies: "",
      medications: ""
    }
  });

  const handleFormSubmit = (data: any) => {
    // Convert pain level to descriptive value
    const painValue = data.painLevel;
    let painCategory: 'none' | 'mild' | 'moderate' | 'severe' = 'none';
    
    if (painValue <= 2) painCategory = 'none';
    else if (painValue <= 5) painCategory = 'mild';
    else if (painValue <= 8) painCategory = 'moderate';
    else painCategory = 'severe';
    
    // Process symptoms from description
    const symptomsDesc = data.symptomsDescription?.toLowerCase() || '';
    const autoDetectedSymptoms = [];
    
    if (symptomsDesc.includes('fever') || symptomsDesc.includes('hot') || symptomsDesc.includes('temperature')) {
      autoDetectedSymptoms.push('fever');
    }
    
    if (symptomsDesc.includes('dizzy') || symptomsDesc.includes('faint') || symptomsDesc.includes('light-headed')) {
      autoDetectedSymptoms.push('dizziness');
    }
    
    if (symptomsDesc.includes('nausea') || symptomsDesc.includes('sick') || symptomsDesc.includes('vomit')) {
      autoDetectedSymptoms.push('nausea');
    }
    
    if (symptomsDesc.includes('cough') || symptomsDesc.includes('sore throat')) {
      autoDetectedSymptoms.push('cough');
    }
    
    if (symptomsDesc.includes('rash') || symptomsDesc.includes('itch')) {
      autoDetectedSymptoms.push('rash');
    }

    // Set breathing difficulty based on description
    let breathingCategory: 'none' | 'slight' | 'moderate' | 'severe' = 'none';
    
    if (symptomsDesc.includes('cannot breathe') || symptomsDesc.includes("can't breathe") || 
        symptomsDesc.includes('difficulty breathing') || symptomsDesc.includes('hard to breathe')) {
      breathingCategory = 'severe';
    } else if (symptomsDesc.includes('short of breath') || symptomsDesc.includes('trouble breathing')) {
      breathingCategory = 'moderate';
    } else if (symptomsDesc.includes('breathe') || symptomsDesc.includes('breathing')) {
      breathingCategory = 'slight';
    }
    
    const finalData: QuestionnaireData = {
      ...data,
      pain: painCategory,
      breathing: breathingCategory,
      symptoms: autoDetectedSymptoms
    };
    
    onSubmit(finalData);
  };

  const handlePainLevelChange = (value: number[]) => {
    setValue("painLevel", value[0]);
  };

  const handleSymptomStartChange = (value: string) => {
    setValue("symptomsStarted", value);
  };

  if (!isOpen) return null;

  const painLevel = watch("painLevel");
  let painIndicatorColor = "bg-green-500";
  if (painLevel > 7) painIndicatorColor = "bg-red-500";
  else if (painLevel > 4) painIndicatorColor = "bg-yellow-500";
  else if (painLevel > 2) painIndicatorColor = "bg-blue-500";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="p-5 border-b border-b-red-50 bg-gradient-to-r from-red-50 to-white flex justify-between items-center">
          <div className="flex items-center">
            <Stethoscope className="h-6 w-6 text-red-500 mr-2" />
            <h3 className="text-xl font-medium text-gray-900">Health Assessment</h3>
          </div>
          <button 
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="bg-red-50 rounded-lg p-4 mb-6 flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-red-800 text-sm">
              <span className="font-bold">Important:</span> Your responses help us determine the urgency of your condition. Please provide as much detail as possible.
            </p>
          </div>
          
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center mb-2">
                  <ClipboardList className="h-5 w-5 text-blue-500 mr-2" />
                  <h4 className="font-medium text-gray-900">Symptom Information</h4>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="symptomsDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Please describe your symptoms in detail
                    </Label>
                    <Textarea 
                      id="symptomsDescription"
                      placeholder="Example: I have a severe headache, fever, and I'm feeling dizzy when standing up"
                      className="w-full"
                      rows={3}
                      {...register("symptomsDescription")}
                    />
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      When did your symptoms start?
                    </Label>
                    <Select 
                      onValueChange={handleSymptomStartChange}
                      defaultValue="today"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select when symptoms started" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="within-hour">Within the last hour</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="within-week">Within the last week</SelectItem>
                        <SelectItem value="more-than-week">More than a week ago</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center mb-2">
                  <Activity className="h-5 w-5 text-red-500 mr-2" />
                  <h4 className="font-medium text-gray-900">Pain Assessment</h4>
                </div>
                
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate your pain level (0-10)
                </Label>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm text-gray-500 w-16">No Pain</span>
                  <Slider 
                    defaultValue={[5]} 
                    max={10} 
                    step={1}
                    className="flex-grow"
                    onValueChange={handlePainLevelChange}
                  />
                  <span className="text-sm text-gray-500 w-16 text-right">Severe</span>
                </div>
                <div className="flex justify-center items-center mt-2 mb-1">
                  <div className={`w-10 h-10 rounded-full ${painIndicatorColor} flex items-center justify-center text-white font-bold`}>
                    {painLevel}
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant={painLevel > 7 ? "destructive" : painLevel > 4 ? "default" : "outline"}>
                    {painLevel <= 2 ? 'Minimal' : 
                     painLevel <= 5 ? 'Mild' : 
                     painLevel <= 8 ? 'Moderate' : 'Severe'} Pain
                  </Badge>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-medium text-gray-900 mb-3">Medical History</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Do you have any of these medical conditions?
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center bg-white p-2 rounded border border-gray-100">
                        <Checkbox 
                          id="condition-diabetes" 
                          className="mr-2 text-blue-500"
                          {...register("conditions.diabetes")}
                        />
                        <Label htmlFor="condition-diabetes" className="text-sm text-gray-700">
                          Diabetes
                        </Label>
                      </div>
                      <div className="flex items-center bg-white p-2 rounded border border-gray-100">
                        <Checkbox 
                          id="condition-hypertension" 
                          className="mr-2"
                          {...register("conditions.hypertension")}
                        />
                        <Label htmlFor="condition-hypertension" className="text-sm text-gray-700">
                          Hypertension
                        </Label>
                      </div>
                      <div className="flex items-center bg-white p-2 rounded border border-gray-100">
                        <Checkbox 
                          id="condition-heart" 
                          className="mr-2"
                          {...register("conditions.heart")}
                        />
                        <Label htmlFor="condition-heart" className="text-sm text-gray-700">
                          Heart Disease
                        </Label>
                      </div>
                      <div className="flex items-center bg-white p-2 rounded border border-gray-100">
                        <Checkbox 
                          id="condition-asthma" 
                          className="mr-2"
                          {...register("conditions.asthma")}
                        />
                        <Label htmlFor="condition-asthma" className="text-sm text-gray-700">
                          Asthma
                        </Label>
                      </div>
                      <div className="flex items-center bg-white p-2 rounded border border-gray-100">
                        <Checkbox 
                          id="condition-other" 
                          className="mr-2"
                          {...register("conditions.other")}
                        />
                        <Label htmlFor="condition-other" className="text-sm text-gray-700">
                          Other
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                      Do you have any allergies?
                    </Label>
                    <Textarea 
                      id="allergies"
                      placeholder="List allergies to medications, foods, etc."
                      className="w-full"
                      rows={2}
                      {...register("allergies")}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-1">
                      Are you taking any medications?
                    </Label>
                    <Textarea 
                      id="medications"
                      placeholder="List your current medications and dosages"
                      className="w-full"
                      rows={2}
                      {...register("medications")}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                className="mr-3"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white shadow-md">
                Submit Assessment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;

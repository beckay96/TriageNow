import React from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
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

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      symptoms: "",
      symptomsStarted: "today",
      painLevel: 5,
      conditions: {
        diabetes: false,
        hypertension: false,
        heart: false,
        asthma: false,
        other: false
      },
      medications: ""
    }
  });

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  const handlePainLevelChange = (value: number[]) => {
    setValue("painLevel", value[0]);
  };

  const handleSymptomStartChange = (value: string) => {
    setValue("symptomsStarted", value);
  };

  if (!isOpen) return null;

  const painLevel = watch("painLevel");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="p-5 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium text-neutral-900">Additional Health Information</h3>
          <button 
            className="text-neutral-400 hover:text-neutral-500"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-5">
          <p className="text-neutral-600 mb-6">
            Please answer the following questions to help us better assess your condition.
          </p>
          
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="symptoms" className="block text-sm font-medium text-neutral-700 mb-1">
                  What symptoms are you experiencing?
                </Label>
                <Textarea 
                  id="symptoms"
                  placeholder="Describe your symptoms"
                  className="w-full"
                  {...register("symptoms")}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-neutral-700 mb-1">
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
              
              <div>
                <Label className="block text-sm font-medium text-neutral-700 mb-1">
                  Rate your pain (if any)
                </Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-neutral-500">No Pain</span>
                  <Slider 
                    defaultValue={[5]} 
                    max={10} 
                    step={1}
                    className="flex-grow"
                    onValueChange={handlePainLevelChange}
                  />
                  <span className="text-sm text-neutral-500">Severe</span>
                </div>
                <div className="text-center mt-1">
                  <span className="text-sm font-medium">{painLevel}/10</span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-neutral-700 mb-1">
                  Do you have any known medical conditions?
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="condition-diabetes" 
                      className="mr-2"
                      {...register("conditions.diabetes")}
                    />
                    <Label htmlFor="condition-diabetes" className="text-sm text-neutral-700">
                      Diabetes
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="condition-hypertension" 
                      className="mr-2"
                      {...register("conditions.hypertension")}
                    />
                    <Label htmlFor="condition-hypertension" className="text-sm text-neutral-700">
                      Hypertension
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="condition-heart" 
                      className="mr-2"
                      {...register("conditions.heart")}
                    />
                    <Label htmlFor="condition-heart" className="text-sm text-neutral-700">
                      Heart Disease
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="condition-asthma" 
                      className="mr-2"
                      {...register("conditions.asthma")}
                    />
                    <Label htmlFor="condition-asthma" className="text-sm text-neutral-700">
                      Asthma
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="condition-other" 
                      className="mr-2"
                      {...register("conditions.other")}
                    />
                    <Label htmlFor="condition-other" className="text-sm text-neutral-700">
                      Other
                    </Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="medications" className="block text-sm font-medium text-neutral-700 mb-1">
                  Are you taking any medications?
                </Label>
                <Textarea 
                  id="medications"
                  placeholder="List your medications"
                  className="w-full"
                  rows={2}
                  {...register("medications")}
                />
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
              <Button type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { QuestionnaireData } from "@/store";
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
  // Step wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // React Hook Form
  const { register, handleSubmit, setValue, watch, getValues, formState } = useForm({
    defaultValues: {
      pain: 'none' as const,
      breathing: 'none' as const,
      symptoms: [] as string[],
      symptomsDescription: "",
      symptomsStarted: "today",
      painLevel: 5,
      painLocation: "",
      painCharacteristics: [] as string[],
      conditions: {
        diabetes: false,
        hypertension: false,
        heart: false,
        asthma: false,
        copd: false,
        stroke: false,
        seizures: false,
        other: false
      },
      conditionsOther: "",
      allergies: "",
      medications: "",
      recentInjury: false,
      levelOfConsciousness: 'alert' as const
    }
  });

  // Track checked states for pain characteristics
  const [painCharChecked, setPainCharChecked] = useState({
    sharp: false,
    dull: false,
    throbbing: false,
    burning: false
  });

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
    
    // Process pain characteristics if not provided via checkboxes
    if (!data.painCharacteristics || data.painCharacteristics.length === 0) {
      const painDesc = data.symptomsDescription?.toLowerCase() || '';
      const detectedPainCharacteristics = [];
      
      if (painDesc.includes('sharp') || painDesc.includes('stabbing')) {
        detectedPainCharacteristics.push('sharp');
      }
      if (painDesc.includes('dull') || painDesc.includes('aching')) {
        detectedPainCharacteristics.push('dull');
      }
      if (painDesc.includes('throbbing') || painDesc.includes('pulsing')) {
        detectedPainCharacteristics.push('throbbing');
      }
      if (painDesc.includes('burning') || painDesc.includes('hot')) {
        detectedPainCharacteristics.push('burning');
      }
      
      if (detectedPainCharacteristics.length > 0) {
        data.painCharacteristics = detectedPainCharacteristics;
      }
    }
    
    const finalData: QuestionnaireData = {
      ...data,
      pain: painCategory,
      breathing: breathingCategory,
      symptoms: [...(data.symptoms || []), ...autoDetectedSymptoms],
      painCharacteristics: data.painCharacteristics || [],
      levelOfConsciousness: data.levelOfConsciousness || 'alert'
    };
    
    onSubmit(finalData);
  };

  const handlePainLevelChange = (value: number[]) => {
    setValue("painLevel", value[0]);
  };

  const handleSymptomStartChange = (value: string) => {
    setValue("symptomsStarted", value);
  };

  const handleLevelOfConsciousnessChange = (value: string) => {
    if (value === 'alert' || value === 'confused' || value === 'drowsy' || value === 'unresponsive') {
      setValue("levelOfConsciousness", value);
    }
  };

  const handlePainCharacteristicChange = (type: 'sharp' | 'dull' | 'throbbing' | 'burning', checked: boolean) => {
    // Update UI state
    setPainCharChecked({
      ...painCharChecked,
      [type]: checked
    });
    
    // Update form data
    const current = getValues('painCharacteristics') || [];
    if (checked) {
      setValue('painCharacteristics', [...current, type]);
    } else {
      setValue('painCharacteristics', current.filter(c => c !== type));
    }
  };

  // Symptom checkboxes state
  const [checkedSymptoms, setCheckedSymptoms] = useState<Record<string, boolean>>({
    fever: false,
    dizziness: false,
    nausea: false,
    cough: false,
    rash: false,
    headache: false,
    fatigue: false,
    sore_throat: false
  });

  // Handle symptom checkbox changes
  const handleSymptomChange = (symptom: string, checked: boolean) => {
    // Update UI state
    setCheckedSymptoms({
      ...checkedSymptoms,
      [symptom]: checked
    });
    
    // Update form data
    const currentSymptoms = getValues('symptoms') || [];
    if (checked && !currentSymptoms.includes(symptom)) {
      setValue('symptoms', [...currentSymptoms, symptom]);
    } else if (!checked && currentSymptoms.includes(symptom)) {
      setValue('symptoms', currentSymptoms.filter(s => s !== symptom));
    }
  };

  if (!isOpen) return null;

  const painLevel = watch("painLevel");
  let painIndicatorColor = "bg-green-500";
  if (painLevel > 7) painIndicatorColor = "bg-red-500";
  else if (painLevel > 4) painIndicatorColor = "bg-yellow-500";
  else if (painLevel > 2) painIndicatorColor = "bg-blue-500";

  // Render step indicators
  const renderStepIndicators = () => {
    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-3">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center ${index + 1 === currentStep ? 'opacity-100' : 'opacity-50'}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium 
                  ${index + 1 === currentStep 
                    ? 'bg-blue-500 text-white' 
                    : index + 1 < currentStep 
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500 dark:bg-zinc-700'
                  }`}
              >
                {index + 1 < currentStep ? (
                  <span className="material-icons text-sm">check</span>
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                {index === 0 ? 'Symptoms' : index === 1 ? 'Pain Assessment' : 'Medical History'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="p-5 border-b border-gray-200 dark:border-zinc-700 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-zinc-900 flex justify-between items-center">
          <div className="flex items-center">
            <span className="material-icons text-blue-500 mr-2">medical_information</span>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Health Assessment</h3>
          </div>
          <button 
            className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={onClose}
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="p-5">
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-6 flex items-start">
            <span className="material-icons text-amber-500 mr-2">warning</span>
            <p className="text-amber-800 dark:text-amber-300 text-sm">
              <span className="font-bold">Important:</span> Your responses help us determine the urgency of your condition. Please provide as much detail as possible.
            </p>
          </div>

          {/* Step indicators */}
          {renderStepIndicators()}
          
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Step 1: Symptom Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg border border-gray-200 dark:border-zinc-700">
                  <div className="flex items-center mb-2">
                    <span className="material-icons text-blue-500 mr-2">assignment</span>
                    <h4 className="font-medium text-gray-900 dark:text-white">Symptom Information</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="symptomsDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Please describe your symptoms in detail
                      </Label>
                      <Textarea 
                        id="symptomsDescription"
                        placeholder="Example: I have a severe headache, fever, and I'm feeling dizzy when standing up"
                        className="w-full dark:bg-zinc-700 dark:border-zinc-600"
                        rows={3}
                        {...register("symptomsDescription")}
                      />
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        When did your symptoms start?
                      </Label>
                      <Select 
                        onValueChange={handleSymptomStartChange}
                        defaultValue="today"
                      >
                        <SelectTrigger className="w-full dark:bg-zinc-700 dark:border-zinc-600">
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
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select symptoms you're experiencing:
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries({
                          fever: "Fever",
                          dizziness: "Dizziness",
                          nausea: "Nausea/Vomiting",
                          cough: "Cough",
                          rash: "Rash",
                          headache: "Headache",
                          fatigue: "Fatigue",
                          sore_throat: "Sore Throat"
                        }).map(([value, label]) => (
                          <div 
                            key={value}
                            className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded border border-gray-200 dark:border-zinc-600"
                          >
                            <Checkbox 
                              id={`symptom-${value}`} 
                              className="mr-2"
                              checked={checkedSymptoms[value]}
                              onCheckedChange={(checked) => 
                                handleSymptomChange(value, !!checked)
                              }
                            />
                            <Label 
                              htmlFor={`symptom-${value}`} 
                              className="text-sm text-gray-700 dark:text-gray-300"
                            >
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Level of consciousness
                      </Label>
                      <Select 
                        onValueChange={handleLevelOfConsciousnessChange}
                        defaultValue="alert"
                      >
                        <SelectTrigger className="w-full dark:bg-zinc-700 dark:border-zinc-600">
                          <SelectValue placeholder="Select level of consciousness" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alert">Alert and oriented</SelectItem>
                          <SelectItem value="confused">Confused</SelectItem>
                          <SelectItem value="drowsy">Drowsy</SelectItem>
                          <SelectItem value="unresponsive">Unresponsive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Pain Assessment */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg border border-gray-200 dark:border-zinc-700">
                  <div className="flex items-center mb-2">
                    <span className="material-icons text-red-500 mr-2">monitor_heart</span>
                    <h4 className="font-medium text-gray-900 dark:text-white">Pain Assessment</h4>
                  </div>
                  
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rate your pain level (0-10)
                  </Label>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-16">No Pain</span>
                    <Slider 
                      defaultValue={[painLevel]} 
                      max={10} 
                      step={1}
                      className="flex-grow"
                      onValueChange={handlePainLevelChange}
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-16 text-right">Severe</span>
                  </div>
                  <div className="flex justify-center items-center mt-2 mb-1">
                    <div className={`w-10 h-10 rounded-full ${painIndicatorColor} flex items-center justify-center text-white font-bold`}>
                      {painLevel}
                    </div>
                  </div>
                  <div className="text-center mb-4">
                    <Badge variant={painLevel > 7 ? "destructive" : painLevel > 4 ? "default" : "outline"}>
                      {painLevel <= 2 ? 'Minimal' : 
                       painLevel <= 5 ? 'Mild' : 
                       painLevel <= 8 ? 'Moderate' : 'Severe'} Pain
                    </Badge>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="painLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Where is your pain located?
                    </Label>
                    <Input 
                      id="painLocation" 
                      type="text" 
                      placeholder="E.g., chest, abdomen, head, lower back, etc."
                      className="w-full dark:bg-zinc-700 dark:border-zinc-600"
                      {...register("painLocation")}
                    />
                  </div>

                  <div className="mt-4">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pain characteristics (select all that apply)
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded border border-gray-200 dark:border-zinc-600">
                        <Checkbox 
                          id="pain-sharp" 
                          className="mr-2"
                          checked={painCharChecked.sharp}
                          onCheckedChange={(checked) => 
                            handlePainCharacteristicChange('sharp', !!checked)
                          }
                        />
                        <Label htmlFor="pain-sharp" className="text-sm text-gray-700 dark:text-gray-300">Sharp</Label>
                      </div>
                      <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded border border-gray-200 dark:border-zinc-600">
                        <Checkbox 
                          id="pain-dull" 
                          className="mr-2"
                          checked={painCharChecked.dull}
                          onCheckedChange={(checked) => 
                            handlePainCharacteristicChange('dull', !!checked)
                          }
                        />
                        <Label htmlFor="pain-dull" className="text-sm text-gray-700 dark:text-gray-300">Dull/Aching</Label>
                      </div>
                      <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded border border-gray-200 dark:border-zinc-600">
                        <Checkbox 
                          id="pain-throbbing" 
                          className="mr-2"
                          checked={painCharChecked.throbbing}
                          onCheckedChange={(checked) => 
                            handlePainCharacteristicChange('throbbing', !!checked)
                          }
                        />
                        <Label htmlFor="pain-throbbing" className="text-sm text-gray-700 dark:text-gray-300">Throbbing</Label>
                      </div>
                      <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded border border-gray-200 dark:border-zinc-600">
                        <Checkbox 
                          id="pain-burning" 
                          className="mr-2"
                          checked={painCharChecked.burning}
                          onCheckedChange={(checked) => 
                            handlePainCharacteristicChange('burning', !!checked)
                          }
                        />
                        <Label htmlFor="pain-burning" className="text-sm text-gray-700 dark:text-gray-300">Burning</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <Checkbox 
                      id="recent-injury" 
                      className="mr-2" 
                      {...register("recentInjury")}
                    />
                    <Label htmlFor="recent-injury" className="text-sm text-gray-700 dark:text-gray-300">
                      Have you experienced a recent injury or trauma?
                    </Label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Medical History */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg border border-gray-200 dark:border-zinc-700">
                  <div className="flex items-center mb-2">
                    <span className="material-icons text-indigo-500 mr-2">medical_services</span>
                    <h4 className="font-medium text-gray-900 dark:text-white">Medical History</h4>
                  </div>
                  
                  <div className="mt-2">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pre-existing conditions (select all that apply)
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded border border-gray-200 dark:border-zinc-600">
                        <Checkbox 
                          id="condition-diabetes" 
                          className="mr-2" 
                          {...register("conditions.diabetes")}
                        />
                        <Label htmlFor="condition-diabetes" className="text-sm text-gray-700 dark:text-gray-300">Diabetes</Label>
                      </div>
                      <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded border border-gray-200 dark:border-zinc-600">
                        <Checkbox 
                          id="condition-hypertension" 
                          className="mr-2" 
                          {...register("conditions.hypertension")}
                        />
                        <Label htmlFor="condition-hypertension" className="text-sm text-gray-700 dark:text-gray-300">Hypertension</Label>
                      </div>
                      <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded border border-gray-200 dark:border-zinc-600">
                        <Checkbox 
                          id="condition-heart" 
                          className="mr-2" 
                          {...register("conditions.heart")}
                        />
                        <Label htmlFor="condition-heart" className="text-sm text-gray-700 dark:text-gray-300">Heart Disease</Label>
                      </div>
                      <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded border border-gray-200 dark:border-zinc-600">
                        <Checkbox 
                          id="condition-asthma" 
                          className="mr-2" 
                          {...register("conditions.asthma")}
                        />
                        <Label htmlFor="condition-asthma" className="text-sm text-gray-700 dark:text-gray-300">Asthma</Label>
                      </div>
                      <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded border border-gray-200 dark:border-zinc-600">
                        <Checkbox 
                          id="condition-copd" 
                          className="mr-2" 
                          {...register("conditions.copd")}
                        />
                        <Label htmlFor="condition-copd" className="text-sm text-gray-700 dark:text-gray-300">COPD</Label>
                      </div>
                      <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded border border-gray-200 dark:border-zinc-600">
                        <Checkbox 
                          id="condition-stroke" 
                          className="mr-2" 
                          {...register("conditions.stroke")}
                        />
                        <Label htmlFor="condition-stroke" className="text-sm text-gray-700 dark:text-gray-300">Stroke History</Label>
                      </div>
                      <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded border border-gray-200 dark:border-zinc-600">
                        <Checkbox 
                          id="condition-seizures" 
                          className="mr-2" 
                          {...register("conditions.seizures")}
                        />
                        <Label htmlFor="condition-seizures" className="text-sm text-gray-700 dark:text-gray-300">Seizures</Label>
                      </div>
                      <div className="flex items-center bg-white dark:bg-zinc-700 p-2 rounded border border-gray-200 dark:border-zinc-600">
                        <Checkbox 
                          id="condition-other" 
                          className="mr-2" 
                          {...register("conditions.other")}
                        />
                        <Label htmlFor="condition-other" className="text-sm text-gray-700 dark:text-gray-300">Other</Label>
                      </div>
                    </div>

                    {watch("conditions.other") && (
                      <div className="mt-2">
                        <Input 
                          type="text" 
                          placeholder="Please specify other conditions"
                          className="w-full dark:bg-zinc-700 dark:border-zinc-600"
                          {...register("conditionsOther")}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="allergies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Do you have any allergies?
                    </Label>
                    <Input 
                      id="allergies" 
                      type="text" 
                      placeholder="E.g., medications, foods, etc."
                      className="w-full dark:bg-zinc-700 dark:border-zinc-600"
                      {...register("allergies")}
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="medications" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current medications
                    </Label>
                    <Input 
                      id="medications" 
                      type="text" 
                      placeholder="List any medications you're currently taking"
                      className="w-full dark:bg-zinc-700 dark:border-zinc-600"
                      {...register("medications")}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation and Submit buttons */}
            <div className="flex justify-between mt-6">
              {currentStep > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={goToPrevStep}
                  className="flex items-center"
                >
                  <span className="material-icons mr-1 text-sm">arrow_back</span>
                  Previous
                </Button>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                >
                  Cancel
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button 
                  type="button" 
                  onClick={goToNextStep}
                  className="bg-primary hover:bg-primary/90 flex items-center"
                >
                  Next
                  <span className="material-icons ml-1 text-sm">arrow_forward</span>
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 flex items-center"
                >
                  <span className="material-icons mr-1 text-sm">check</span>
                  Submit Assessment
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;
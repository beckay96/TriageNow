    import { FC, useState } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';

    interface DiagnosticInsightsProps {
      differentialDiagnoses: string[];
      redFlags: string[];
      recommendedTests?: string[];
      vitalsTrend?: 'improving' | 'stable' | 'worsening' | null;
      aiConfidence?: number;
      triageStatus?: 'critical' | 'high' | 'medium' | 'low' | null;
      estimatedWaitTime?: number;
      medicalProtocol?: string;
    }

    // Map diagnoses to urgency levels for visual indication
    const diagnosisUrgencyMap: Record<string, 'high' | 'medium' | 'low'> = {
      'Acute Coronary Syndrome': 'high',
      'Myocardial Infarction': 'high',
      'Pulmonary Embolism': 'high',
      'Stroke': 'high',
      'Subarachnoid Hemorrhage': 'high',
      'Intracranial Hemorrhage': 'high',
      'Meningitis': 'high',
      'Sepsis': 'high',
      'Aortic Dissection': 'high',
      'Pneumonia': 'medium',
      'Appendicitis': 'medium',
      'Cholecystitis': 'medium',
      'Anaphylaxis': 'high',
      'Diabetic Ketoacidosis': 'high',
      'Asthma Exacerbation': 'medium',
      'COPD Exacerbation': 'medium',
      'Angina': 'medium',
      'Congestive Heart Failure': 'medium',
      'Migraine': 'low',
      'Tension Headache': 'low',
      'Sinusitis': 'low',
      'Gastritis': 'low',
      'Gastroenteritis': 'low',
      'Constipation': 'low',
      'IBS': 'low',
      'Musculoskeletal Pain': 'low',
      'GERD': 'low',
      'Viral Infection': 'low',
      'Bacterial Infection': 'medium',
      'Urinary Tract Infection': 'medium',
      'Vertigo': 'low',
      'Orthostatic Hypotension': 'low',
      'Vestibular Neuritis': 'low',
      'Hyperglycemia': 'medium',
      'Hypoglycemia': 'medium'
    };

    const DiagnosticInsights: FC<DiagnosticInsightsProps> = ({ 
      differentialDiagnoses = [], 
      redFlags = [],
      recommendedTests = [],
      vitalsTrend = null,
      aiConfidence = 85,
      triageStatus = null,
      estimatedWaitTime,
      medicalProtocol
    }) => {
      const [expandedDiagnosis, setExpandedDiagnosis] = useState<string | null>(null);
      const [showAllTests, setShowAllTests] = useState(false);

      // Determine if there are high-urgency diagnoses
      const hasHighUrgencyDiagnoses = differentialDiagnoses.some(
        diagnosis => diagnosisUrgencyMap[diagnosis] === 'high'
      );

      // Get diagnosis description based on condition name
      const getDiagnosisDescription = (diagnosis: string): string => {
        const descriptions: Record<string, string> = {
          "Acute Coronary Syndrome": "A range of conditions including unstable angina and heart attack, characterized by reduced blood flow to the heart.",
          "Myocardial Infarction": "Heart attack - occurs when blood flow to a part of the heart is blocked, causing damage to heart muscle.",
          "Pulmonary Embolism": "A blockage in the pulmonary arteries in your lungs, often caused by blood clots that travel from veins in the legs.",
          "Stroke": "Occurs when blood supply to part of the brain is interrupted or reduced, preventing brain tissue from getting oxygen and nutrients.",
          "Pneumonia": "An infection that inflames the air sacs in one or both lungs, which may fill with fluid.",
          "Meningitis": "Inflammation of the membranes (meninges) surrounding the brain and spinal cord, usually due to infection.",
          "Sepsis": "A potentially life-threatening condition caused by the body's response to an infection.",
          "Angina": "Chest pain caused by reduced blood flow to the heart.",
          "GERD": "Gastroesophageal reflux disease - when stomach acid frequently flows back into the esophagus.",
          "Migraine": "A headache of varying intensity, often accompanied by nausea and sensitivity to light and sound.",
          "Vertigo": "A sensation of feeling off balance or that you or your surroundings are spinning or moving.",
          "Urinary Tract Infection": "An infection in any part of the urinary system, including kidneys, bladder, ureters and urethra."
        };

        return descriptions[diagnosis] || 'A medical condition that requires professional evaluation based on your symptoms.';
      };

      // Render a visual indicator for vitals trend
      const renderVitalsTrendIndicator = () => {
        if (!vitalsTrend) return null;

        const trendConfig = {
          improving: {
            icon: 'trending_up',
            color: 'text-green-500 dark:text-green-400',
            text: 'Your vital signs are improving'
          },
          stable: {
            icon: 'trending_flat',
            color: 'text-blue-500 dark:text-blue-400',
            text: 'Your vital signs are stable'
          },
          worsening: {
            icon: 'trending_down',
            color: 'text-red-500 dark:text-red-400',
            text: 'Your vital signs are deteriorating'
          }
        };

        const config = trendConfig[vitalsTrend];

        return (
          <div className={`flex items-center ${config.color} text-sm mb-3`}>
            <span className="material-icons mr-1">{config.icon}</span>
            <span>{config.text}</span>
          </div>
        );
      };

      // Render confidence indicator
      const renderConfidenceIndicator = () => {
        let confidenceClass = 'text-yellow-500 dark:text-yellow-400';
        let confidenceText = 'Moderate';

        if (aiConfidence >= 90) {
          confidenceClass = 'text-green-500 dark:text-green-400';
          confidenceText = 'High';
        } else if (aiConfidence < 70) {
          confidenceClass = 'text-orange-500 dark:text-orange-400';
          confidenceText = 'Limited';
        }

        return (
          <div className="flex items-center mb-1 mt-2">
            <div className="text-xs text-neutral-500 dark:text-zinc-400 flex items-center">
              <span className="font-medium mr-1">AI Confidence:</span>
              <div className="w-24 h-3 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${confidenceClass.includes('green') ? 'bg-green-500' : confidenceClass.includes('yellow') ? 'bg-yellow-500' : 'bg-orange-500'}`}
                  style={{ width: `${aiConfidence}%` }}
                ></div>
              </div>
              <span className={`ml-2 ${confidenceClass} font-medium`}>{confidenceText}</span>
            </div>
          </div>
        );
      };

      // Get the wait time description based on triage status and estimated wait time
      const getWaitTimeDescription = () => {
        if (!triageStatus) return null;

        const waitTimeText = estimatedWaitTime !== undefined ? 
          `~${estimatedWaitTime} ${estimatedWaitTime === 1 ? 'minute' : 'minutes'}` : 
          'Unknown';

        const urgencyText = {
          'critical': 'Immediate attention required',
          'high': 'Urgent care needed soon',
          'medium': 'Should be seen today',
          'low': 'Non-urgent care'
        }[triageStatus];

        return (
          <div className="flex items-center text-sm mb-2">
            <span className="material-icons text-neutral-500 dark:text-zinc-400 mr-1 text-sm">schedule</span>
            <span className="text-neutral-600 dark:text-zinc-300">
              <span className="font-medium">Est. Wait:</span> {waitTimeText} 
              <span className="mx-1">•</span>
              <span className={`${
                triageStatus === 'critical' ? 'text-red-600 dark:text-red-400' :
                triageStatus === 'high' ? 'text-orange-600 dark:text-orange-400' :
                triageStatus === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-green-600 dark:text-green-400'
              } font-medium`}>{urgencyText}</span>
            </span>
          </div>
        );
      };

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-zinc-800"
        >
          <div className={`px-4 py-3
            ${hasHighUrgencyDiagnoses || redFlags.length > 0 ? 
              'bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 border-b border-red-200 dark:border-red-900/50' :
              'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border-b border-blue-200 dark:border-blue-900/50'
            }`}>
            <h3 className={`font-semibold flex items-center
              ${hasHighUrgencyDiagnoses || redFlags.length > 0 ? 
                'text-red-800 dark:text-red-300' : 
                'text-blue-800 dark:text-blue-300'
              }`}>
              <span className="material-icons mr-2">psychology</span>
              AI Diagnostic Assessment
              {(hasHighUrgencyDiagnoses || redFlags.length > 0) && (
                <span className="ml-2 flex items-center text-red-600 dark:text-red-400 animate-pulse">
                  <span className="material-icons text-sm">priority_high</span>
                </span>
              )}
            </h3>
            {renderConfidenceIndicator()}
          </div>

          <div className="p-4 space-y-4">
            {/* Vitals Trend Indicator */}
            {renderVitalsTrendIndicator()}

            {/* Medical Protocol if available */}
            {medicalProtocol && (
              <div className="mb-3 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md border border-blue-100 dark:border-blue-900/50">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 flex items-center mb-1">
                  <span className="material-icons mr-1 text-sm">medical_services</span>
                  Medical Protocol
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">{medicalProtocol}</p>
              </div>
            )}

            {/* Estimated Wait Time */}
            {getWaitTimeDescription()}

            {/* Red Flags Section - Show first if present */}
            {redFlags.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-900/40"
              >
                <h4 className="font-medium text-red-800 dark:text-red-300 flex items-center mb-2">
                  <span className="material-icons mr-1">warning</span>
                  Critical Concerns
                </h4>

                <ul className="space-y-2">
                  {redFlags.map((flag, index) => (
                    <motion.li 
                      key={index} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start bg-white dark:bg-zinc-800 p-2 rounded-md shadow-sm"
                    >
                      <span className="material-icons text-red-600 dark:text-red-400 mr-2 text-base">priority_high</span>
                      <span className="text-sm text-neutral-800 dark:text-zinc-200">{flag}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Differential Diagnoses Section */}
            <div>
              <h4 className="font-medium text-neutral-800 dark:text-zinc-200 flex items-center mb-3">
                <span className="material-icons text-blue-600 dark:text-blue-400 mr-1">radar</span>
                Possible Conditions to Consider
              </h4>

              {differentialDiagnoses.length > 0 ? (
                <ul className="space-y-2">
                  {differentialDiagnoses.map((diagnosis, index) => {
                    const urgency = diagnosisUrgencyMap[diagnosis] || 'medium';
                    const urgencyColors = {
                      high: 'border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20',
                      medium: 'border-yellow-200 dark:border-yellow-900/40 bg-yellow-50 dark:bg-yellow-900/20',
                      low: 'border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20'
                    };

                    return (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`rounded-md border p-2 ${urgencyColors[urgency]}`}
                      >
                        <button 
                          onClick={() => setExpandedDiagnosis(expandedDiagnosis === diagnosis ? null : diagnosis)}
                          className="w-full text-left flex items-start justify-between"
                        >
                          <div className="flex items-center">
                            <span className={`material-icons text-sm mr-2 ${
                              urgency === 'high' ? 'text-red-600 dark:text-red-400' :
                              urgency === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-blue-600 dark:text-blue-400'
                            }`}>
                              {urgency === 'high' ? 'error' : urgency === 'medium' ? 'warning' : 'info'}
                            </span>
                            <span className="text-sm font-medium text-neutral-800 dark:text-zinc-200">
                              {diagnosis}
                            </span>
                          </div>
                          <span className="material-icons text-sm text-neutral-500 dark:text-zinc-400">
                            {expandedDiagnosis === diagnosis ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>

                        <AnimatePresence>
                          {expandedDiagnosis === diagnosis && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 text-xs text-neutral-600 dark:text-zinc-300 border-t pt-2 border-neutral-200 dark:border-zinc-700"
                            >
                              {getDiagnosisDescription(diagnosis)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-neutral-500 dark:text-zinc-500 italic bg-neutral-50 dark:bg-zinc-800 p-3 rounded-md">
                  Not enough data to generate differential diagnoses
                </p>
              )}

              <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-2 italic">
                Note: These are potential conditions based on reported symptoms and are not definitive diagnoses.
              </p>
            </div>

            {/* Recommended Tests Section */}
            {recommendedTests.length > 0 && (
              <div>
                <h4 className="font-medium text-neutral-800 dark:text-zinc-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="material-icons mr-1 text-green-600 dark:text-green-400">science</span>
                    <span>Recommended Tests</span>
                  </div>

                  {recommendedTests.length > 3 && (
                    <button 
                      onClick={() => setShowAllTests(!showAllTests)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      {showAllTests ? 'Show Less' : 'Show All'}
                      <span className="material-icons text-sm ml-1">
                        {showAllTests ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                  )}
                </h4>

                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(showAllTests ? recommendedTests : recommendedTests.slice(0, 3)).map((test, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-neutral-50 dark:bg-zinc-800 p-2 rounded-md text-sm text-neutral-700 dark:text-zinc-300 border border-neutral-200 dark:border-zinc-700 flex items-center"
                    >
                      <span className="material-icons text-green-600 dark:text-green-400 mr-2 text-sm">check_circle</span>
                      {test}
                    </motion.div>
                  ))}
                </div>

                {!showAllTests && recommendedTests.length > 3 && (
                  <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1">
                    +{recommendedTests.length - 3} more tests
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 border-t border-blue-100 dark:border-blue-900/50">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              <span className="font-medium">Medical Disclaimer:</span> This information is generated by an AI system and should not replace professional medical advice. Always consult with a healthcare provider for diagnosis and treatment.
            </p>
          </div>
        </motion.div>
      );
    };

    export default DiagnosticInsights;
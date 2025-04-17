import { PatientEntry } from '@/store';

// Mock patient entries for the ER dashboard
export const mockPatientEntries: PatientEntry[] = [
  {
    id: 'PT10492',
    name: 'Emma Johnson',
    age: 67,
    priority: 'critical',
    vitals: {
      heartRate: {
        value: 122,
        status: 'critical'
      },
      bloodPressure: {
        value: '182/104',
        status: 'critical'
      },
      bloodOxygen: {
        value: 89,
        status: 'critical'
      },
      temperature: {
        value: 102.3,
        status: 'warning'
      }
    },
    status: 'ambulance',
    symptoms: ['chest pain', 'shortness of breath', 'nausea', 'sweating']
  },
  {
    id: 'PT10493',
    name: 'Michael Chen',
    age: 52,
    priority: 'critical',
    vitals: {
      heartRate: {
        value: 112,
        status: 'warning'
      },
      bloodPressure: {
        value: '165/95',
        status: 'warning'
      },
      bloodOxygen: {
        value: 91,
        status: 'warning'
      },
      temperature: {
        value: 100.2,
        status: 'elevated'
      }
    },
    status: 'self-presented',
    symptoms: ['severe abdominal pain', 'vomiting', 'fever']
  },
  {
    id: 'PT10494',
    name: 'Sophia Martinez',
    age: 73,
    priority: 'high',
    vitals: {
      heartRate: {
        value: 104,
        status: 'warning'
      },
      bloodPressure: {
        value: '158/92',
        status: 'warning'
      },
      bloodOxygen: {
        value: 93,
        status: 'warning'
      },
      temperature: {
        value: 99.8,
        status: 'elevated'
      }
    },
    status: 'ambulance',
    symptoms: ['dizziness', 'weakness', 'confusion']
  },
  {
    id: 'PT10495',
    name: 'Noah Williams',
    age: 35,
    priority: 'high',
    vitals: {
      heartRate: {
        value: 98,
        status: 'elevated'
      },
      bloodPressure: {
        value: '145/88',
        status: 'elevated'
      },
      bloodOxygen: {
        value: 95,
        status: 'normal'
      },
      temperature: {
        value: 101.3,
        status: 'warning'
      }
    },
    status: 'self-presented',
    symptoms: ['severe headache', 'sensitivity to light', 'neck stiffness']
  },
  {
    id: 'PT10496',
    name: 'Isabella Brown',
    age: 29,
    priority: 'high',
    vitals: {
      heartRate: {
        value: 96,
        status: 'elevated'
      },
      bloodPressure: {
        value: '140/85',
        status: 'elevated'
      },
      bloodOxygen: {
        value: 94,
        status: 'normal'
      },
      temperature: {
        value: 100.9,
        status: 'warning'
      }
    },
    status: 'self-presented',
    symptoms: ['rash', 'fever', 'joint pain']
  },
  {
    id: 'PT10497',
    name: 'Liam Miller',
    age: 42,
    priority: 'medium',
    vitals: {
      heartRate: {
        value: 85,
        status: 'normal'
      },
      bloodPressure: {
        value: '132/82',
        status: 'elevated'
      },
      bloodOxygen: {
        value: 96,
        status: 'normal'
      },
      temperature: {
        value: 99.5,
        status: 'elevated'
      }
    },
    status: 'self-presented',
    symptoms: ['back pain', 'difficulty urinating']
  },
  {
    id: 'PT10498',
    name: 'Olivia Davis',
    age: 62,
    priority: 'medium',
    vitals: {
      heartRate: {
        value: 87,
        status: 'normal'
      },
      bloodPressure: {
        value: '128/80',
        status: 'normal'
      },
      bloodOxygen: {
        value: 96,
        status: 'normal'
      },
      temperature: {
        value: 99.2,
        status: 'elevated'
      }
    },
    status: 'self-presented',
    symptoms: ['persistent cough', 'mild fever', 'fatigue']
  },
  {
    id: 'PT10499',
    name: 'Ethan Wilson',
    age: 19,
    priority: 'medium',
    vitals: {
      heartRate: {
        value: 88,
        status: 'normal'
      },
      bloodPressure: {
        value: '125/78',
        status: 'normal'
      },
      bloodOxygen: {
        value: 97,
        status: 'normal'
      },
      temperature: {
        value: 100.1,
        status: 'elevated'
      }
    },
    status: 'self-presented',
    symptoms: ['sore throat', 'mild fever', 'headache']
  },
  {
    id: 'PT10500',
    name: 'Ava Taylor',
    age: 8,
    priority: 'medium',
    vitals: {
      heartRate: {
        value: 95,
        status: 'elevated'
      },
      bloodPressure: {
        value: '105/65',
        status: 'normal'
      },
      bloodOxygen: {
        value: 98,
        status: 'normal'
      },
      temperature: {
        value: 100.4,
        status: 'warning'
      }
    },
    status: 'self-presented',
    symptoms: ['ear pain', 'fever', 'irritability']
  },
  {
    id: 'PT10501',
    name: 'James Anderson',
    age: 55,
    priority: 'low',
    vitals: {
      heartRate: {
        value: 78,
        status: 'normal'
      },
      bloodPressure: {
        value: '124/76',
        status: 'normal'
      },
      bloodOxygen: {
        value: 98,
        status: 'normal'
      },
      temperature: {
        value: 98.9,
        status: 'normal'
      }
    },
    status: 'self-presented',
    symptoms: ['twisted ankle', 'mild swelling']
  },
  {
    id: 'PT10502',
    name: 'Charlotte Garcia',
    age: 31,
    priority: 'low',
    vitals: {
      heartRate: {
        value: 75,
        status: 'normal'
      },
      bloodPressure: {
        value: '118/72',
        status: 'normal'
      },
      bloodOxygen: {
        value: 99,
        status: 'normal'
      },
      temperature: {
        value: 98.6,
        status: 'normal'
      }
    },
    status: 'self-presented',
    symptoms: ['mild rash', 'itching']
  },
  {
    id: 'PT10503',
    name: 'Benjamin Robinson',
    age: 27,
    priority: 'low',
    vitals: {
      heartRate: {
        value: 72,
        status: 'normal'
      },
      bloodPressure: {
        value: '120/75',
        status: 'normal'
      },
      bloodOxygen: {
        value: 98,
        status: 'normal'
      },
      temperature: {
        value: 98.8,
        status: 'normal'
      }
    },
    status: 'self-presented',
    symptoms: ['laceration on hand', 'minor bleeding']
  },
  {
    id: 'PT10504',
    name: 'Amelia Lee',
    age: 45,
    priority: 'low',
    vitals: {
      heartRate: {
        value: 76,
        status: 'normal'
      },
      bloodPressure: {
        value: '122/78',
        status: 'normal'
      },
      bloodOxygen: {
        value: 98,
        status: 'normal'
      },
      temperature: {
        value: 98.7,
        status: 'normal'
      }
    },
    status: 'self-presented',
    symptoms: ['eye irritation', 'redness', 'tearing']
  },
];

// Format for schema.ts Patient type used in the API
export const mockPatients = mockPatientEntries.map(patient => ({
  id: parseInt(patient.id.replace(/\D/g, '')),
  name: patient.name,
  age: patient.age,
  patientId: patient.id,
  status: patient.priority === 'critical' ? '1' : 
          patient.priority === 'high' ? '2' : 
          patient.priority === 'medium' ? '3' : '4',
  arrivalMethod: patient.status,
  symptoms: patient.symptoms.join(', '),
  createdAt: new Date()
}));
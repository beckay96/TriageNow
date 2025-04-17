import { PatientEntry } from '@/store';

export const mockPatientEntries: PatientEntry[] = [
  {
    id: 'PT-78945',
    name: 'Maria Johnson',
    age: 68,
    priority: 'critical',
    vitals: {
      heartRate: {
        value: 112,
        status: 'critical'
      },
      bloodPressure: {
        value: '165/95',
        status: 'critical'
      },
      bloodOxygen: {
        value: 92,
        status: 'warning'
      }
    },
    status: 'ambulance',
    symptoms: ['Severe chest pain', 'difficulty breathing', 'dizziness']
  },
  {
    id: 'PT-54321',
    name: 'Robert Chen',
    age: 52,
    priority: 'critical',
    vitals: {
      heartRate: {
        value: 135,
        status: 'critical'
      },
      bloodPressure: {
        value: '190/110',
        status: 'critical'
      },
      bloodOxygen: {
        value: 96,
        status: 'normal'
      }
    },
    status: 'self-presented',
    symptoms: ['Severe headache', 'blurred vision', 'nausea']
  },
  {
    id: 'PT-12356',
    name: 'Emily Davis',
    age: 34,
    priority: 'high',
    vitals: {
      heartRate: {
        value: 105,
        status: 'warning'
      },
      bloodPressure: {
        value: '145/92',
        status: 'warning'
      },
      bloodOxygen: {
        value: 94,
        status: 'warning'
      }
    },
    status: 'ambulance',
    symptoms: ['Abdominal pain', 'fever', 'vomiting']
  },
  {
    id: 'PT-67890',
    name: 'James Wilson',
    age: 45,
    priority: 'medium',
    vitals: {
      heartRate: {
        value: 92,
        status: 'elevated'
      },
      bloodPressure: {
        value: '135/85',
        status: 'elevated'
      },
      bloodOxygen: {
        value: 97,
        status: 'normal'
      }
    },
    status: 'self-presented',
    symptoms: ['Persistent cough', 'mild fever', 'fatigue']
  },
  {
    id: 'PT-35791',
    name: 'Sarah Miller',
    age: 29,
    priority: 'low',
    vitals: {
      heartRate: {
        value: 72,
        status: 'normal'
      },
      bloodPressure: {
        value: '120/80',
        status: 'normal'
      },
      bloodOxygen: {
        value: 99,
        status: 'normal'
      }
    },
    status: 'self-presented',
    symptoms: ['Sprained ankle', 'mild pain']
  },
  {
    id: 'PT-24680',
    name: 'David Thompson',
    age: 61,
    priority: 'high',
    vitals: {
      heartRate: {
        value: 98,
        status: 'elevated'
      },
      bloodPressure: {
        value: '160/95',
        status: 'warning'
      },
      bloodOxygen: {
        value: 93,
        status: 'warning'
      }
    },
    status: 'self-presented',
    symptoms: ['Shortness of breath', 'chest tightness', 'coughing']
  },
  {
    id: 'PT-13579',
    name: 'Jennifer Adams',
    age: 42,
    priority: 'medium',
    vitals: {
      heartRate: {
        value: 88,
        status: 'normal'
      },
      bloodPressure: {
        value: '140/88',
        status: 'elevated'
      },
      bloodOxygen: {
        value: 96,
        status: 'normal'
      }
    },
    status: 'self-presented',
    symptoms: ['Migraine', 'nausea', 'sensitivity to light']
  },
  {
    id: 'PT-97531',
    name: 'Michael Brown',
    age: 57,
    priority: 'high',
    vitals: {
      heartRate: {
        value: 110,
        status: 'warning'
      },
      bloodPressure: {
        value: '150/95',
        status: 'warning'
      },
      bloodOxygen: {
        value: 94,
        status: 'warning'
      }
    },
    status: 'ambulance',
    symptoms: ['Fainting', 'irregular heartbeat', 'confusion']
  },
  {
    id: 'PT-24683',
    name: 'Lisa Garcia',
    age: 31,
    priority: 'medium',
    vitals: {
      heartRate: {
        value: 95,
        status: 'elevated'
      },
      bloodPressure: {
        value: '130/85',
        status: 'elevated'
      },
      bloodOxygen: {
        value: 97,
        status: 'normal'
      }
    },
    status: 'self-presented',
    symptoms: ['Severe back pain', 'difficulty walking']
  },
  {
    id: 'PT-36912',
    name: 'Thomas Wright',
    age: 73,
    priority: 'high',
    vitals: {
      heartRate: {
        value: 102,
        status: 'warning'
      },
      bloodPressure: {
        value: '165/92',
        status: 'warning'
      },
      bloodOxygen: {
        value: 93,
        status: 'warning'
      }
    },
    status: 'ambulance',
    symptoms: ['Fall', 'head injury', 'disorientation']
  },
  {
    id: 'PT-14785',
    name: 'Amanda Lee',
    age: 27,
    priority: 'low',
    vitals: {
      heartRate: {
        value: 78,
        status: 'normal'
      },
      bloodPressure: {
        value: '118/75',
        status: 'normal'
      },
      bloodOxygen: {
        value: 98,
        status: 'normal'
      }
    },
    status: 'self-presented',
    symptoms: ['Sore throat', 'mild fever', 'cough']
  }
];

import { patients, type Patient, type InsertPatient, vitals, type Vitals, type InsertVitals, questionnaires, type Questionnaire, type InsertQuestionnaire, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Patient methods
  getPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient | undefined>;

  // Vitals methods
  getVitals(patientId: number): Promise<Vitals[]>;
  getLatestVitals(patientId: number): Promise<Vitals | undefined>;
  createVitals(vitals: InsertVitals): Promise<Vitals>;

  // Questionnaire methods
  getQuestionnaire(patientId: number): Promise<Questionnaire | undefined>;
  createQuestionnaire(questionnaire: InsertQuestionnaire): Promise<Questionnaire>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private patients: Map<number, Patient>;
  private vitalsRecords: Map<number, Vitals[]>;
  private questionnaireRecords: Map<number, Questionnaire>;
  private userId: number;
  private patientId: number;
  private vitalsId: number;
  private questionnaireId: number;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.vitalsRecords = new Map();
    this.questionnaireRecords = new Map();
    this.userId = 1;
    this.patientId = 1;
    this.vitalsId = 1;
    this.questionnaireId = 1;

    // Initialize with mock data
    this.initializeMockData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Patient methods
  async getPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.patientId++;
    const patient: Patient = { ...insertPatient, id };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatient(id: number, patientData: Partial<InsertPatient>): Promise<Patient | undefined> {
    const patient = this.patients.get(id);
    if (!patient) return undefined;
    
    const updatedPatient = { ...patient, ...patientData };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  // Vitals methods
  async getVitals(patientId: number): Promise<Vitals[]> {
    return this.vitalsRecords.get(patientId) || [];
  }

  async getLatestVitals(patientId: number): Promise<Vitals | undefined> {
    const patientVitals = this.vitalsRecords.get(patientId) || [];
    if (patientVitals.length === 0) return undefined;
    
    return patientVitals.reduce((latest, current) => {
      return latest.timestamp > current.timestamp ? latest : current;
    });
  }

  async createVitals(insertVitals: InsertVitals): Promise<Vitals> {
    const id = this.vitalsId++;
    const vitals: Vitals = { ...insertVitals, id };
    
    const patientVitals = this.vitalsRecords.get(vitals.patientId) || [];
    patientVitals.push(vitals);
    this.vitalsRecords.set(vitals.patientId, patientVitals);
    
    return vitals;
  }

  // Questionnaire methods
  async getQuestionnaire(patientId: number): Promise<Questionnaire | undefined> {
    return this.questionnaireRecords.get(patientId);
  }

  async createQuestionnaire(insertQuestionnaire: InsertQuestionnaire): Promise<Questionnaire> {
    const id = this.questionnaireId++;
    const questionnaire: Questionnaire = { ...insertQuestionnaire, id };
    this.questionnaireRecords.set(questionnaire.patientId, questionnaire);
    return questionnaire;
  }

  // Mock data initialization
  private initializeMockData() {
    // Create mock patients with vitals
    const mockPatientData = [
      {
        name: "Robert Johnson",
        age: 67,
        gender: "M",
        condition: "Chest Pain",
        priority: 1,
        status: "Ambulance Inbound",
        arrivalTime: new Date(Date.now() - 5 * 60000), // 5 minutes ago
        vitals: {
          heartRate: 132,
          oxygenLevel: 92,
          temperature: "38.5",
          bloodPressure: "165/95"
        }
      },
      {
        name: "Maria Garcia",
        age: 42,
        gender: "F",
        condition: "Severe Migraine",
        priority: 2,
        status: "Self-Presented",
        arrivalTime: new Date(Date.now() - 23 * 60000), // 23 minutes ago
        vitals: {
          heartRate: 98,
          oxygenLevel: 97,
          temperature: "37.1",
          bloodPressure: "135/85"
        }
      },
      {
        name: "David Lee",
        age: 28,
        gender: "M",
        condition: "Sprained Ankle",
        priority: 3,
        status: "Self-Presented",
        arrivalTime: new Date(Date.now() - 47 * 60000), // 47 minutes ago
        vitals: {
          heartRate: 72,
          oxygenLevel: 99,
          temperature: "36.8",
          bloodPressure: "120/80"
        }
      },
      {
        name: "Emily Wong",
        age: 52,
        gender: "F",
        condition: "Abdominal Pain",
        priority: 2,
        status: "Self-Presented",
        arrivalTime: new Date(Date.now() - 35 * 60000), // 35 minutes ago
        vitals: {
          heartRate: 105,
          oxygenLevel: 96,
          temperature: "37.8",
          bloodPressure: "140/90"
        }
      },
      {
        name: "James Smith",
        age: 75,
        gender: "M",
        condition: "Difficulty Breathing",
        priority: 1,
        status: "Ambulance On Way",
        arrivalTime: new Date(Date.now() - 8 * 60000), // 8 minutes ago
        vitals: {
          heartRate: 120,
          oxygenLevel: 88,
          temperature: "37.9",
          bloodPressure: "155/90"
        }
      }
    ];

    mockPatientData.forEach(data => {
      const id = this.patientId++;
      const patient: Patient = { ...data, id };
      this.patients.set(id, patient);
      
      // Create vitals record
      const vitalsId = this.vitalsId++;
      const vitalsRecord: Vitals = {
        id: vitalsId,
        patientId: id,
        heartRate: data.vitals.heartRate,
        oxygenLevel: data.vitals.oxygenLevel,
        temperature: data.vitals.temperature,
        bloodPressure: data.vitals.bloodPressure,
        timestamp: new Date()
      };
      
      this.vitalsRecords.set(id, [vitalsRecord]);
    });
  }
}

export const storage = new MemStorage();

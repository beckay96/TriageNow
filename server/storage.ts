import { 
  users, type User, type InsertUser,
  patients, type Patient, type InsertPatient,
  healthMetrics, type HealthMetrics, type InsertHealthMetrics,
  triageRecords, type TriageRecord, type InsertTriageRecord
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Patient methods
  getPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByPatientId(patientId: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient | undefined>;

  // Health metrics methods
  getHealthMetrics(patientId: number): Promise<HealthMetrics[]>;
  createHealthMetrics(metrics: InsertHealthMetrics): Promise<HealthMetrics>;

  // Triage methods
  getTriageRecord(patientId: number): Promise<TriageRecord | undefined>;
  createTriageRecord(record: InsertTriageRecord): Promise<TriageRecord>;
  updateTriageRecord(id: number, record: Partial<InsertTriageRecord>): Promise<TriageRecord | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private patients: Map<number, Patient>;
  private healthMetrics: Map<number, HealthMetrics[]>;
  private triageRecords: Map<number, TriageRecord>;
  
  private currentUserId: number;
  private currentPatientId: number;
  private currentHealthMetricsId: number;
  private currentTriageRecordId: number;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.healthMetrics = new Map();
    this.triageRecords = new Map();
    
    this.currentUserId = 1;
    this.currentPatientId = 1;
    this.currentHealthMetricsId = 1;
    this.currentTriageRecordId = 1;
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
    const id = this.currentUserId++;
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

  async getPatientByPatientId(patientId: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(
      (patient) => patient.patientId === patientId,
    );
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.currentPatientId++;
    const patient: Patient = { 
      ...insertPatient, 
      id, 
      createdAt: new Date() 
    };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatient(id: number, patientUpdate: Partial<InsertPatient>): Promise<Patient | undefined> {
    const existingPatient = this.patients.get(id);
    if (!existingPatient) return undefined;

    const updatedPatient = { ...existingPatient, ...patientUpdate };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  // Health metrics methods
  async getHealthMetrics(patientId: number): Promise<HealthMetrics[]> {
    return this.healthMetrics.get(patientId) || [];
  }

  async createHealthMetrics(insertMetrics: InsertHealthMetrics): Promise<HealthMetrics> {
    const id = this.currentHealthMetricsId++;
    const metrics: HealthMetrics = { 
      ...insertMetrics, 
      id, 
      timestamp: new Date() 
    };
    
    const patientMetrics = this.healthMetrics.get(insertMetrics.patientId) || [];
    patientMetrics.push(metrics);
    this.healthMetrics.set(insertMetrics.patientId, patientMetrics);
    
    return metrics;
  }

  // Triage methods
  async getTriageRecord(patientId: number): Promise<TriageRecord | undefined> {
    return Array.from(this.triageRecords.values()).find(
      (record) => record.patientId === patientId
    );
  }

  async createTriageRecord(insertRecord: InsertTriageRecord): Promise<TriageRecord> {
    const id = this.currentTriageRecordId++;
    const record: TriageRecord = { 
      ...insertRecord, 
      id, 
      timestamp: new Date() 
    };
    this.triageRecords.set(id, record);
    return record;
  }

  async updateTriageRecord(id: number, recordUpdate: Partial<InsertTriageRecord>): Promise<TriageRecord | undefined> {
    const existingRecord = this.triageRecords.get(id);
    if (!existingRecord) return undefined;

    const updatedRecord = { ...existingRecord, ...recordUpdate };
    this.triageRecords.set(id, updatedRecord);
    return updatedRecord;
  }
}

export const storage = new MemStorage();

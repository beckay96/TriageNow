import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Patient schema
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  patientId: text("patient_id").notNull().unique(),
  status: text("status").notNull(),
  arrivalMethod: text("arrival_method").notNull(),
  symptoms: text("symptoms").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

// Health metrics schema
export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  heartRate: integer("heart_rate").notNull(),
  bloodPressureSystolic: integer("blood_pressure_systolic").notNull(),
  bloodPressureDiastolic: integer("blood_pressure_diastolic").notNull(),
  bloodOxygen: integer("blood_oxygen").notNull(),
  temperature: text("temperature").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertHealthMetricsSchema = createInsertSchema(healthMetrics).omit({
  id: true,
  timestamp: true,
});

export type InsertHealthMetrics = z.infer<typeof insertHealthMetricsSchema>;
export type HealthMetrics = typeof healthMetrics.$inferSelect;

// Triage schema
export const triageRecords = pgTable("triage_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  triageLevel: text("triage_level").notNull(),
  notes: text("notes"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertTriageRecordSchema = createInsertSchema(triageRecords).omit({
  id: true,
  timestamp: true,
});

export type InsertTriageRecord = z.infer<typeof insertTriageRecordSchema>;
export type TriageRecord = typeof triageRecords.$inferSelect;

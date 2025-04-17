import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  condition: text("condition"),
  priority: integer("priority").notNull(),
  status: text("status").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  vitals: json("vitals").notNull(),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true
});

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

export const vitals = pgTable("vitals", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  heartRate: integer("heart_rate").notNull(),
  oxygenLevel: integer("oxygen_level").notNull(),
  temperature: text("temperature").notNull(),
  bloodPressure: text("blood_pressure").notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

export const insertVitalsSchema = createInsertSchema(vitals).omit({
  id: true
});

export type InsertVitals = z.infer<typeof insertVitalsSchema>;
export type Vitals = typeof vitals.$inferSelect;

export const questionnaires = pgTable("questionnaires", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  symptoms: text("symptoms"),
  symptomsStarted: text("symptoms_started"),
  painLevel: integer("pain_level"),
  medicalConditions: text("medical_conditions").array(),
  medications: text("medications"),
  submittedAt: timestamp("submitted_at").notNull(),
});

export const insertQuestionnaireSchema = createInsertSchema(questionnaires).omit({
  id: true
});

export type InsertQuestionnaire = z.infer<typeof insertQuestionnaireSchema>;
export type Questionnaire = typeof questionnaires.$inferSelect;

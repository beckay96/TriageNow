import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPatientSchema, insertQuestionnaireSchema, insertVitalsSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET all patients
  app.get("/api/patients", async (_req: Request, res: Response) => {
    try {
      const patients = await storage.getPatients();
      return res.status(200).json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      return res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  // GET a single patient
  app.get("/api/patients/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid patient ID" });
      }

      const patient = await storage.getPatient(id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      return res.status(200).json(patient);
    } catch (error) {
      console.error("Error fetching patient:", error);
      return res.status(500).json({ message: "Failed to fetch patient" });
    }
  });

  // POST a new patient
  app.post("/api/patients", async (req: Request, res: Response) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(validatedData);
      return res.status(201).json(patient);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating patient:", error);
      return res.status(500).json({ message: "Failed to create patient" });
    }
  });

  // UPDATE a patient
  app.patch("/api/patients/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid patient ID" });
      }

      const partialSchema = insertPatientSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      
      const updatedPatient = await storage.updatePatient(id, validatedData);
      if (!updatedPatient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      return res.status(200).json(updatedPatient);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating patient:", error);
      return res.status(500).json({ message: "Failed to update patient" });
    }
  });

  // GET vitals for a patient
  app.get("/api/patients/:id/vitals", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid patient ID" });
      }

      const vitals = await storage.getVitals(id);
      return res.status(200).json(vitals);
    } catch (error) {
      console.error("Error fetching vitals:", error);
      return res.status(500).json({ message: "Failed to fetch vitals" });
    }
  });

  // GET latest vitals for a patient
  app.get("/api/patients/:id/vitals/latest", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid patient ID" });
      }

      const vitals = await storage.getLatestVitals(id);
      if (!vitals) {
        return res.status(404).json({ message: "No vitals found for patient" });
      }

      return res.status(200).json(vitals);
    } catch (error) {
      console.error("Error fetching latest vitals:", error);
      return res.status(500).json({ message: "Failed to fetch latest vitals" });
    }
  });

  // POST new vitals for a patient
  app.post("/api/patients/:id/vitals", async (req: Request, res: Response) => {
    try {
      const patientId = Number(req.params.id);
      if (isNaN(patientId)) {
        return res.status(400).json({ message: "Invalid patient ID" });
      }

      const validatedData = insertVitalsSchema.parse({
        ...req.body,
        patientId,
        timestamp: new Date()
      });
      
      const vitals = await storage.createVitals(validatedData);
      return res.status(201).json(vitals);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating vitals:", error);
      return res.status(500).json({ message: "Failed to create vitals" });
    }
  });

  // GET questionnaire for a patient
  app.get("/api/patients/:id/questionnaire", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid patient ID" });
      }

      const questionnaire = await storage.getQuestionnaire(id);
      if (!questionnaire) {
        return res.status(404).json({ message: "No questionnaire found for patient" });
      }

      return res.status(200).json(questionnaire);
    } catch (error) {
      console.error("Error fetching questionnaire:", error);
      return res.status(500).json({ message: "Failed to fetch questionnaire" });
    }
  });

  // POST a new questionnaire for a patient
  app.post("/api/patients/:id/questionnaire", async (req: Request, res: Response) => {
    try {
      const patientId = Number(req.params.id);
      if (isNaN(patientId)) {
        return res.status(400).json({ message: "Invalid patient ID" });
      }

      const validatedData = insertQuestionnaireSchema.parse({
        ...req.body,
        patientId,
        submittedAt: new Date()
      });
      
      const questionnaire = await storage.createQuestionnaire(validatedData);
      return res.status(201).json(questionnaire);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating questionnaire:", error);
      return res.status(500).json({ message: "Failed to create questionnaire" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

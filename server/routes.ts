import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPatientSchema, insertHealthMetricsSchema, insertTriageRecordSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  // Patient routes
  apiRouter.get("/patients", async (req, res) => {
    try {
      const patients = await storage.getPatients();
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  apiRouter.get("/patients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const patient = await storage.getPatient(id);
      
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      
      res.json(patient);
    } catch (error) {
      console.error("Error fetching patient:", error);
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  });

  apiRouter.post("/patients", async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid patient data", errors: error.errors });
      }
      console.error("Error creating patient:", error);
      res.status(500).json({ message: "Failed to create patient" });
    }
  });

  apiRouter.patch("/patients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedPatient = await storage.updatePatient(id, updateData);
      
      if (!updatedPatient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      
      res.json(updatedPatient);
    } catch (error) {
      console.error("Error updating patient:", error);
      res.status(500).json({ message: "Failed to update patient" });
    }
  });

  // Health metrics routes
  apiRouter.get("/health-metrics/:patientId", async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const metrics = await storage.getHealthMetrics(patientId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      res.status(500).json({ message: "Failed to fetch health metrics" });
    }
  });

  apiRouter.post("/health-metrics", async (req, res) => {
    try {
      const metricsData = insertHealthMetricsSchema.parse(req.body);
      const metrics = await storage.createHealthMetrics(metricsData);
      res.status(201).json(metrics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid health metrics data", errors: error.errors });
      }
      console.error("Error creating health metrics:", error);
      res.status(500).json({ message: "Failed to create health metrics" });
    }
  });

  // Triage routes
  apiRouter.get("/triage/:patientId", async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const triage = await storage.getTriageRecord(patientId);
      
      if (!triage) {
        return res.status(404).json({ message: "Triage record not found" });
      }
      
      res.json(triage);
    } catch (error) {
      console.error("Error fetching triage record:", error);
      res.status(500).json({ message: "Failed to fetch triage record" });
    }
  });

  apiRouter.post("/triage", async (req, res) => {
    try {
      const triageData = insertTriageRecordSchema.parse(req.body);
      const triage = await storage.createTriageRecord(triageData);
      res.status(201).json(triage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid triage data", errors: error.errors });
      }
      console.error("Error creating triage record:", error);
      res.status(500).json({ message: "Failed to create triage record" });
    }
  });

  apiRouter.patch("/triage/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedTriage = await storage.updateTriageRecord(id, updateData);
      
      if (!updatedTriage) {
        return res.status(404).json({ message: "Triage record not found" });
      }
      
      res.json(updatedTriage);
    } catch (error) {
      console.error("Error updating triage record:", error);
      res.status(500).json({ message: "Failed to update triage record" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

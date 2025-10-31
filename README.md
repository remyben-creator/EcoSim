# EcoSim

A Full-Stack Ecosystem Simulation for Learning Modern Web Infrastructure

## Overview

EcoSim is an educational, full-stack simulation that uses an ecosystem metaphor to explore how real-world web applications, databases, and backend services interact.

Every design decision in this project was made as an exercise in learning the tech stack; from database modeling and backend logic to event-driven architecture and system orchestration.

Rather than building a traditional CRUD app, EcoSim transforms backend and database concepts into living entities: plants, rabbits, and foxes, each representing a core layer of modern software systems. 

The simulation logic does not represent a living ecosystem very well! The purpose was to develop a full-stack application, not to run tests on a simulation.

## Conceptual Mapping
### Ecosystem Element	Represents in Real Systems	What You Learn
- 🌱 Grass (Plants)	MongoDB Documents:	CRUD operations, data modeling, and query/update cycles
- 🐇 Rabbits (Herbivores)	Node.js Services / Backend Logic:	How backend processes consume and mutate stored data
- 🦊 Foxes (Carnivores)	Controllers: / Advanced Services	Dependency management, multi-service orchestration
- Energy / Hunger	Application State Management:	Tracking runtime variables, session data, persistence
- Simulation Tick	Event Loop / API Trigger:	Timed execution, batch processing, and atomic updates
- Environment	Database + Server Infrastructure:	How Node, MongoDB, and optional cloud services interact
- Reproduction / Death	Lifecycle Hooks / Metrics / Logging	Monitoring, debugging, and lifecycle events
- Population Dynamics	Scaling / Load Management:	Horizontal scaling, resource contention, and feedback loops
- Predator–Prey Interactions:	API Dependencies / Service Chaining	Multi-layered queries, inter-service communication
- User Interactions	Frontend API Triggers / Webhooks:	How external inputs affect system state dynamically
Core Architecture
## 1. MongoDB (Grass Layer)

Each piece of grass is a MongoDB document — it grows, gets consumed, and regenerates, mimicking natural CRUD lifecycles.

File: /models/Plant.js → Blueprint defining plant schema & behavior

File: /controllers/PlantController.js → Manager handling plant CRUD operations and simulation interactions

### Learning Goals:

Practice CRUD operations

Understand database-driven state changes

Model independent and dependent entities

## 2. Node.js Services (Rabbits Layer)

Rabbits are backend logic units — Node.js services that consume data (grass), modify it, and reproduce.
They simulate microservices operating in parallel, interacting with a shared database.

### Learning Goals:

Implement services that consume and mutate DB state

Handle asynchronous events and state changes

Explore concurrency and independent processes

## 3. Node.js Controllers (Foxes Layer)

Foxes are higher-level logic entities that depend on other services (rabbits).
They represent orchestration layers that must combine data and manage dependencies gracefully.

### Learning Goals:

Build complex, multi-step backend operations

Manage service dependencies and data synchronization

Simulate how APIs aggregate and transform data

## 4. Simulation Engine (Ticks)

Each tick is a simulation cycle — an event that updates all entities in order: 

Grass grows.

Rabbits eat and move. (BFS food finding when hungry)

Foxes hunt. (BFS when hungry)

States are persisted to MongoDB.

This models batch jobs, event loops, and periodic backend tasks in production systems.

Learning Design Philosophy

EcoSim was never meant to be production-perfect — it was designed to:

Demystify backend data flow by linking it to tangible, visible processes.

Show system feedback in real time (e.g., overpopulation = resource exhaustion).

Encourage experimentation with real backend operations safely.

Promote creative mental models that tie software behavior to real-world dynamics.

Every abstraction is chosen to mirror something real:

A rabbit’s hunger mirrors session decay or job expiry.

Grass regeneration mimics data lifecycle and updates.

Fox predation mirrors dependency resolution and scaling limits.

## Technical Components
### Backend

Node.js / Express for simulation orchestration and API endpoints

MongoDB for persistent data storage and entity state

Socket.IO (Real-Time Layer) for live updates between backend and frontend  

Webhooks for external or periodic events

MinIO Integration for event-driven uploads and server notifications

### Frontend 

A simple interface (React or plain JS) to visualize entities and user-triggered events

User actions map to simulation changes (feeding, spawning, resetting)

Key Features

Dynamic entity interactions via REST endpoints
Simulation tick engine for time-based updates
Modular MVC-inspired architecture
MongoDB CRUD training through ecological analogies
Logging and console monitoring for educational observability
Event-driven extensions using MinIO webhooks
Designed for experimentation, not perfection

### MinIO / AWS S3 Integration
The simulation hooks directly into cloud-like storage events. When new data (e.g., simulation files or run logs) is uploaded, MinIO sends a webhook to the Express backend (/webhooks/s3), automatically triggering ecosystem updates or responses.

This mirrors real-world event-driven architectures, where cloud storage changes notify backend systems to react — for example, ingesting data, running analysis, or scaling services.

The integration was implemented and tested using MinIO’s notify_webhook configuration, acting as a local S3-compatible source of real-time events.

In the simulation metaphor, these webhooks behave like environmental disturbances or external stimuli — external data “dropping into the ecosystem” and affecting its state.

## Setup & Run
### 1. Clone the repo
git clone https://github.com/remyben-creator/EcoSim.git
cd EcoSim

### 2. Install dependencies
npm install

### 3. Run MongoDB locally or via Docker

### 4. Start the backend
npm run dev

### 5. (Optional) Start the frontend or visualization UI
npm run dev:frontend

### 6. (Optional) Set up MinIO for Webhook Integration

## Future Directions

Add more species (microservice expansion)

Integrate authentication (user ecosystems)

Visualize metrics (Grafana-like dashboards)

Map population density to scaling behaviors

Random mutations mimic errors, retries, and resilience.

## Author’s Note

This project is a learning sandbox.
It’s a living metaphor for how modern software systems breathe, interact, and evolve.
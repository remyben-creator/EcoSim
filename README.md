Grass = MongoDB Documents
    - raw data that grows and changes.
    - each piece of grass is like a mongoDB document you store and query

Practice CRUD operations
Analogous to how a real backend stores core data

Plant.js      → "Blueprint" (how a plant behaves, instance methods)
PlantController.js → "Manager" (how we use the plants in the simulation)

Rabbits(Herbavores) = Node.js services / backend logic
    - processes that act on data
    - they query MongoDB(eat grass), update states, reproduce

Learn how backend consumes and manipulates data
could even parallel microservices in a real system: small independent processes acting on data

Foxes(Carnivores) = Node.js controllers / advances services
    - higher-level processes that depend on other processes (e.g. rabbit population)
    - they also query/update MongoDB, but with more complex rules

teaches dependency handling and multi-step processes
can simulat how APIs combine multiple DB queries or services

Energy/Hunger = State Management
    - tracks runtime variables or DB fields that deetermine whn entities act
    - can represent session/state management variables

teaches how state changes over tim and how to model it for persistance

Simulation Tick = event loop/cron/API call
    - each tick = one cycle of backend processing
    - like a batch job or microservice executing periodically

helps to understand periodic updates, atomic operations, and order of execution, which mirrors real backend scheduling tasks

Environment = Database + Server infra
    - holds all entities and rules
    - could be thought of as MongoDB + Node + optional AWS infra   

Reproduction/death = state-driven lifecycle 
    - teaches actions for monitoring and debugging
    - application logs, metrics dashboards, sentry/datadog alerts

Population dynamics - load management/ scaling
    - demonstrates system feedback loops
    - horizontal scaling, resource contention, rate limiting

Predator/prey interactions - API dependency/ service orchestration
    - shows inter-service communication and data flow
    - event-driven architecture, API calls between services

Random events / mutations = error handling / retries / stochastic proceses
    - teaches how to handle unpredictable behavior
    - failues, retries, timeouts, rolling updates

User Interaction - frontend triggers / external inputs 
    - simulates inputs that affect the system
    - user submitting forms, API consumers, webhook events

Extensions for "clerkie alignment"
add users - simulate interactions like a front-end user triggering events
logs - like logger.js, gives readable narration(parallel to observability/monitoring in real systems)
scaling/cloud - later map fox/rabbit density to load balancing / server scaling concepts
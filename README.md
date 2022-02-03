# Taskify
Motivated by workflows orchestration, Taskify is a REST API based tool trying to execute dynamic tasks in a defined order

## Install dependencies
- Clone the repo
- Run `npm install`

## Build and Run
- Run `npm run start`
- App will start running on the default port 3000

### API Endpoints
`PUT /taskset` - To create the task-set and start execution
 - Body e.g. `taskify_sample.json`
 - Response `{"taskId":"1c020a48-beec-4a11-aea7-996d076eb3f4","status":"open"}`

`GET /taskset/:ts_id` - To fetch the current status and execution result of the task
 - Response e.g. `{"id":"65d08c1f-ed9b-49bd-b96e-74655d964bee","status":"failed"}`

### Support and Limitations
This PoC has been developed only for the demostration of design approach hence it has quite a lot of technical limitaions:
 - It currently supports only 3 types of tasks (HTTP, Execution of JS code and Send Email)
 - It lacks a mature fault tolerance
 - It utilises only an in-memory store (instead of a real DB) for saving the state of the tasks. As soon as the server goes down the data is lost
 - It does not include any tests at the moment
 - and so on...



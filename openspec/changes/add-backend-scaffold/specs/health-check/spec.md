## ADDED Requirements

### Requirement: Health Check Endpoint
The API MUST expose a `GET /health` endpoint that returns the server's operational status.

#### Scenario: Health check returns OK
- **WHEN** a `GET` request is made to `/health`
- **THEN** the response status MUST be `200`
- **AND** the response body MUST include a `status` field with value `ok`

#### Scenario: Health check response includes uptime
- **WHEN** a `GET` request is made to `/health`
- **THEN** the response body MUST include an `uptime` field with the server process uptime in seconds

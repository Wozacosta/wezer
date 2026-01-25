# BMAD Agents

This project uses the BMAD (Build, Measure, Act, Design) framework for AI-assisted development. BMAD provides specialized agents that act as virtual team members, each with distinct expertise and workflows.

## Quick Start

Invoke any agent using the `/bmad:bmm:agents:<agent-name>` command:

```bash
/bmad:bmm:agents:dev        # Developer Agent
/bmad:bmm:agents:analyst    # Business Analyst
/bmad:bmm:agents:architect  # Architect
```

For the master orchestrator:

```bash
/bmad:core:agents:bmad-master
```

## Available Agents

### Core Agent

| Agent | Name | Icon | Command | Purpose |
|-------|------|------|---------|---------|
| **BMad Master** | BMad Master | :mage: | `/bmad:core:agents:bmad-master` | Master orchestrator and workflow coordinator |

### BMM Module Agents

| Agent | Name | Icon | Command | Purpose |
|-------|------|------|---------|---------|
| **Business Analyst** | Mary | :bar_chart: | `/bmad:bmm:agents:analyst` | Product discovery, requirements elicitation, PRD creation |
| **Architect** | Winston | :building_construction: | `/bmad:bmm:agents:architect` | System design, architectural decisions, technical planning |
| **Developer** | Amelia | :computer: | `/bmad:bmm:agents:dev` | Story implementation, TDD workflow, code development |
| **Product Manager** | John | :clipboard: | `/bmad:bmm:agents:pm` | Product roadmap, feature prioritization, stakeholder alignment |
| **Scrum Master** | Bob | :person_running: | `/bmad:bmm:agents:sm` | Sprint planning, story creation, agile ceremonies |
| **Quick Flow Solo Dev** | Barry | :rocket: | `/bmad:bmm:agents:quick-flow-solo-dev` | Rapid prototyping, solo development workflows |
| **Test Architect** | Murat | :test_tube: | `/bmad:bmm:agents:tea` | Test strategy, automation framework, quality assurance |
| **Technical Writer** | Paige | :books: | `/bmad:bmm:agents:tech-writer` | Documentation, diagrams, technical explanations |
| **UX Designer** | Sally | :art: | `/bmad:bmm:agents:ux-designer` | User experience, wireframes, design patterns |

## Agent Details

### BMad Master

The master orchestrator that coordinates all other agents and manages complex multi-agent workflows.

**Key Capabilities:**

- Workflow orchestration across agents
- Knowledge management and custodianship
- Party mode for multi-agent collaboration
- Project initialization and status tracking

### Business Analyst (Mary)

Creates comprehensive product briefs through collaborative discovery.

**Key Workflows:**

- Create Product Brief - Step-by-step product discovery
- Research workflows (market, domain, technical)
- Brainstorming sessions

### Architect (Winston)

Designs system architecture optimized for AI-agent consistency.

**Key Workflows:**

- Create Architecture - Decision-focused architectural planning
- Check Implementation Readiness - Validates PRD and architecture alignment
- Technical research and evaluation

### Developer (Amelia)

Implements user stories following strict TDD methodology.

**Key Workflows:**

- Dev Story - Execute stories with red-green-refactor cycle
- Quick Dev - Flexible development with optional planning
- Code Review - Adversarial review finding specific issues

**Development Rules:**

1. Read the entire story file before implementation
2. Execute tasks/subtasks in order as written
3. Write failing tests first, then implementation
4. Mark tasks complete only when tests pass
5. Run full test suite after each task

### Product Manager (John)

Manages product vision and creates detailed PRDs.

**Key Workflows:**

- PRD creation, validation, and editing
- Epic and story creation
- Sprint planning coordination

### Scrum Master (Bob)

Facilitates agile ceremonies and sprint execution.

**Key Workflows:**

- Create Story - Generate implementation-ready stories
- Sprint Planning - Manage sprint status tracking
- Sprint Status - Summarize progress and surface risks
- Retrospective - Review and extract lessons learned

### Quick Flow Solo Dev (Barry)

Streamlined workflow for solo developers or rapid prototyping.

**Key Workflows:**

- Quick Spec - Conversational spec engineering
- Quick Dev - Direct implementation with optional planning
- Integrated spec-to-code workflow

### Test Architect (Murat)

Expert in test strategy and automation frameworks.

**Key Workflows:**

- Test Design - System-level testability review
- Test Framework - Initialize Playwright or Cypress
- ATDD - Generate failing acceptance tests before implementation
- Test Automation - Expand coverage after implementation
- Test Review - Quality validation against best practices
- NFR Assessment - Non-functional requirements validation
- CI Pipeline - Scaffold quality pipelines

**Knowledge Base:**

Accesses comprehensive testing knowledge covering:

- API, component, and contract testing patterns
- Fixture architecture and composition
- Network mocking and recording
- CI/CD burn-in and test healing
- Non-functional requirements validation

### Technical Writer (Paige)

Creates clear, standards-compliant documentation.

**Key Workflows:**

- Document Project - Comprehensive brownfield analysis
- Generate Mermaid Diagrams - Architecture, sequence, flow diagrams
- Excalidraw Diagrams - Flowcharts, architecture, data flow
- Validate Documentation - Standards compliance checking
- Explain Concept - Clear technical explanations

**Documentation Standards:**

- CommonMark strict compliance
- No time estimates in documentation
- Task-oriented, active voice writing
- Accessibility-first approach

### UX Designer (Sally)

Plans user experience patterns and visual design.

**Key Workflows:**

- Create UX Design - Plan UX patterns and visual style
- Excalidraw Wireframes - Create app/website wireframes
- Design system recommendations

## Workflow Commands

In addition to agents, BMAD provides direct workflow commands:

```bash
/bmad:bmm:workflows:dev-story          # Execute a story
/bmad:bmm:workflows:code-review        # Adversarial code review
/bmad:bmm:workflows:create-story       # Create next user story
/bmad:bmm:workflows:sprint-planning    # Sprint status tracking
/bmad:bmm:workflows:quick-spec         # Conversational spec engineering
/bmad:bmm:workflows:quick-dev          # Flexible development
```

## Configuration

Agent behavior is configured in `_bmad/bmm/config.yaml`:

```yaml
project_name: wezer
user_name: Samy.rabah-montarou
communication_language: English
output_folder: "{project-root}/_bmad-output"
```

Agent customizations are stored in `_bmad/_config/agents/`.

## Output Locations

- **Planning artifacts:** `_bmad-output/planning-artifacts/`
- **Implementation artifacts:** `_bmad-output/implementation-artifacts/`
- **Project knowledge:** `docs/`

## Best Practices

1. **Start with the right agent** - Match the agent to your current task
2. **Use workflows** - Agents provide structured workflows for common tasks
3. **Follow the menu** - Each agent displays a numbered menu of available actions
4. **Leverage specialization** - Use the Test Architect for testing, Technical Writer for docs
5. **Multi-agent collaboration** - Use Party Mode for complex discussions requiring multiple perspectives

workspace "ADR Workspace" "Architecture Decision Records Management" {
    !adrs decisions
    configuration {
      scope landscape
    }
    model {
        user = person "User" "An architect or stakeholder managing architectural decisions."
        
        softwareSystem = softwareSystem "Architecture Explorer" "A Kami-styled architecture and decision exploration platform." {
            
            group "Application Layer" {
                webUI = container "Web UI" "Interactive 2D/3D architecture viewer." "TypeScript / React"
                navigationService = container "Navigation Service" "Handles drill-down and semantic zoom." "Node.js"
            }
            
            group "Integration Layer" {
                structurizrAdapter = container "Structurizr Adapter" "Consumes workspace.json and styling." "Node.js"
                adrParser = container "ADR Parser" "Extracts decisions and metadata." "Node.js"
            }
            
            group "Data Layer" {
                workspaceCache = container "Workspace Cache" "Caches compiled architecture model." "Redis"
                adrIndex = container "ADR Index" "Full-text searchable decision records." "PostgreSQL"
            }
            
            group "Rendering Layer" {
                structurizrRenderer = container "Structurizr Renderer" "2D Kami-styled C4 views." "Structurizr Lite"
                svgRenderer = container "SVG Renderer" "Specialized state and lifecycle diagrams." "D3.js / Kami SVG"
                threeJsRenderer = container "Three.js Renderer" "Spatial 3D architecture explorer." "Three.js"
            }
        }
        
        structurizrLite = softwareSystem "Structurizr Lite" "Canonical C4 architecture model and views." {
            group "Core" {
                dslParser = container "DSL Parser" "Parses workspace.dsl"
                modelEngine = container "Model Engine" "Compiles architecture model"
            }
            group "Visualization" {
                diagramRenderer = container "Diagram Renderer" "Renders C4 views"
            }
        }
        
        adrs = softwareSystem "Architecture Decisions" "Markdown-based decision records with metadata." {
            group "Storage" {
                decisionFiles = container "Decision Files" "ADR/*.md files"
                metadata = container "Metadata" "YAML frontmatter in ADRs"
            }
        }
        
        # System relationships
        user -> softwareSystem "Explores architecture"
        user -> structurizrLite "Views canonical models"
        softwareSystem -> structurizrLite "Reads from"
        softwareSystem -> adrs "References decisions"
    }
    
    views {
        systemLandscape "SystemLandscape" {
            title "System Landscape: Architecture Decision Records Management"
            description "High-level view of all systems and their relationships."
            include *
            autoLayout
        }
        
        systemContext softwareSystem "ArchitectureExplorer" {
            title "System Context: Architecture Explorer"
            description "The Architecture Explorer in its ecosystem, showing external dependencies."
            include *
            autoLayout
        }
        
        # Phase 3: Context-Preserving Container View
        # This view shows the Architecture Explorer's containers with surrounding systems visible but faded
        container softwareSystem "ArchitectureExplorerWithContext" {
            title "Architecture Explorer: Internal Architecture with Surrounding Context"
            description "Detailed view of the Architecture Explorer's layers and containers, with surrounding systems visible in subdued context."
            
            # Include the primary system's containers
            include softwareSystem.webUI
            include softwareSystem.navigationService
            include softwareSystem.structurizrAdapter
            include softwareSystem.adrParser
            include softwareSystem.workspaceCache
            include softwareSystem.adrIndex
            include softwareSystem.structurizrRenderer
            include softwareSystem.svgRenderer
            include softwareSystem.threeJsRenderer
            
            # Include relationships within the system
            include softwareSystem -> structurizrLite
            include softwareSystem -> adrs
            
            # Include external context (surrounding systems shown faded)
            include structurizrLite
            include adrs
            include user
            
            autoLayout
        }
        
        # Phase 3: Layer-focused views with context
        # Application Layer detail with context
        component webUI "ApplicationLayerDetail" {
            title "Application Layer: Web UI Component with Context"
            description "Web UI implementation with external system references shown for context."
            include webUI
            include navigationService
            include structurizrRenderer
            include svgRenderer
            include threeJsRenderer
            include user
            autoLayout
        }
        
        # Integration Layer detail with context
        component structurizrAdapter "IntegrationLayerDetail" {
            title "Integration Layer: Adapter Components with Context"
            description "Integration components showing how external systems are consumed."
            include structurizrAdapter
            include adrParser
            include structurizrLite
            include adrs
            autoLayout
        }
        
        theme themes/kami/theme.json
    }
    
    # Phase 3: Add styling rules for context preservation
    styles {
        # Muted styling for context elements (surrounding systems)
        element "Muted" {
            opacity 0.4
            color #777064
            stroke #B8B1A4
            strokeWidth 1
        }
        
        # Ink styling for focused elements (primary system)
        element "Focus" {
            color #1B365D
            stroke #1B365D
            strokeWidth 2
        }
        
        # Graphite styling for context background
        element "Context" {
            color #777064
            opacity 0.6
            stroke #B8B1A4
            strokeWidth 1
        }
    }
}
workspace "ADR Workspace" "Architecture Decision Records Management" {
    !adrs decisions
    configuration {
      scope softwareSystem
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
        
        structurizrLite = softwareSystem "Structurizr Lite" "Canonical C4 architecture model and views."
        
        adrs = softwareSystem "Architecture Decisions" "Markdown-based decision records with metadata."
        
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
        # Shows the Architecture Explorer's containers with surrounding systems visible but faded
        container softwareSystem "ArchitectureExplorerContainers" {
            title "Architecture Explorer: Internal Architecture with Surrounding Context"
            description "Detailed view of the Architecture Explorer's four layers and nine containers, with external systems visible for context preservation."
            include *
            include structurizrLite
            include adrs
            include user
            autoLayout
        }
        
        # Structurizr Lite system context
        systemContext structurizrLite "StructurizrLiteContext" {
            title "Structurizr Lite: Canonical Architecture Model"
            description "The authoritative Structurizr-based architecture model and its relationships."
            include *
            autoLayout
        }
        
        # Architecture Decisions system context
        systemContext adrs "ArchitectureDecisionsContext" {
            title "Architecture Decisions: Decision Records and History"
            description "The system of record for architectural decisions and their rationale."
            include *
            autoLayout
        }
        
        theme themes/kami/theme.json
        
        # Phase 3: Context preservation styling tags
        # Structurizr opacity values require integer percentages from 0 to 100.
        styles {
            element "Muted" {
                opacity 40
            }
            
            element "Focus" {
                opacity 100
            }
            
            element "Context" {
                opacity 60
            }
        }
    }
}
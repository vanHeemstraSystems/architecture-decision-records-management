workspace "ADR Workspace" "Architecture Decision Records Management" {
    !adrs decisions
    configuration {
      scope landscape
    }
    model {
        user = person "User" "A user of the management platform."
        softwareSystem = softwareSystem "Software System" "My primary application."
        user -> softwareSystem "Uses" "Web Browser (HTTPS)"
    }
    views {
        systemContext softwareSystem "SystemContext" {
            include *
            autoLayout
        }
        theme default
    }
}
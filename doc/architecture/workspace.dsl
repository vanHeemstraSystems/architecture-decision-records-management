workspace "ADR Workspace" "Architecture Decision Records Management" {
    !adrs decisions
    model {
        user = person "User" "A user of the management platform."
        softwareSystem = softwareSystem "Software System" "My primary application."
        user -> softwareSystem "Uses"
    }
    views {
        systemContext softwareSystem "SystemContext" {
            include *
            autoLayout
        }
        theme default
    }
}
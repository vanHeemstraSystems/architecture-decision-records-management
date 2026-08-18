workspace "Kami Architecture Theme" {

    description "A warm, context-preserving visual language for architecture exploration."
    
    model {
        # This is a theme-only workspace
        # It defines styles that can be exported and applied to other workspaces
    }

    views {
        
        # Design tokens as a reference
        # canvas:       #f5f4ed  (warm parchment)
        # ink:          #1B365D  (ink blue - primary emphasis)
        # text:         #2C2924  (dark neutral - readable text)
        # muted:        #777064  (warm graphite - subdued elements)
        # border:       #B8B1A4  (soft neutral - subtle boundaries)
        # surface:      #F5F4ED  (canvas equivalent)
        # surfaceMuted: #EFEDE4  (muted surface for secondary containers)
        # accent:       #1B365D  (ink blue - same as ink)
        # neutral:      #9E978B  (warm taupe - neutral elements)

        # System-level styles
        styles {
            
            # Default element style
            element "Element" {
                shape RoundedBox
                background #F5F4ED
                color #2C2924
                stroke #B8B1A4
                strokeWidth 1
                fontSize 12
            }

            # Person style - ink emphasis
            element "Person" {
                shape RoundedBox
                background #F5F4ED
                color #1B365D
                stroke #1B365D
                strokeWidth 2
                fontSize 14
                metadata false
                icon https://raw.githubusercontent.com/gist/...
            }

            # Software System - primary architectural level
            element "Software System" {
                shape RoundedBox
                background #F5F4ED
                color #1B365D
                stroke #1B365D
                strokeWidth 2
                fontSize 14
                icon ""
            }

            # Container - secondary level
            element "Container" {
                shape RoundedBox
                background #EFEDE4
                color #2C2924
                stroke #9E978B
                strokeWidth 1
                fontSize 12
            }

            # Component - tertiary level
            element "Component" {
                shape RoundedBox
                background #F5F4ED
                color #2C2924
                stroke #B8B1A4
                strokeWidth 1
                fontSize 11
            }

            # Deployment Node - infrastructure
            element "Deployment Node" {
                shape Box
                background #EFEDE4
                color #2C2924
                stroke #9E978B
                strokeWidth 1
                fontSize 11
            }

            # Relationship style - restrained and curved
            relationship "Relationship" {
                color #777064
                thickness 1
                routing Curved
                fontSize 10
            }

            # Highlight styles for interaction states
            element "Selected" {
                color #1B365D
                stroke #1B365D
                strokeWidth 2
            }

            element "Highlight" {
                color #1B365D
                background #F5F4ED
            }

            element "Faded" {
                opacity 0.4
            }

            element "Muted" {
                color #777064
                stroke #B8B1A4
                strokeWidth 1
                opacity 0.6
            }

        }

    }

}

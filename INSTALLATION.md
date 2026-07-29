# Installation

## Installing ASDF

Run the following commands to install the current stable release:
```bash
# Create the proper target directories
mkdir -p ~/.asdf/bin ~/.asdf/shims

# Download the precompiled binary from the official repository
curl -sSL https://github.com/asdf-vm/asdf/releases/download/v0.20.0/asdf-v0.20.0-linux-386.tar.gz | tar -xz -C ~/.asdf/bin/
```

### Register the PATH variables

Add the new paths to your .bashrc profile:
```bash
echo 'export PATH="$HOME/.asdf/bin:$HOME/.asdf/shims:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Confirm the installation

Verify that the tool is ready to use:
```bash
asdf --version
```

## Installing ADR Tools

1. Add the adr-tools plugin to your asdf manager
```bash
asdf plugin add adr-tools https://gitlab.com/td7x/asdf/adr-tools.git
```

2. Install the latest stable version of ADR-Tools
```bash
asdf install adr-tools latest
```

3. Set the installed version as your global default
```bash
asdf global adr-tools latest
```

Alternative: Per-Project Configuration

If you prefer to configure a specific version restricted only to your architecture-decision-records-management project workspace instead of globally, run these commands inside your project root folder:
```bash
# Install the latest version locally
asdf install adr-tools latest

# Assign the version strictly to this directory
asdf local adr-tools latest
```

This local setup generates or updates a `.tool-versions` config file inside your repository, allowing you to share the required environment version with other developers.

Confirming the Installation

Test if your installation succeeded by attempting to initialize a structural repository log:
```bash
adr help
```
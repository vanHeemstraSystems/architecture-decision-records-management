# Visualisation

Based on [Visualising ADRs](https://dev.to/simonbrown/visualising-adrs-3klm)

If you have a folder of ADRs created using Nat's tool, you can get this visualisation for free with [Structurizr Lite](https://structurizr.com/help/lite) in under 5 minutes.


## 1. Create a workspace.dsl file

Create a file named `workspace.dsl` next to your folder of ADRs (here: `docs/architecture/workspace.dsl`).

Add the following content to that file.

```bash
workspace {
    !adrs decisions
}
```

This says, "create a workspace, and load the ADRs from the `decisions` sub-directory".

## 2. Start Structurizr Lite

Assuming that you have Docker installed, you can now start Structurizr Lite with the following commands:

```docker
docker pull structurizr/lite
docker run -it --rm -p 8080:8080 -v PATH:/usr/local/structurizr structurizr/lite
```

Be sure to replace `PATH` with the full path to the directory containing your `workspace.dsl` file (here: `doc/architecture`). So:

```docker
docker run -it --rm -p 8080:8080 -v /workspaces/architecture-decision-records-management/doc/architecture:/usr/local/structurizr structurizr/lite
```

## 3. Open Structurizr Lite

Open the workspace in a web browser by heading to http://localhost:8080 and you should see your decisions.

You can now click through the decisions, and press the Space key to open the quick navigation feature. Click the little graph button underneath the heading, and the visualisation will open.

MORE ...
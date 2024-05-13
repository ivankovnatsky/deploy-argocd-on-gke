import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const defaultLocation = "europe-central2";

const clusterName = "my-gke-cluster";

const nodePoolName = "my-node-pool";
const machineType = "e2-medium";
const machineDiskSizeGb = 10;

const _default = new gcp.serviceaccount.Account("default", {
    accountId: "gke-service-account-id",
    displayName: "GKE Service Account",
});

// We don't configure dedicated VPC to simplify setup and minimize costs.
const primary = new gcp.container.Cluster("primary", {
    name: clusterName,
    location: defaultLocation,
    removeDefaultNodePool: true,
    initialNodeCount: 1,
    // Normally this would not be needed, but since it's a test code
    // we could have a comfort of omitting manually disabling up
    // deletion protection in GCP UI.
    deletionProtection: false,
});

const primaryPreemptibleNodes = new gcp.container.NodePool("primary_preemptible_nodes", {
    name: nodePoolName,
    location: defaultLocation,
    cluster: primary.name,
    nodeCount: 1,
    nodeLocations: [
        defaultLocation + "-a",
    ],
    autoscaling: {
        maxNodeCount: 1,
        minNodeCount: 0,
    },
    nodeConfig: {
        preemptible: true,
        machineType: machineType,
        diskSizeGb: machineDiskSizeGb,
        serviceAccount: _default.email,
        oauthScopes: ["https://www.googleapis.com/auth/cloud-platform"],
    },
});

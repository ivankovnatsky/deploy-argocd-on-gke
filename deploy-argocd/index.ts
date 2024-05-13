import * as k8s from "@pulumi/kubernetes";

const argoCdNamespace = new k8s.core.v1.Namespace("argoCdNamespace", {
    metadata: {
        name: "argocd",
    },
});

const argoCdDeployment = new k8s.kustomize.Directory("ArgoCD", {
    directory: "./argocd/",
});

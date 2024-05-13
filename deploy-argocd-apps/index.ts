import * as k8s from "@pulumi/kubernetes";

const guestBookNamespace = new k8s.core.v1.Namespace("guestbook", {
    metadata: {
        name: "guestbook",
    },
})

const guestBookRepo = new k8s.yaml.ConfigGroup("example", {
    yaml: `
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: guestbook
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/ivankovnatsky/argocd-example-apps.git
    targetRevision: HEAD
    path: guestbook
  destination:
    server: https://kubernetes.default.svc
    namespace: guestbook
  syncPolicy:
    automated:
      selfHeal: true
      prune: true
`,
})

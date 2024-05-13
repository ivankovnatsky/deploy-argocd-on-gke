# configure-argocd-on-gke

## Configure

Enter develop mode using nix command:

```console
nix develop -c zsh
```

Setup google cloud CLI access:

```console
gcloud init
gcloud auth application-default login
```

Follow instructions of the interactively CLI and configure default project and
region.

Deploy GKE:

```
pulumi up \
  --cwd deploy-gke \
  --stack dev \
  --yes
```

Get kubernetes credentials:

```console
export PROJECT_ID=
gcloud container clusters get-credentials my-gke-cluster \
  --zone europe-central2 \
  --project $PROJECT_ID
```

Deploy Argo CD:

```console
pulumi up \
  --cwd deploy-argocd \
  --stack dev \
  --yes
```

## Prepare

These are the imperative configurations done to tweak and set this repo up.

Add new pulumi project for GKE deployment:

```console
pulumi new gcp-typescript \
  --dir deploy-gke \
  --name deploy-gke \
  --description "Deploy GKE" \
  --stack dev
```

Add pulumi project for deploying Argo CD:

```console
pulumi new kubernetes-typescript \
  --dir deploy-argocd \
  --name deploy-argocd \
  --description "Deploy Argo CD" \
  --stack dev
```

Add pulumi project to configure Argo CD apps:

```console
pulumi new kubernetes-typescript \
  --dir deploy-argocd-apps \
  --name deploy-argocd-apps \
  --description "Deploy Argo CD Apps" \
  --stack dev
```

Create gh repo:

```console
gh repo create deploy-argocd-on-gke
```

## TODO

- [x] Create flake.nix file to define all tools needed for spinning up GKE and
other tools
- [x] Review imperative commands and place them under appropriate heading
- [x] Describe GCP infra code
  - [x] Possibly implement this in Pulumi in typescript
- [x] Describe Argo CD installation into already configured GKE
  - [x] Implement that in typescript
- [ ] Configure Argo CD app that will point to a private git repo
  - [ ] Add a private repo
  - [ ] Configure sealed-secrets to deploy that configuration
- [ ] Add a CI that would deploy GKE and Argo CD as well
  - [ ] Configure secrets and other items
- [ ] Any way to share node_modules between projects?

## References

* https://www.pulumi.com/registry/packages/gcp/api-docs/container/cluster/#with-a-separately-managed-node-pool-recommended
* https://www.pulumi.com/registry/packages/kubernetes/api-docs/kustomize/directory/
* https://argo-cd.readthedocs.io/en/stable/operator-manual/installation/#kustomize
* https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/
* https://www.pulumi.com/blog/nx-monorepo/
* https://hub.docker.com/r/corelab/ks-guestbook-demo/tags
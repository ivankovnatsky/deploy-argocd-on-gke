{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = import nixpkgs {
            inherit system;
            config = {
              allowUnfree = true;
            };
          };
        in
        with pkgs;
        {
          devShells.default = mkShell {
            buildInputs = [
              (google-cloud-sdk.withExtraComponents [ google-cloud-sdk.components.gke-gcloud-auth-plugin ])
              argocd
              k9s
              kubectl
              nodejs
              (pulumi.withPackages (ps: with ps; [
                pulumi-language-nodejs
              ]))
            ];
            shellHook = ''
              $SHELL
            '';
          };
        }
      );
}

{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/062ca2a9370a27a35c524dc82d540e6e9824b652";
    flake-utils.url = "github:numtide/flake-utils/b1d9ab70662946ef0850d488da1c9019f3a9752a";
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

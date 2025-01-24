import { build, emptyDir } from "jsr:@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    // package.json properties
    name: Deno.args[0],
    version: Deno.args[1],
    description: "Pigeon Protocol for end-to-end encryption.",
    license: "MIT",
    homepage: "https://github.com/jacobhaap/pigeon-protocol/#readme",
    repository: {
      type: "git",
      url: "git+https://gitlab.com/jacobhaap/pigeon-protocol.git",
    },
    bugs: {
      url: "https://github.com/jacobhaap/pigeon-protocol/issues",
    },
    author: {
        name: "Jacob V. B. Haap",
        url: "https://iacobus.xyz/"
    },
    keywords: [
        "pigeon",
        "encryption",
        "e2ee"
    ]
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});

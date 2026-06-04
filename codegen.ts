import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: "./src/graphql/typeDefs.graphql",
    generates: {
        "./src/interface/graphql.interface.ts": {
            plugins: ["typescript"],
        },
    },
};
export default config;

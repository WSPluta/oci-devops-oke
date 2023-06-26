import { getVersionGradle } from "./lib/gradle.mjs";
import { getNpmVersion } from "./lib/npm.mjs";
import { exitWithError, readEnvJson } from "./lib/utils.mjs";

const shell = process.env.SHELL | "/bin/zsh";
$.shell = shell;
$.verbose = false;

const { regionKey, namespace } = await readEnvJson();

await createKustomizationYaml(regionKey, namespace);

async function createKustomizationYaml(regionKey, namespace) {
  const pwdOutput = (await $`pwd`).stdout.trim();
  await cd("./src/hello-server");
  const helloVersion = await getNpmVersion();
  await cd("../src/auth-server");
  const authVersion = await getNpmVersion();
  await cd("../src/japp-server");
  const jappVersion = await getVersionGradle();
  await cd("..");

  await cd("./k8s/overlay/prod");
  try {
    let { exitCode, stderr } =
      await $`sed 's/REGION_KEY/${regionKey}/' kustomization.yaml_template \
           | sed 's/AUTH_VERSION/${authVersion}/' \
           | sed 's/HELLO_VERSION/${helloVersion}/' \
           | sed 's/JAPP_VERSION/${jappVersion}/' \
           | sed 's/NAMESPACE/${namespace}/' > kustomization.yaml`;
    if (exitCode !== 0) {
      exitWithError(`Error creating kustomization.yaml: ${stderr}`);
    }
    console.log(`Overlay ${chalk.green("kustomization.yaml")} created.`);
  } catch (error) {
    exitWithError(error.stderr);
  } finally {
    await cd(pwdOutput);
  }
}
